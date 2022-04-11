import {
    PickupLocation as ApiPickupLocation,
    DoorstepDeliveryLocation as ApiDoorstepDeliveryLocation,
    TimeEntry as ApiTimeEntry,
    DeliveryType as ApiDeliveryType,
    DateSlot as ApiDateSlot,
} from "@api/index";
import {
    PROPERTY_SHIPPING_PLACE,
    PROPERTY_SHIPPING_SLOT,
    PROPERTY_SHIPPING_PLACE_ID,
    PROPERTY_SHIPPING_SLOT_ID,
    PROPERTY_SHIPPING_PLACE_NAME,
    PROPERTY_SHIPPING_SLOT_NAME,
    PROPERTY_SHIPPING_TYPE,
} from "@constants/index";
import {
    ADDRESS_SCHEMA,
    GLOBAL_CONFIG_SCHEMA,
    RECHARGE_DATA_SCHEMA,
    RENDER_PROPS_SCHEMA,
    RENDER_CONFIG_SCHEMA,
    SUBSCRIBE_FORM_SCHEMA,
    ZIP_CODE_SCHEMA,
} from "@schema/index";
import * as yup from "yup";
import { ObjectSchema } from "yup";
import { ObjectShape } from "yup/lib/object";
import { TypedSchema } from "yup/lib/util/types";

export type InferShape<TSchema> = TSchema extends ObjectSchema<infer Shape>
    ? Shape
    : never;

export type UndefinableKeys<Shape extends ObjectShape> = string &
    {
        [K in keyof Shape]?: Shape[K] extends TypedSchema
            ? undefined extends yup.InferType<Shape[K]>
                ? K
                : never
            : never;
    }[keyof Shape];

export type InferInterfaceFromShape<Shape extends ObjectShape> = {
    [K in UndefinableKeys<Shape>]?: Shape[K] extends TypedSchema
        ? yup.InferType<Shape[K]>
        : any;
} &
    {
        [K in Exclude<
            keyof Shape,
            UndefinableKeys<Shape>
        >]: Shape[K] extends TypedSchema ? yup.InferType<Shape[K]> : any;
    };

export type InferInterface<TSchema> = InferInterfaceFromShape<
    InferShape<TSchema>
>;

export interface GlobalConfig
    extends InferInterface<typeof GLOBAL_CONFIG_SCHEMA> {}
export interface RechargeConfig
    extends InferInterface<typeof RECHARGE_DATA_SCHEMA> {}
export interface RechargeDataConfig
    extends InferInterface<typeof RECHARGE_DATA_SCHEMA> {}
export interface RenderConfig
    extends InferInterface<typeof RENDER_CONFIG_SCHEMA> {}
export interface RenderConfigProps
    extends InferInterface<typeof RENDER_PROPS_SCHEMA> {}

export interface Address extends InferInterface<typeof ADDRESS_SCHEMA> {}

export interface ZipCode extends InferInterface<typeof ZIP_CODE_SCHEMA> {}

export interface SubscribeForm
    extends InferInterface<typeof SUBSCRIBE_FORM_SCHEMA> {}

export type Config = GlobalConfig & RenderConfig;
export interface RechargeData {
    [PROPERTY_SHIPPING_TYPE]: DeliveryType;
    [PROPERTY_SHIPPING_PLACE]: number;
    [PROPERTY_SHIPPING_SLOT]: number;
    [PROPERTY_SHIPPING_PLACE_ID]: number;
    [PROPERTY_SHIPPING_SLOT_ID]: number;
    [PROPERTY_SHIPPING_PLACE_NAME]: string;
    [PROPERTY_SHIPPING_SLOT_NAME]: string;
}

interface Available {
    available: boolean;
}

export type AvailableDateSlot = ApiDateSlot & Available;

export type AvailablePickupLocation = Pick<
    ApiPickupLocation,
    "id" | "name" | "address" | "price" | "openingHours" | "coordinates"
> & {
    slots: AvailableDateSlot[];
} & Available;

export type AvailableDoorstepDeliveryLocation = Pick<
    ApiDoorstepDeliveryLocation,
    "id" | "name" | "price" | "zipCode"
> & {
    slots: AvailableDateSlot[];
} & Available;

export enum DeliveryType {
    Doorstep = "doorstep",
    Pickup = "pickup",
}

export const DELIVERY_TYPE_LABELS = {
    [DeliveryType.Pickup]: "Pickup",
    [DeliveryType.Doorstep]: "Doorstep",
};

export const DELIVERY_TYPE_STR_TO_ENUM: { [key: string]: DeliveryType } = {};
for (const [key, value] of Object.entries(DELIVERY_TYPE_LABELS)) {
    DELIVERY_TYPE_STR_TO_ENUM[value.toLowerCase()] = key as DeliveryType;
}

export type NewUseCase = boolean | null;

export type UseCase = {
    id?: string | null,
    caseName: string,
    owner?: string | null,
    partDrawing?: string | null,
    partModel?: string | null,
    partFiles?: Array<string>  | null,
    caseNotes?: string | null,
    status?: string | null,
    stakeholders?: Array<string> | null
};

export type AllUseCases = Array<UseCase>

export type UploadProgress = string | null;

export type Contact = {
    id?: string | null,
    caseId?: string,
    firstName: string,
    lastName: string,
    company: string,
    title: string,
    email: string
}

export type AvailableDeliveryType = Pick<
    ApiDeliveryType,
    "maxPrice" | "minPrice"
> & { type: DeliveryType };

export type DoorstepDeliveryLocation = Pick<
    AvailableDoorstepDeliveryLocation,
    "id" | "name" | "price" | "slots" | "zipCode"
>;

export type PickupLocation = Pick<
    AvailablePickupLocation,
    "id" | "name" | "address" | "price" | "slots"
>;

export type TimeEntry = Pick<
    ApiTimeEntry,
    "id" | "startTime" | "endTime" | "variantId"
> &
    Pick<ApiDateSlot, "date">;

export type Location = PickupLocation | DoorstepDeliveryLocation;
export type AvailableLocation =
    | AvailablePickupLocation
    | AvailableDoorstepDeliveryLocation;

export type Size = string;

export type pilotId = string;

export interface Store {
    allUseCases: any;
    newUseCase: NewUseCase | null;
    uploadProgress: UploadProgress | null;
    useCase: UseCase | null;
    contact: Contact | null;
    availableDeliveryTypes: AvailableDeliveryType[];
    type: DeliveryType | null;
    location: Location | null;
    timeEntry: TimeEntry | null;
    address?: Address;
    size?: Size | null;
}
