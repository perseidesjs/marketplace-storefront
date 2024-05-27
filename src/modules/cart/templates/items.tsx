import useGroupItemsByStores from "@lib/hooks/use-group-items-by-store"
import { LineItem, Region } from "@medusajs/medusa"
import { Heading, Table, Text } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: Omit<LineItem, "beforeInsert">[]
  region?: Region
}

const ItemsTemplate = ({ items, region }: ItemsTemplateProps) => {

  const grouped = useGroupItemsByStores(items)

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
      </div>
      {Object.values(grouped).map((v) => (
        <div className="px-3.5 border-l-4 border-neutral-200 mb-16" key={v.details.id}>
          <Text className="text-base font-medium tracking-tight text-grey-70 my-4">
            Sold by {v.details.name} <span className="text-sm">({v.items?.length})</span>
          </Text>
          <Table >
            <Table.Header className="border-t-0">
              <Table.Row className="text-ui-fg-subtle txt-medium-plus">
                <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell className="hidden small:table-cell">
                  Price
                </Table.HeaderCell>
                <Table.HeaderCell className="!pr-0 text-right">
                  Total
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!!v.items?.length && region
                ? v.items
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
          </Table>
        </div>
      ))}
    </div>
  )
}


export default ItemsTemplate
