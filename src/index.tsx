import { ConfigProvider } from "@context/config";
import ReactDOM from "react-dom";
import { configPropsSchema } from "@schema/index";
import { App } from "./components";

import {
    GlobalConfig,
    RenderConfigProps,
    Config,
} from "@schema/types";

import "./styles.css";

declare global {
    var deliveryAppConfig: GlobalConfig;
}

export function render(renderConfig: RenderConfigProps) {
    try {
        if (!("deliveryAppConfig" in window)) {
            throw "deliveryAppConfig is missing";
        }

        const config = { ...renderConfig, ...window.deliveryAppConfig };
        const {
            containerId,
            ...rest
        } = configPropsSchema.validateSync(config);

        const properties = {} as any;

        const c: Config = {
            ...rest,
        };

        // Tailwind is using this as a wrapper class to increase the specificity
        document.body.setAttribute("id", "delivery-widget");

        ReactDOM.render(
            <ConfigProvider config={c}>
                <App />
            </ConfigProvider>,
            document.getElementById(containerId)
        );
    } catch (error) {
        console.error(`delivery-widget: ${error}`);
    }
}
