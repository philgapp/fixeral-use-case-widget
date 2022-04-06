import { DoorstepDeliveryLocation } from "@api/index";
import { Button } from "@components/ui";
import {
    PROPERTY_SHIPPING_COUNTRY,
    PROPERTY_SHIPPING_PLACE_ID,
    PROPERTY_SHIPPING_SLOT_ID,
    PROPERTY_SHIPPING_PLACE_NAME,
    PROPERTY_SHIPPING_SLOT_NAME,
    PROPERTY_SHIPPING_TYPE,
    PROPERTY_SHIPPING_ZIP_CODE,
} from "@constants/index";
import { useConfig } from "@context/config";
import { useStore } from "@context/store";
import { DeliveryType } from "@schema/types";
import { FC, useEffect, useMemo } from "react";
import { useDeliveryPickup } from "@hooks/api";

const AddToCart: FC = () => {
    const { size, setSize, timeEntry, location, type } = useStore();
    const [getDeliveryPickups, { data, loading, error }] = useDeliveryPickup();
    const _data = useMemo(() => (data ? data : []), [data]);

    const { sizeSelectorId, variantSelectorId, country } = useConfig();

    const handleSizeChange = (e: any) => {
        const sizeSelector = getSizeSelector()
        if(sizeSelector) {
            sizeSelector.value = e.target.value
        }
        if(size !== e.target.value) {
            setPrice()
            setSize(e.target.value)
        }

        // Call API to get variant ID
        getDeliveryPickups({ size: e.target.value });

        // Call selectVariant()
        //selectVariant()
    }

    const getVariantIdBySize = () => {
        let result:string = ""
        if(size && variantSelectorId) {
            const variantSelector = document.getElementById(
                variantSelectorId
            ) as HTMLSelectElement;

            const variantOptions = variantSelector.options

            // Find and return the desired option variant id using size and type from option text
            const selectLength = variantOptions.length;

            for(let i=0; i<selectLength;i++){
                // .index, .value and .text available
                if (variantOptions[i].text.includes(size)) {
                    result = variantOptions[i].value;
                    break
                }
            }
        }
        return result
    }

    const getSizeSelector = () => {
        if (!sizeSelectorId) {
            console.error("delivery-widget: `sizeSelectorId` is required");
            return;
        }
        const sizeSelector = document.getElementById(
            sizeSelectorId
        ) as HTMLSelectElement;

        return sizeSelector
    }

    async function getProductData() {
        const response = await fetch('/products/the-mixy-box.js')
        const result = await response.json()
        return result
    }

    const setPrice = (variantId?:string) => {
        const priceElement = document.getElementById("widget-regular-price-item")

        getProductData()
            .then( productRaw => {
                const variant = (variantId && variantId.length > 1) ? variantId : getVariantIdBySize()
                const variantData = productRaw.variants.find( (child: { id: number; }) =>
                    child.id.toString() == variant
                )
                if(priceElement) {
                    if(variantData && variantData.price) {
                        const price = variantData.price as number
                        const priceString = price.toString()
                        const formattedPriceString = priceString.slice(0, -2)
                        const formattedPrice = parseInt(formattedPriceString)
                        priceElement.textContent = formattedPrice.toLocaleString(["da-DK","en-US"], { style: 'currency', currency: 'DKK', })
                    }
                }
            })
    }

    const selectVariant = (variantId: string) => {
        if (!variantSelectorId) {
            console.error("delivery-widget: `variantSelectorId` is required");
            return;
        }

        const variantSelector = document.getElementById(
            variantSelectorId
        ) as HTMLSelectElement;

        if (!variantSelector) {
            console.error(
                `delivery-widget: Cannot query variant selector by id ${variantSelectorId}`
            );
            return;
        }

        variantSelector.value = variantId;
        setPrice(variantId)

        const changeEvent = document.createEvent("HTMLEvents");
        changeEvent.initEvent("change", false, true);
        variantSelector.dispatchEvent(changeEvent);
    };

    useEffect(() => {
        const sizeSelector = getSizeSelector()
        if (sizeSelector) {
            if(!size || size === "") {
                setSize(sizeSelector.value)
            }
            sizeSelector.addEventListener('change', handleSizeChange, false)
        }

        return function sizeCallback() {
            if (sizeSelector) {
                setSize("")
                sizeSelector.removeEventListener('change', handleSizeChange, false)
            }
        }
    }, [])

    useEffect(() => {
        if (size) {
            selectVariant(getVariantIdBySize())
        }
        if (_data) {
            if (type && location && timeEntry?.variantId) {
                console.log("selectVariant by timeEntry")
                selectVariant(timeEntry.variantId)
            }
        }
    }, [type, location, timeEntry, size, data]);

    return (
        <>
            {type !== null && location && timeEntry && (
                <>
                    <input
                        type="hidden"
                        name={PROPERTY_SHIPPING_TYPE}
                        value={type}
                    />
                    <input
                        type="hidden"
                        name={PROPERTY_SHIPPING_PLACE_ID}
                        value={`${location.id}`}
                    />
                    {type == "pickup" && (
                        <input
                            type="hidden"
                            name={PROPERTY_SHIPPING_PLACE_NAME}
                            value={`${location.name}`}
                        />
                    ) }
                    <input
                        type="hidden"
                        name={PROPERTY_SHIPPING_SLOT_ID}
                        value={`${timeEntry.id}`}
                    />
                    {type == "pickup" && (
                        <input
                            type="hidden"
                            name={PROPERTY_SHIPPING_SLOT_NAME}
                            value={`${timeEntry.date}: ${timeEntry.startTime} - ${timeEntry.endTime}`}
                        />
                    ) }
                    <input
                        type="hidden"
                        name={PROPERTY_SHIPPING_COUNTRY}
                        value={`${country}`}
                    />
                    <input
                        type="hidden"
                        name={PROPERTY_SHIPPING_ZIP_CODE}
                        value={
                            type === DeliveryType.Doorstep
                                ? `${
                                      (location as DoorstepDeliveryLocation)
                                          .zipCode
                                  }`
                                : ""
                        }
                    />
                </>
            )}
            <Button
                rounded
                primary
                disabled={!(type !== null && location && timeEntry)}
                type="submit"
            >
                Add to cart
            </Button>
        </>
    );
};
export default AddToCart;
