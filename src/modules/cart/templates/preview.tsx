"use client"

import useGroupItemsByStores from "@lib/hooks/use-group-items-by-store"
import useMounted from "@lib/hooks/use-mounted"
import { LineItem, Region } from "@medusajs/medusa"
import { Table, Text, clx } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { Fragment } from "react"

type ItemsTemplateProps = {
  items?: Omit<LineItem, "beforeInsert">[]
  region?: Region
}

const ItemsPreviewTemplate = ({ items, region }: ItemsTemplateProps) => {
  const hasOverflow = items && items.length > 4

  const grouped = useGroupItemsByStores(items)

  const isMounted = useMounted()

  if (!isMounted) return Array.from(Array(2).keys()).map((i) => (<div key={i} className="w-full h-28 rounded bg-neutral-100 animate-pulse mt-4" />))

  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      {Object.values(grouped).map((v) => (
        <div className="px-3.5 border-l-4 border-neutral-200 mb-4 first:mt-4" key={v.details.id}>
          <Text>
            Sold by {v.details.name}
          </Text>
          <Table className="space-y-4">
            <Table.Body data-testid="items-table" key={v.details.id}>
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
                        type="preview"
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
    </div >
  )
}



export default ItemsPreviewTemplate
