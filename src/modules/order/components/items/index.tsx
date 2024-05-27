import useGroupItemsByStores from "@lib/hooks/use-group-items-by-store"
import { LineItem, Region } from "@medusajs/medusa"
import { Table, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Item from "@modules/order/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsProps = {
  items: LineItem[]
  region: Region
}

const Items = ({ items, region }: ItemsProps) => {

  const itemsGrouped = useGroupItemsByStores(items)


  return (
    <div className="flex flex-col">
      {Object.values(itemsGrouped).map((v) => (
        <div className="px-3.5 border-l-4 border-neutral-200 mb-4 first:mt-4" key={v.details.id}>
          <Text className="text-sm font-medium tracking-tight text-grey-70 my-4">
            Sold by {v.details.name}
          </Text>
          <Table className="space-y-4 border-none">
            <Table.Body data-testid="products-table" className="border-none" key={v.details.id}>
              {!!v.items?.length && region
                ? v.items
                  .sort((a, b) => {
                    return a.created_at > b.created_at ? -1 : 1
                  })
                  .map((item) => {
                    return (
                      <Item
                        key={item.id}
                        item={item}
                        region={region}
                      />
                    )
                  })
                : Array.from(Array(5).keys()).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
            </Table.Body>
          </Table>
        </div>
      ))}
      {/* <Table>
        <Table.Body data-testid="products-table">
          {items?.length && region
            ? items
              .sort((a, b) => {
                return a.created_at > b.created_at ? -1 : 1
              })
              .map((item) => {
                return <Item key={item.id} item={item} region={region} />
              })
            : Array.from(Array(5).keys()).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
        </Table.Body>
      </Table> */}
    </div>
  )
}

export default Items
