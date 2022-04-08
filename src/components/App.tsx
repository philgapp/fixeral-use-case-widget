import { ApiProvider } from "@context/api";
import { UIProvider, useUI } from "@context/ui";
import { StoreProvider, useStore } from "@context/store";
import { Form } from "@components/form";
import { Dashboard } from "@components/dashboard";
import { AddToCart } from "@components/add-to-cart";
//import { Recharge } from "./recharge";
import { useConfig } from "@context/config";
import { FC, useEffect, useState } from "react";
import { useDeliveryDoorstep, useDeliveryPickup } from "@hooks/api";
import {
    SHIPPING_PLACE,
    SHIPPING_SLOT,
    SHIPPING_TYPE
    } from "@constants/index";
import { AvailableDateSlot, DeliveryType, Store } from "@schema/types";
//import { useNewUseCase } from "@hooks/state";

const UseCaseApp: FC = () => {
    const { newUseCase } = useStore()

    return (
        <>
            { newUseCase
                ? <Form/>
                : <Dashboard/>
            }
        </>
    );
};
/*
const RechargeApp: FC = () => {
    const [initial, setInitial] = useState<Partial<Store>>({});
    const [loaded, setLoaded] = useState(false);
    //const { recharge } = useConfig();

    const { setStep } = useUI();

    const [
        getDeliveryDoorstep,
        { data: doorstepData, loading: doorstepLoading, error: doorstepError },
    ] = useDeliveryDoorstep();

    const [
        getDeliveryPickup,
        { data: pickupData, loading: pickupLoading, error: pickupError },
    ] = useDeliveryPickup();

    useEffect(() => {
        console.log("test hard-coding size")
        setInitial({
            size: "Mini & Mean",
        })
        if (recharge) {
            const {
                properties: {
                    [SHIPPING_TYPE]: deliveryType,
                    [SHIPPING_PLACE]: place,
                    [SHIPPING_SLOT]: slot
                },
            } = recharge;

            if (deliveryType === DeliveryType.Pickup) {
                getDeliveryPickup({ id: place });
            } else {
                getDeliveryDoorstep({ timeEntryId: slot });
            }
        }
    }, []);

    useEffect(() => {
        const findSelectedSlot = (slots: AvailableDateSlot[], id: number) => {
            for (const { timeEntries, date } of slots) {
                const timeEntry = timeEntries.find(
                    (timeEntry) => timeEntry.id === id
                );

                if (timeEntry) {
                    return {
                        timeEntry,
                    };
                }
            }
            return {};
        };

        const getSelectedTimeEntry = (
            slots: AvailableDateSlot[],
            id: number
        ) => {
            const slot = findSelectedSlot(slots, id);

            if (slot && slot.timeEntry) {
                const {
                    timeEntry: { id, startTime, endTime, variantId },
                } = slot;
                return {
                    id,
                    startTime,
                    endTime,
                    variantId,
                };
            }
        };

        const select = () => {
            if (!recharge) {
                throw "`recharge` property is missing.";
            }

            const {
                properties: {
                    [SHIPPING_PLACE]: place,
                    [SHIPPING_TYPE]: deliveryType,
                    [SHIPPING_SLOT]: slot,
                },
                address,
                nextChargeScheduledAt,
            } = recharge;

            if (pickupData) {
                const location = pickupData.find(({ id }) => id === place);
                if (!location) {
                    throw "Unable to find selected location.";
                }

                const { id, price, slots, name } = location;
                const timeEntry = getSelectedTimeEntry(slots, slot);
                if (!timeEntry) {
                    throw "Unable to find selected timeEntry.";
                }

                setStep(3);
                setInitial({
                    type: deliveryType,
                    location: {
                        id,
                        price,
                        slots,
                        name,
                        address: location.address,
                    },
                    address,
                    timeEntry: {
                        ...timeEntry,
                        date: new Date(nextChargeScheduledAt),
                    },
                });
                console.log("pickup data - variantId " + timeEntry.variantId)
                return;
            }

            if (doorstepData) {
                const location = doorstepData.find(({ id }) => id === place);
                if (!location) {
                    throw "Unable to find selected location.";
                }

                const { id, price, slots, zipCode } = location;
                const timeEntry = getSelectedTimeEntry(slots, slot);
                if (!timeEntry) {
                    throw "Unable to find selected timeEntry.";
                }

                setStep(3);
                setInitial({
                    type: deliveryType,
                    location: { id, name:"", price, slots, zipCode },
                    address,
                    timeEntry: {
                        ...timeEntry,
                        date: new Date(nextChargeScheduledAt),
                    },
                });
                return;
            }
        };

        try {
            select();
        } catch (error) {
            console.error(`delivery-widget: ${error}`);
            setLoaded(true);
        }
    }, [pickupData, doorstepData]);

    if (!initial.type && !loaded) {
        return (
            <div className="animate-pulse opacity-40 space-y-2 px-6 py-4">
                <div className="h-4 bg-decent rounded w-3/5"></div>
                <div className="h-4 bg-decent rounded w-4/5"></div>
            </div>
        );
    }

    return (
        <StoreProvider initial={initial}>
            <Form initialized />
            <Recharge />
        </StoreProvider>
    );
};

 */

const App: FC = (props) => {

    return (
        <ApiProvider>
            <UIProvider>
                <StoreProvider>
                    <div className="font-sans text-base">
                        <UseCaseApp {...props} />
                    </div>
                </StoreProvider>
            </UIProvider>
        </ApiProvider>
    );
};

export default App;
