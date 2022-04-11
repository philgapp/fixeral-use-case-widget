import React, { FC, useMemo } from "react";
import {
    NewUseCase,
    UploadProgress,
    UseCase,
    Contact,
    AvailableDeliveryType,
    DeliveryType,
    Store,
    Location,
    TimeEntry,
    Address,
    Size,
} from "@schema/types";

const initialStore: Store & Actions = {
    allUseCases: null,
    newUseCase: null,
    uploadProgress: null,
    useCase: null,
    contact: null,
    availableDeliveryTypes: [],
    type: null,
    location: null,
    timeEntry: null,
    size: null,
    reset: () => {},
    setNewUseCase: (newUseCase: NewUseCase) => {},
    setUploadProgress: (uploadProgress: UploadProgress) => {},
    setUseCase: (useCase: UseCase) => {},
    setContact: (contact: Contact) => {},
    setTimeEntry: (timeEntry: TimeEntry) => {},
    setLocation: (location: Location) => {},
    setAddress: (address: Address) => {},
    setDeliveryType: (deliveryType: DeliveryType) => {},
    setAvailableDeliveryTypes: () => {},
    setSize: (size: string) => {},
};

type Action =
    | {
        type: "SET_NEW_USE_CASE";
        newUseCase: NewUseCase;
    }
    | {
        type: "SET_UPLOAD_PROGRESS";
        uploadProgress: UploadProgress;
    }
    | {
        type: "SET_USE_CASE";
        useCase: UseCase;
    }
    | {
        type: "SET_CONTACT";
        contact: Contact;
    }
    | {
          type: "SET_AVAILABLE_DELIVERY_TYPES";
          availableDeliveryTypes: Store["availableDeliveryTypes"];
      }
    | {
          type: "SET_TYPE";
          deliveryType: DeliveryType;
      }
    | {
          type: "SET_LOCATION";
          location: Location;
      }
    | {
          type: "SET_ADDRESS";
          address: Address;
      }
    | {
          type: "SET_TIME_ENTRY";
          timeEntry: TimeEntry;
      }
    | {
            type: "SET_SIZE";
            size: Size;
        }
    | {
          type: "RESET";
      };

interface Actions {
    setNewUseCase: (newUseCase: NewUseCase) => void;
    setUploadProgress: (uploadProgress: UploadProgress) => void;
    setUseCase: (useCase: UseCase) => void;
    setContact: (contact: Contact) => void;
    setTimeEntry: (timeEntry: TimeEntry) => void;
    setLocation: (location: Location) => void;
    setAddress: (address: Address) => void;
    setDeliveryType: (deliveryType: DeliveryType) => void;
    setAvailableDeliveryTypes: (
        availableDeliveryTypes: AvailableDeliveryType[]
    ) => void;
    setSize: (size: Size) => void;
    reset: () => void;
}

export const StoreContext = React.createContext<Store & Actions>(initialStore);

StoreContext.displayName = "StoreContext";

function storeReducer(store: Store, action: Action): Store {
    switch (action.type) {
        case "SET_NEW_USE_CASE": {
            return {
                ...store,
                newUseCase: action.newUseCase,
            };
        }
        case "SET_UPLOAD_PROGRESS": {
            return {
                ...store,
                uploadProgress: action.uploadProgress,
            };
        }
        case "SET_USE_CASE": {
            return {
                ...store,
                useCase: action.useCase,
            };
        }
        case "SET_CONTACT": {
            return {
                ...store,
                contact: action.contact,
            };
        }
        case "SET_AVAILABLE_DELIVERY_TYPES": {
            return {
                ...store,
                availableDeliveryTypes: action.availableDeliveryTypes,
            };
        }
        case "SET_TYPE": {
            return {
                ...store,
                location: null,
                timeEntry: null,
                type: action.deliveryType,
            };
        }
        case "SET_LOCATION": {
            return {
                ...store,
                location: action.location,
            };
        }
        case "SET_ADDRESS": {
            return {
                ...store,
                address: action.address,
            };
        }
        case "SET_TIME_ENTRY": {
            return {
                ...store,
                timeEntry: action.timeEntry,
            };
        }
        case "SET_SIZE": {
            return {
                ...store,
                size: action.size,
            };
        }
        case "RESET": {
            return {
                ...store,
                location: null,
                timeEntry: null,
                type: null,
            };
        }
    }
}

export const StoreProvider: FC<{ initial?: Partial<Store> }> = ({
    initial,
    ...props
}) => {
    const [store, dispatch] = React.useReducer(storeReducer, {
        ...initialStore,
        ...initial,
    });

    const setNewUseCase = (newUseCase: NewUseCase) =>
        dispatch({
            type: "SET_NEW_USE_CASE",
            newUseCase,
        });

    const setUploadProgress = (uploadProgress: UploadProgress) =>
        dispatch({
            type: "SET_UPLOAD_PROGRESS",
            uploadProgress,
        });

    const setUseCase = (useCase: UseCase) =>
        dispatch({
            type: "SET_USE_CASE",
            useCase,
        });

    const setContact = (contact: Contact) =>
        dispatch({
            type: "SET_CONTACT",
            contact,
        });

    const setAvailableDeliveryTypes = (
        availableDeliveryTypes: AvailableDeliveryType[]
    ) =>
        dispatch({
            type: "SET_AVAILABLE_DELIVERY_TYPES",
            availableDeliveryTypes,
        });

    const setDeliveryType = (deliveryType: DeliveryType) =>
        dispatch({
            type: "SET_TYPE",
            deliveryType,
        });

    const setLocation = (location: Location) =>
        dispatch({
            type: "SET_LOCATION",
            location,
        });

    const setAddress = (address: Address) =>
        dispatch({
            type: "SET_ADDRESS",
            address,
        });

    const setTimeEntry = (timeEntry: TimeEntry) =>
        dispatch({
            type: "SET_TIME_ENTRY",
            timeEntry,
        });

    const setSize = (size: Size) =>
        dispatch({
            type: "SET_SIZE",
            size,
        });

    const reset = () =>
        dispatch({
            type: "RESET",
        });

    const value = useMemo(
        () => ({
            ...store,
            setNewUseCase,
            setUploadProgress,
            setUseCase,
            setContact,
            setAvailableDeliveryTypes,
            setDeliveryType,
            setLocation,
            setAddress,
            setTimeEntry,
            setSize,
            reset,
        }),
        [store]
    );

    return <StoreContext.Provider value={value} {...props} />;
};

export const useStore = () => {
    const context = React.useContext(StoreContext);
    if (context === undefined) {
        throw new Error(`useStore must be used within a StoreProvider`);
    }
    return context;
};
