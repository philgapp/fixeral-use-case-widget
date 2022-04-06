import { DeliveryType } from "@schema/types";

export const CURRENCY = "Kr";
export const LOCALE = "de-DK";

export const DELIVERY_TYPE_LABELS = {
    [DeliveryType.Pickup]: "Pickup",
    [DeliveryType.Doorstep]: "Home-delivery",
};

export const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export const DEBOUNCE_TIMEOUT_IN_MS = 250;

export const SHIPPING_TYPE = "shipping_type";
export const SHIPPING_PLACE = "shipping_place";
export const SHIPPING_SLOT = "shipping_slot";
export const SHIPPING_PLACE_ID = "shipping_place_id";
export const SHIPPING_SLOT_ID = "shipping_slot_id";
export const SHIPPING_PLACE_NAME = "shipping_place_name";
export const SHIPPING_SLOT_NAME = "shipping_slot_name";
export const SHIPPING_ZIP_CODE = "shipping_zip_code";
export const SHIPPING_COUNTRY = "shipping_country";

export const PROPERTY_SHIPPING_TYPE = "properties[shipping_type]";
export const PROPERTY_SHIPPING_PLACE = "properties[shipping_place]";
export const PROPERTY_SHIPPING_PLACE_ID = "properties[shipping_place_id]";
export const PROPERTY_SHIPPING_PLACE_NAME = "properties[shipping_place_name]";
export const PROPERTY_SHIPPING_SLOT = "properties[shipping_slot]";
export const PROPERTY_SHIPPING_SLOT_ID = "properties[shipping_slot_id]";
export const PROPERTY_SHIPPING_SLOT_NAME = "properties[shipping_slot_name]";
export const PROPERTY_SHIPPING_ZIP_CODE = "properties[shipping_zip_code]";
export const PROPERTY_SHIPPING_COUNTRY = "properties[shipping_country]";

export type PropertyJson = {
    value: string;
    name:
        | typeof SHIPPING_TYPE
        | typeof SHIPPING_PLACE
        | typeof SHIPPING_SLOT
        | typeof SHIPPING_ZIP_CODE
        | typeof PROPERTY_SHIPPING_COUNTRY;
};

export type PropertiesJson = [PropertyJson];
