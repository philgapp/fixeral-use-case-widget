import React, { FC } from "react";
import { Country } from "@api/index";
import { Config } from "@schema/types";

interface Props {
    config: Config;
}

const initialState: Config = {
    apiBasePath: "https://api.fixeral.com", // Future Fixeral backend API
    country: Country.De, // Dk changed to De for Fixeral use case widget
    googleMapsApiKey: "", // No Google Maps for now
    pilotId: "default-0", // Default, new Pilot ID
    sizeSelectorId: ""
};

export const ConfigContext = React.createContext<Config>(initialState);

ConfigContext.displayName = "ConfigContext";

export const ConfigProvider: FC<Props> = ({ config, ...props }) => {
    const state = {
        ...initialState,
        ...config,
    };
    return <ConfigContext.Provider value={state} {...props} />;
};

export const useConfig = () => {
    const context = React.useContext(ConfigContext);
    if (context === undefined) {
        throw new Error(`useApi must be used within a ApiProvider`);
    }
    return context;
};
