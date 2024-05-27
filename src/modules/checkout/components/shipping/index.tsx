"use client"

import { RadioGroup } from "@headlessui/react"
import { formatAmount } from "@lib/util/prices"
import { CheckCircleSolid } from "@medusajs/icons"
import { Cart } from "@medusajs/medusa"
import { Button, Heading, Text, clx } from "@medusajs/ui"

import { setShippingMethod } from "@modules/checkout/actions"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import Radio from "@modules/common/components/radio"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ExtendedPricedShippingOption } from "types/global"

type ShippingProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
  availableShippingMethods: ExtendedPricedShippingOption[] | null
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    setIsLoading(true)
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const set = async (id: string) => {
    setIsLoading(true)
    await setShippingMethod(id)
      .then(() => {
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.toString())
        setIsLoading(false)
      })
  }

  const handleChange = (value: string) => {
    set(value)
  }

  useEffect(() => {
    setIsLoading(false)
    setError(null)
  }, [isOpen])


  const optionsGrouped = useGroupOptionsByStore(availableShippingMethods)


  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods.length === 0,
            }
          )}
        >
          Delivery
          {!isOpen && cart.shipping_methods.length > 0 && <CheckCircleSolid />}
        </Heading>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                data-testid="edit-delivery-button"
              >
                Edit
              </button>
            </Text>
          )}
      </div>
      {isOpen ? (
        <div data-testid="delivery-options-container">
          <div className="pb-8">
            {Object.values(optionsGrouped).map((v) => {
              return (
                <div key={v.details.id} className="grid content-start gap-2.5 mb-2">
                  <Text>
                    Shipping options for <strong>{v.details.name}'s</strong> products
                  </Text>
                  <RadioGroup
                    value={cart.shipping_methods[0]?.shipping_option_id}
                    onChange={(value: string) => handleChange(value)}
                  >
                    {!!v.options?.length ? (
                      v.options.map((option) => {
                        const isSelected = cart.shipping_methods.some((v) => v.shipping_option_id === option.id)
                        return (
                          <RadioGroup.Option
                            key={option.id}
                            value={option.id}
                            data-testid="delivery-option-radio"
                            className={clx(
                              "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                              {
                                "border-ui-border-interactive": isSelected,
                              }
                            )}
                          >
                            <div className="flex items-center gap-x-4">
                              <Radio
                                checked={isSelected} />
                              <span className="text-base-regular">{option.name}</span>
                            </div>
                            <span className="justify-self-end text-ui-fg-base">
                              {formatAmount({
                                amount: option.amount!,
                                region: cart?.region,
                                includeTaxes: false,
                              })}
                            </span>
                          </RadioGroup.Option>
                        )
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center px-4 py-8 text-ui-fg-base">
                        <Spinner />
                      </div>
                    )}
                  </RadioGroup>
                </div>
              )
            })}
          </div>

          <ErrorMessage
            error={error}
            data-testid="delivery-option-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!cart.shipping_methods[0]}
            data-testid="submit-delivery-option-button"
          >
            Continue to payment
          </Button>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_methods.length > 0 && (
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Methods
                </Text>
                {cart.shipping_methods?.map((sm) => {
                  const store = Object.values(optionsGrouped).find((v) => v.options?.some((opt) => opt.id === sm.shipping_option_id))
                  return (
                    <div key={sm.id} className="grid content-start mb-4">
                      <Text>
                        Shipped by {store?.details.name}
                      </Text>
                      <Text className="txt-medium text-ui-fg-subtle">
                        {sm.shipping_option.name} - {formatAmount({
                          amount: cart.shipping_methods[0].price,
                          region: cart.region,
                          includeTaxes: false,
                        })
                          .replace(/,/g, "")
                          .replace(/\./g, ",")}
                      </Text>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )
      }
      <Divider className="mt-8" />
    </div >
  )
}




const useGroupOptionsByStore = (options: ExtendedPricedShippingOption[] | null) => {
  return useMemo(() => {


    type StoreId = string
    type Value = {
      options: ShippingProps['availableShippingMethods'],
      details: ExtendedPricedShippingOption['store']
    }
    const group: Record<StoreId, Value> = {}

    options?.forEach((opt) => {
      const store = opt.store

      if (!group[store.id]) {
        group[store.id] = {
          details: store,
          options: []
        }
      }

      group[store.id] = {
        ...group[store.id],
        options: [...group[store.id].options!, opt]
      }
    })


    return group

  }, [options])
}

export default Shipping
