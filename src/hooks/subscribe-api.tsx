import { useConfig } from "@context/config";
import { useLazyFetch } from ".";

import urljoin from "url-join";
import { SubscribeForm } from "@schema/types";

export const useSubscribeCustomer = () => {
    const { subscribeApi } = useConfig();

    const handleSubscribeCustomer = async ({ zip, email }: SubscribeForm) => {
        if (subscribeApi) {
            const { apiBasePath } = subscribeApi;

            const url = urljoin(
                apiBasePath,
                "/api/subscribe-customer",
                `?zipcode=${zip}&email=${email}&shop=eatgrim.myshopify.com`
            );

            const response = await window.fetch(url, {
                method: "GET",
            });

            return response.json();
        }
    };

    return useLazyFetch(handleSubscribeCustomer);
};
