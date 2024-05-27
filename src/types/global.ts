import { Cart, Product, ProductCategory, ProductVariant, Region, ShippingMethod, Store } from "@medusajs/medusa"
import { PricedProduct, PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { ProductCollection } from "@medusajs/product"

type WithStore<T> = {
  store: Pick<Store, "id" | "name">,
  store_id: string
} & T

export type ExtendedProduct = WithStore<Product>

export type ExtendedPriceProduct = WithStore<PricedProduct>

export type ExtendedPricedShippingOption = WithStore<PricedShippingOption>

export type ExtendedShippingMethod = ShippingMethod & {
  shipping_option: ExtendedPricedShippingOption
}

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type ProductPreviewType = {
  id: string
  title: string
  handle: string | null
  thumbnail: string | null
  created_at?: Date
  store: Store
  price?: {
    calculated_price: string
    original_price: string
    difference: string
    price_type: "default" | "sale"
  }
  isFeatured?: boolean
}

export type ProductCollectionWithPreviews = Omit<
  ProductCollection,
  "products"
> & {
  products: ProductPreviewType[]
}

export type InfiniteProductPage = {
  response: {
    products: PricedProduct[]
    count: number
  }
}

export type ProductVariantInfo = Pick<ProductVariant, "prices">

export type RegionInfo = Pick<Region, "currency_code" | "tax_code" | "tax_rate">

export type CartWithCheckoutStep = Omit<
  Cart,
  "beforeInsert" | "beforeUpdate" | "afterUpdateOrLoad"
> & {
  checkout_step: "address" | "delivery" | "payment"
}

export type ProductCategoryWithChildren = Omit<
  ProductCategory,
  "category_children"
> & {
  category_children: ProductCategory[]
  category_parent?: ProductCategory
}
