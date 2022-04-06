/* tslint:disable */
/* eslint-disable */
/**
 * Eatgrim Shipping API
 * Eatgrim Shipping API
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: tech@soundsgood.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    DateSlot,
    DateSlotFromJSON,
    DateSlotFromJSONTyped,
    DateSlotToJSON,
    DoorstepDeliveryLocationAllOf,
    DoorstepDeliveryLocationAllOfFromJSON,
    DoorstepDeliveryLocationAllOfFromJSONTyped,
    DoorstepDeliveryLocationAllOfToJSON,
    LocationBase,
    LocationBaseFromJSON,
    LocationBaseFromJSONTyped,
    LocationBaseToJSON,
} from './';

/**
 * 
 * @export
 * @interface DoorstepDeliveryLocation
 */
export interface DoorstepDeliveryLocation {
    /**
     * 
     * @type {number}
     * @memberof DoorstepDeliveryLocation
     */
    id: number;
    /**
     *
     * @type {string}
     * @memberof DoorstepDeliveryLocation
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof DoorstepDeliveryLocation
     */
    price: number;
    /**
     * 
     * @type {Array<DateSlot>}
     * @memberof DoorstepDeliveryLocation
     */
    slots: Array<DateSlot>;
    /**
     * 
     * @type {string}
     * @memberof DoorstepDeliveryLocation
     */
    zipCode: string;
}

export function DoorstepDeliveryLocationFromJSON(json: any): DoorstepDeliveryLocation {
    return DoorstepDeliveryLocationFromJSONTyped(json, false);
}

export function DoorstepDeliveryLocationFromJSONTyped(json: any, ignoreDiscriminator: boolean): DoorstepDeliveryLocation {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'price': json['price'],
        'slots': ((json['slots'] as Array<any>).map(DateSlotFromJSON)),
        'zipCode': json['zipCode'],
    };
}

export function DoorstepDeliveryLocationToJSON(value?: DoorstepDeliveryLocation | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'price': value.price,
        'slots': ((value.slots as Array<any>).map(DateSlotToJSON)),
        'zipCode': value.zipCode,
    };
}

