import * as Yup from "yup";
import { Country } from "@api/index";
import {
    SHIPPING_TYPE,
    SHIPPING_PLACE,
    SHIPPING_SLOT,
    SHIPPING_COUNTRY,
    SHIPPING_ZIP_CODE,
} from "@constants/index";

export const ZIP_CODE_SCHEMA = Yup.object().shape({
    zip: Yup.string().nullable().defined("Postal code is required"),
});

export const ADDRESS_SCHEMA = Yup.object()
    .shape({
        first_name: Yup.string().nullable().defined(),
        last_name: Yup.string().nullable().defined(),
        address1: Yup.string().nullable().defined(),
        address2: Yup.string().nullable(),
        city: Yup.string().nullable().defined(),
        company: Yup.string().nullable(),
        country: Yup.string()
            .nullable()
            .lowercase()
            .oneOf(["denmark"])
            .defined(),
        phone: Yup.string().nullable(),
        province: Yup.string().nullable(),
    })
    .concat(ZIP_CODE_SCHEMA);

export const RECHARGE_DATA_SCHEMA = Yup.object({
    customerToken: Yup.string().required(),
    customerHash: Yup.string().required(),
    addressId: Yup.string().required(),
    address: ADDRESS_SCHEMA.notRequired().default(undefined),
    subscriptionId: Yup.string().required(),
    nextChargeScheduledAt: Yup.string().required(),
    properties: Yup.array()
        .of(
            Yup.object({
                name: Yup.mixed()
                    .oneOf([
                        SHIPPING_TYPE,
                        SHIPPING_PLACE,
                        SHIPPING_SLOT,
                        SHIPPING_COUNTRY,
                        SHIPPING_ZIP_CODE,
                    ])
                    .defined(),
                value: Yup.string().defined(),
            })
        )
        .required(),
});

export const SUBSCRIBE_API_SCHEMA = Yup.object({
    apiBasePath: Yup.string().required(),
});

export const SUBSCRIBE_FORM_SCHEMA = Yup.object({
    email: Yup.string().email().required(),
}).concat(ZIP_CODE_SCHEMA);

export const GLOBAL_CONFIG_SCHEMA = Yup.object({
    apiBasePath: Yup.string().defined(),
    country: Yup.mixed<Country>().oneOf(Object.values(Country)).defined(),
    googleMapsApiKey: Yup.string().defined(),
    defaultLocation: Yup.object({
        lat: Yup.number().defined(),
        lng: Yup.number().defined(),
    })
        .notRequired()
        .default(undefined),
    pilotId: Yup.string().defined(),
    subscribeApi: SUBSCRIBE_API_SCHEMA.notRequired().default(undefined),
});

export const RENDER_CONFIG_SCHEMA = Yup.object({
    //shopifyProductId: Yup.string().defined(),
    sizeSelectorId: Yup.string().defined(),
    variantSelectorId: Yup.string().notRequired().default(undefined),
});

export const RENDER_PROPS_SCHEMA = Yup.object({
    containerId: Yup.string().defined(),
}).concat(RENDER_CONFIG_SCHEMA);

export const configPropsSchema = GLOBAL_CONFIG_SCHEMA.concat(
    RENDER_PROPS_SCHEMA
);
export const configSchema = GLOBAL_CONFIG_SCHEMA.concat(RENDER_CONFIG_SCHEMA);
