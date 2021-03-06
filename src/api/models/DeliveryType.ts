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
/**
 * 
 * @export
 * @interface DeliveryType
 */
export interface DeliveryType {
    /**
     * 
     * @type {string}
     * @memberof DeliveryType
     */
    type?: DeliveryTypeTypeEnum;
    /**
     * 
     * @type {boolean}
     * @memberof DeliveryType
     */
    available?: boolean;
    /**
     * 
     * @type {number}
     * @memberof DeliveryType
     */
    minPrice?: number;
    /**
     * 
     * @type {number}
     * @memberof DeliveryType
     */
    maxPrice?: number;
}

/**
* @export
* @enum {string}
*/
export enum DeliveryTypeTypeEnum {
    Doorstep = 'doorstep',
    Pickup = 'pickup'
}

export function DeliveryTypeFromJSON(json: any): DeliveryType {
    return DeliveryTypeFromJSONTyped(json, false);
}

export function DeliveryTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): DeliveryType {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': !exists(json, 'type') ? undefined : json['type'],
        'available': !exists(json, 'available') ? undefined : json['available'],
        'minPrice': !exists(json, 'minPrice') ? undefined : json['minPrice'],
        'maxPrice': !exists(json, 'maxPrice') ? undefined : json['maxPrice'],
    };
}

export function DeliveryTypeToJSON(value?: DeliveryType | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': value.type,
        'available': value.available,
        'minPrice': value.minPrice,
        'maxPrice': value.maxPrice,
    };
}


