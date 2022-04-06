import { useStore } from "@context/store";
import { Button } from "@components/ui";
import { FC, useCallback } from "react";
import { DeliveryType } from "@schema/types";

const HavingTroubles: FC = () => {
    const { type, setDeliveryType, availableDeliveryTypes } = useStore();
    const handleTryPickup = () => {
        setDeliveryType(DeliveryType.Pickup);
    };

    const handleTryDoorstep = () => {
        setDeliveryType(DeliveryType.Doorstep);
    };

    const _availableDeliveryTypes = useCallback(() => {
        return availableDeliveryTypes.map(({ type }) => type);
    }, [availableDeliveryTypes]);

    const buttonClasses = "float-left mr-2 mb-2";

    return (
        <>
            <hr className="border-t clear-both" />
            <p className="text-decent text-sm">Having troubles?</p>
            {type === DeliveryType.Pickup &&
                _availableDeliveryTypes().includes(DeliveryType.Doorstep) && (
                    <>
                        <Button
                            className={`button-no-round ${buttonClasses}`}
                            onClick={handleTryDoorstep}
                        >
                            Try with doorstep delivery
                        </Button>
                    </>
                )}
            {type === DeliveryType.Doorstep &&
                _availableDeliveryTypes().includes(DeliveryType.Pickup) && (
                    <>
                        <Button
                            className={`button-no-round ${buttonClasses}`}
                            onClick={handleTryPickup}
                        >
                            Try to find a pickup
                        </Button>
                    </>
                )}
        </>
    );
};

export default HavingTroubles;
