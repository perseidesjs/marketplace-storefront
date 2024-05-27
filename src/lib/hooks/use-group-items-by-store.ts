import { LineItem } from "@medusajs/medusa"
import { useMemo } from "react"
import { ExtendedProduct } from "types/global"

type Items = Omit<LineItem, "beforeInsert">[] | undefined

const useGroupItemsByStores = (items?: Items) => {

    return useMemo(() => { 

        type StoreId = string
        type Value = {
            items: Items,
            details: ExtendedProduct['store']
        }
        const group: Record<StoreId, Value> = {}

        items?.forEach((i) => {
            const store = (i.variant.product as ExtendedProduct).store

            if (!group[store.id]) {
                group[store.id] = {
                    details: store,
                    items: []
                }
            }

            group[store.id] = {
                ...group[store.id],
                items: [...group[store.id].items!, i]
            }

        })

        return group
    }, [items])

}

export default useGroupItemsByStores