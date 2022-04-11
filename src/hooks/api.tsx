import React, { useEffect, useState } from "react";
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
    AvailablePickupLocation, Contact,
    Size, UseCase,
} from "@schema/types";
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, uploadBytesResumable, getDownloadURL, getMetadata } from "firebase/storage";
import { getDatabase, ref as dbRef, set as dbSet, update as dbUpdate, child, get, onValue, push } from "firebase/database";

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
        storageBucket: 'fixeral-pilot.appspot.com',
        databaseURL: "https://fixeral-pilot-default-rtdb.europe-west1.firebasedatabase.app/",
        projectId: "PROJECT_ID",
        messagingSenderId: "FIXERAL",
        appId: "FIXERAL_USE_CASE_PILOT",
        // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
        measurementId: "G-MEASUREMENT_ID",
    };
    const firebaseApp = initializeApp(firebaseConfig);

    const storage = getStorage(firebaseApp);
    const useCaseFiles = ref(storage, 'files');
    return {
        useCaseFiles,
        ref,
        listAll,
        uploadBytesResumable,
        getMetadata,
        getDownloadURL,
        getDatabase,
        dbRef,
        dbSet,
        dbUpdate,
        child,
        get,
        onValue,
        push }
}

export const useAllCases = () => {
    const { dbRef, onValue, getDatabase } = useFirebase()
    const [ allCases, setAllCases ] = useState({})
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    const getAllCases = () => {
        const db = getDatabase();
        const casesRef = dbRef(db, 'cases/');
        onValue(casesRef, (snapshot) => {
            setAllCases(snapshot.val());
            setLoading(false)
        });
    }

    useEffect(() => {
        getAllCases();
    }, []);

    return { allCases, loading, error }
}

export const saveNewUseCase = ( saveContact:Contact, saveUseCase: UseCase, setContact:Function, setUseCase:Function ) => {
    console.log("saveNewUseCase")
    console.log(saveContact)
    console.log(saveUseCase)
    const db = getDatabase()

    // Generate new ID for new use case and new user
    const newCaseKey = push(child(dbRef(db), 'cases')).key;
    const newUserKey = push(child(dbRef(db), 'users')).key;
    dbSet(dbRef(db,'cases/' + newCaseKey ), {
        id: newCaseKey,
        caseName: saveUseCase.caseName,
        owner: newUserKey,
        status: "New"
    })
        .then(() => {
            setUseCase({
                id: newCaseKey,
                caseName: saveUseCase.caseName,
                owner: newUserKey
            })
        })
    // Same for users!!!!
    dbSet(dbRef(db,'users/' + newUserKey), {
        id: newUserKey,
        firstName: saveContact.firstName,
        lastName: saveContact.lastName,
        company: saveContact.company,
        title: saveContact.title,
        email: saveContact.email
    })
        .then(() => {
            setContact({
                id: newUserKey,
                firstName: saveContact.firstName,
                lastName: saveContact.lastName,
                company: saveContact.company,
                title: saveContact.title,
                email: saveContact.email
            })
        })
}

export const updateUseCase = ( saveContact:Contact, saveUseCase: UseCase, setContact:Function, setUseCase:Function ) => {
    const db = getDatabase()
    console.log("updateUseCase")
    console.log(saveContact)
    console.log(saveUseCase)

    // Use existing ID to update case and contact
    const newCaseKey = saveUseCase.id;
    const newUserKey = saveContact.id;
    dbUpdate(dbRef(db,'cases/' + newCaseKey ), {
        id: newCaseKey,
        caseName: saveUseCase.caseName,
        owner: newUserKey,
    })
        .then(() => {
            setUseCase({
                id: newCaseKey,
                caseName: saveUseCase.caseName,
                owner: newUserKey
            })
        })
    // Same for users!!!!
    dbUpdate(dbRef(db,'users/' + newUserKey), {
        id: newUserKey,
        firstName: saveContact.firstName,
        lastName: saveContact.lastName,
        company: saveContact.company,
        title: saveContact.title,
        email: saveContact.email
    })
        .then(() => {
            setContact({
                id: newUserKey,
                firstName: saveContact.firstName,
                lastName: saveContact.lastName,
                company: saveContact.company,
                title: saveContact.title,
                email: saveContact.email
            })
        })
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

    const response = useLazyFetch<any>(deliveryPickup);

    return response;
};

/*
export const useFirebaseUseCases = () => {
    const { api } = useApi();

    const firebaseUseCases = async () => {
        const response = await api!.useCaseListener();
        return response;
    };

    return useLazyFetch<any>(firebaseUseCases);
};

 */

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
