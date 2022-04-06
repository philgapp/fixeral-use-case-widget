import React, { FC, useMemo } from "react";
import { AvailableLocation } from "@schema/types";
export interface State {
    locations: AvailableLocation[];
}

const initialStore: State & Actions = {
    locations: [],
    setLocations: (locations: AvailableLocation[]) => {},
};

type Action = {
    type: "SET_LOCATIONS";
    locations: State["locations"];
};

interface Actions {
    setLocations: (locations: AvailableLocation[]) => void;
}

export const StateContext = React.createContext<State & Actions>(initialStore);

StateContext.displayName = "FormStateContext";

function storeReducer(store: State, action: Action): State {
    switch (action.type) {
        case "SET_LOCATIONS": {
            return {
                ...store,
                locations: action.locations,
            };
        }
    }
}

export const FormStateProvider: FC = (props) => {
    const [state, dispatch] = React.useReducer(storeReducer, initialStore);

    const setLocations = (locations: AvailableLocation[]) =>
        dispatch({
            type: "SET_LOCATIONS",
            locations,
        });

    const value = useMemo(
        () => ({
            ...state,
            setLocations,
        }),
        [state]
    );

    return <StateContext.Provider value={value} {...props} />;
};

export const useFormState = () => {
    const context = React.useContext(StateContext);
    if (context === undefined) {
        throw new Error(`useFormState must be used within a StateProvider`);
    }
    return context;
};
