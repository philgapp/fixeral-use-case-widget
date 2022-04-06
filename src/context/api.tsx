import React, { FC, useMemo } from "react";
import { Configuration, PublicApi } from "@api/index";
import { useConfig } from "./config";

export interface Api {
    api?: PublicApi;
}

const initialState: Api = {};

export const ApiContext = React.createContext<Api>(initialState);

ApiContext.displayName = "ApiContext";

export const useApi = () => {
    const context = React.useContext(ApiContext);
    if (context === undefined) {
        throw new Error(`useApi must be used within a ApiProvider`);
    }
    return context;
};

export const ApiProvider: FC = (props) => {
    const { apiBasePath } = useConfig();

    const api = useMemo(() => {
        const config = new Configuration({
            basePath: apiBasePath,
        });
        const api = new PublicApi(config);

        return {
            api,
        };
    }, []);

    return <ApiContext.Provider value={api} {...props} />;
};
