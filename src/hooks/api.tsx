import { useEffect } from "react";
import { useApi } from "@context/api";
import { useConfig } from "@context/config";
import { useLazyFetch } from "./";
import {
    DeliveryType,
    DoorstepDeliveryLocation,
    PickupLocation,
    TimeEntry,
} from "@api/index";
import {
    AvailableDateSlot,
    AvailableDoorstepDeliveryLocation,
    AvailableLocation,
    AvailablePickupLocation,
    Size,
} from "@schema/types";

import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, uploadBytesResumable, getDownloadURL } from "firebase/storage";


interface Coords {
    latitude?: string;
    longitude?: string;
}

const hasAvailableTimeEntry = (timeEntries: TimeEntry[]) => {
    for (const { available } of timeEntries) {
        if (available) return true;
    }
    return false;
};

const markAvailableLocations = (
    locations: (PickupLocation | DoorstepDeliveryLocation)[]
) => {
    const _locations: AvailableLocation[] = [];

    for (const location of locations) {
        const slots: AvailableDateSlot[] = [];
        let available = false;

        for (const slot of location.slots) {
            const timeEntryAvailable = hasAvailableTimeEntry(slot.timeEntries);
            slots.push({
                available: timeEntryAvailable,
                ...slot,
            });
            available = available || timeEntryAvailable;
        }
        _locations.push({
            ...location,
            available,
            slots,
        });
    }

    return _locations;
};

export const useFirebase = () => {
    // Set the configuration for your app
// TODO: Replace with your app's config object
    const firebaseConfig = {
        apiKey: '<your-api-key>',
        authDomain: '<your-auth-domain>',
        databaseURL: '<your-database-url>',
        storageBucket: 'fixeral-pilot.appspot.com'
    };
    const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = getStorage(firebaseApp);
    const partModels = ref(storage, 'partModels');
    return { partModels, ref, listAll, uploadBytesResumable, getDownloadURL }
}

export const useFakeTypes = () => {
    const { pilotId, country } = useConfig();
    const { api } = useApi();
    const deliveryTypes = {
        "test1" : "test1",
        "test2" : "test2"
    };
    const error = false;
    const loading = false;
/*
    const deliveryTypePost = () =>
        api!.deliveryTypePost({ typePayload: { pilotId, country } });
    const [getDeliveryTypes, state] = useLazyFetch<DeliveryType[]>(
        deliveryTypePost,
        {
            loading: true,
        }
    );



    useEffect(() => {
        getDeliveryTypes();
    }, []);
 */
    return { deliveryTypes, loading, error };
};

export const useDeliveryTypes = () => {
    const { pilotId, country } = useConfig();
    const { api } = useApi();

    const deliveryTypePost = () =>
        api!.deliveryTypePost({ typePayload: { pilotId, country } });
    const [getDeliveryTypes, state] = useLazyFetch<DeliveryType[]>(
        deliveryTypePost,
        {
            loading: true,
        }
    );

    useEffect(() => {
        getDeliveryTypes();
    }, []);

    return state;
};

export const useDeliveryPickup = () => {
    const { pilotId, country } = useConfig();
    const { api } = useApi();

    const deliveryPickup = async ({
        coords,
        ...payload
    }: {
        coords?: Coords;
        id?: number;
        size?: Size;
    }) => {
        const currentPosition: { lat?: string; lng?: string } = {};
        if (coords) {
            currentPosition["lat"] = coords.latitude;
            currentPosition["lng"] = coords.longitude;
        }

        const response = await api!.deliveryPickupPost({
            pickupPayload: {
                pilotId,
                country,
                ...payload,
                ...currentPosition,
            },
        });

        return markAvailableLocations(response);
    };

    const response = useLazyFetch<AvailablePickupLocation[]>(deliveryPickup);

    return response;
};

export const useDeliveryDoorstep = () => {
    const { pilotId, country } = useConfig();
    const { api } = useApi();

    const deliveryDoorstep = async (payload: {
        zipCode?: string;
        timeEntryId?: number;
    }) => {
        const response = await api!.deliveryDoorstepPost({
            doorstepPayload: { ...payload, pilotId, country },
        });
        return markAvailableLocations(response);
    };

    return useLazyFetch<AvailableDoorstepDeliveryLocation[]>(deliveryDoorstep);
};

export const useAsyncDeliveryDoorstep = () => {
    const { pilotId, country } = useConfig();
    const { api } = useApi();

    const asyncDeliveryDoorstep = async (payload: {
        zipCode?: string;
        timeEntryId?: number;
    }) => {
        const response = await api!.deliveryDoorstepPost({
            doorstepPayload: { ...payload, pilotId, country },
        });
        return markAvailableLocations(response);
    };

    return asyncDeliveryDoorstep;
};
