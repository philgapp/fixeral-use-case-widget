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
    TimeEntryAllOf,
    TimeEntryAllOfFromJSON,
    TimeEntryAllOfFromJSONTyped,
    TimeEntryAllOfToJSON,
    TimeRange,
    TimeRangeFromJSON,
    TimeRangeFromJSONTyped,
    TimeRangeToJSON,
} from './';

/**
 * 
 * @export
 * @interface TimeEntry
 */
export interface TimeEntry {
    /**
     * 
     * @type {string}
     * @memberof TimeEntry
     */
    startTime: string;
    /**
     * 
     * @type {string}
     * @memberof TimeEntry
     */
    endTime: string;
    /**
     * 
     * @type {number}
     * @memberof TimeEntry
     */
    id: number;
    /**
     * Availability of the time entry
     * @type {boolean}
     * @memberof TimeEntry
     */
    available: boolean;
    /**
     * 
     * @type {string}
     * @memberof TimeEntry
     */
    description?: string;
    /**
     * Shopify variant id
     * @type {string}
     * @memberof TimeEntry
     */
    variantId: string;
}

export function TimeEntryFromJSON(json: any): TimeEntry {
    return TimeEntryFromJSONTyped(json, false);
}

export function TimeEntryFromJSONTyped(json: any, ignoreDiscriminator: boolean): TimeEntry {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'startTime': json['startTime'],
        'endTime': json['endTime'],
        'id': json['id'],
        'available': json['available'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'variantId': json['variantId'],
    };
}

export function TimeEntryToJSON(value?: TimeEntry | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'startTime': value.startTime,
        'endTime': value.endTime,
        'id': value.id,
        'available': value.available,
        'description': value.description,
        'variantId': value.variantId,
    };
}


