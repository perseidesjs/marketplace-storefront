import { Text } from "@medusajs/ui"

import { ExtendedPriceProduct, ProductPreviewType } from "types/global"

import { retrievePricedProductById } from "@lib/data"
import { getProductPrice } from "@lib/util/get-product-price"
import { Region } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  productPreview,
  isFeatured,
  region,
  showStoreDetails
}: {
  productPreview: ProductPreviewType
  isFeatured?: boolean
  region: Region
  showStoreDetails?: boolean
}) {
  const pricedProduct = await retrievePricedProductById({
    id: productPreview.id,
    regionId: region.id,
  }).then((product) => product as ExtendedPriceProduct)

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
    region,
  })

  return (
    <>
      {showStoreDetails && (
        <LocalizedClientLink href={`/store?storeId=${pricedProduct.store.id}`} className="flex items-center gap-1.5 mb-3.5 hover:underline">
          <div className="w-8 h-8 aspect-square rounded-full border flex items-center justify-center ">
            <div className="w-7 h-7 aspect-square rounded-full bg-neutral-100 flex items-center justify-center text-sm text-grey-50 uppercase ">
              <span className="text-sm text-neutral-700">
                {pricedProduct.store.name.at(0)}
              </span>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="text-grey-50 font-normal">Sold by</span>
            {pricedProduct.store.name}
          </span>
        </LocalizedClientLink>
      )}
      <LocalizedClientLink
        href={`/products/${productPreview.handle}`}
        className="group"
      >
        <div data-testid="product-wrapper">
          <Thumbnail
            thumbnail={productPreview.thumbnail}
            size="full"
            isFeatured={isFeatured}
          />
          <div className="flex txt-compact-medium mt-4 justify-between">
            <Text className="text-ui-fg-subtle" data-testid="product-title">{productPreview.title}</Text>
            <div className="flex items-center gap-x-2">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    </>
  )
}
