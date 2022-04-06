import { FC, useEffect, useMemo, useState } from "react";
import { useDeliveryPickup } from "@hooks/api";
import Map from "./Map";
import List, { ListItemSkeleton } from "./List";
import { ErrorBox } from "@components/ui";

import s from "./Pickup.module.css";
import { useGeolocation } from "@hooks/geolocation";
import { useStore } from "@context/store";

export interface SharedState {
    selected: number;
    setSelected: (index: number) => void;
}

const PickupPicker: FC = () => {
    const { coords } = useGeolocation();
    const { size } = useStore()

    const [selected, setSelected] = useState(-1);
    const [loaded, setLoaded] = useState(false);

    const [getDeliveryPickups, { data, loading, error }] = useDeliveryPickup();

    useEffect(() => {
        getDeliveryPickups({ size: size, coords });
    }, [coords, size]);

    useEffect(() => {
        if (!loaded && data && data.length > 0) {
            setLoaded(true);
        }
    }, [data]);

    if (error) {
        return <ErrorBox />;
    }

    const _data = useMemo(() => (data ? data : []), [data]);

    return (
        <div className="h-full sm:flex sm:flex-row-reverse">
            <div className="h-1/2 sm:h-full sm:w-2/3">
                <Map
                    locations={_data}
                    selected={selected}
                    setSelected={setSelected}
                    coords={coords}
                />
            </div>
            <div className={s.list}>
                {loading && !loaded ? (
                    <>
                        <ListItemSkeleton />
                        <ListItemSkeleton />
                        <ListItemSkeleton />
                        <ListItemSkeleton />
                    </>
                ) : (
                    <List
                        locations={_data}
                        selected={selected}
                        setSelected={setSelected}
                    />
                )}
            </div>
        </div>
    );
};

export default PickupPicker;
