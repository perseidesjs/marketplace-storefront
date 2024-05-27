import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import { Store } from "@medusajs/medusa"
import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  storeId,
  store
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  storeId?: string
  store: Store | null
}) => {
  const pageNumber = page ? parseInt(page) : 1

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container" data-testid="category-container">
      <RefinementList sortBy={sortBy || "created_at"} />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products {!!store && (<>from {store.name}</>)}</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sortBy || "created_at"}
            page={pageNumber}
            countryCode={countryCode}
            storeId={storeId}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
