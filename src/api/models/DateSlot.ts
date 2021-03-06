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
    TimeEntry,
    TimeEntryFromJSON,
    TimeEntryFromJSONTyped,
    TimeEntryToJSON,
} from './';

/**
 * 
 * @export
 * @interface DateSlot
 */
export interface DateSlot {
    /**
     * 
     * @type {Date}
     * @memberof DateSlot
     */
    date?: Date;
    /**
     * 
     * @type {Array<TimeEntry>}
     * @memberof DateSlot
     */
    timeEntries: Array<TimeEntry>;
}

export function DateSlotFromJSON(json: any): DateSlot {
    return DateSlotFromJSONTyped(json, false);
}

export function DateSlotFromJSONTyped(json: any, ignoreDiscriminator: boolean): DateSlot {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'date': !exists(json, 'date') ? undefined : (new Date(json['date'])),
        'timeEntries': ((json['timeEntries'] as Array<any>).map(TimeEntryFromJSON)),
    };
}

export function DateSlotToJSON(value?: DateSlot | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'date': value.date === undefined ? undefined : (value.date.toISOString().substr(0,10)),
        'timeEntries': ((value.timeEntries as Array<any>).map(TimeEntryToJSON)),
    };
}


