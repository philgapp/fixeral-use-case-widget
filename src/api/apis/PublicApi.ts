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


import * as runtime from '../runtime';
import {
    DeliveryType,
    DeliveryTypeFromJSON,
    DeliveryTypeToJSON,
    DoorstepDeliveryLocation,
    DoorstepDeliveryLocationFromJSON,
    DoorstepDeliveryLocationToJSON,
    DoorstepPayload,
    DoorstepPayloadFromJSON,
    DoorstepPayloadToJSON,
    PickupLocation,
    PickupLocationFromJSON,
    PickupLocationToJSON,
    PickupPayload,
    PickupPayloadFromJSON,
    PickupPayloadToJSON,
    TypePayload,
    TypePayloadFromJSON,
    TypePayloadToJSON,
} from '../models';

export interface DeliveryDoorstepPostRequest {
    doorstepPayload?: DoorstepPayload;
}

export interface DeliveryPickupPostRequest {
    pickupPayload?: PickupPayload;
}

export interface DeliveryTypePostRequest {
    typePayload?: TypePayload;
}

/**
 * 
 */
export class PublicApi extends runtime.BaseAPI {

    // Testing Firebase API function in this context....
    /*
    async useCaseListenerRaw(requestParameters: any): Promise<any> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/cases/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters,
        });

        return response;
    }

    async useCaseListener(requestParameters?: any): Promise<any> {
        const response = await this.deliveryDoorstepPostRaw(requestParameters);
        return await response.value();
    }

     */

    /**
     */
    async deliveryDoorstepPostRaw(requestParameters: DeliveryDoorstepPostRequest): Promise<runtime.ApiResponse<Array<DoorstepDeliveryLocation>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/delivery/doorstep`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DoorstepPayloadToJSON(requestParameters.doorstepPayload),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(DoorstepDeliveryLocationFromJSON));
    }

    /**
     */
    async deliveryDoorstepPost(requestParameters: DeliveryDoorstepPostRequest): Promise<Array<DoorstepDeliveryLocation>> {
        const response = await this.deliveryDoorstepPostRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async deliveryPickupPostRaw(requestParameters: DeliveryPickupPostRequest): Promise<runtime.ApiResponse<Array<PickupLocation>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/delivery/pickup`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PickupPayloadToJSON(requestParameters.pickupPayload),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PickupLocationFromJSON));
    }

    /**
     */
    async deliveryPickupPost(requestParameters: DeliveryPickupPostRequest): Promise<Array<PickupLocation>> {
        const response = await this.deliveryPickupPostRaw(requestParameters);
        return await response.value();
    }

    /**
     * Returns the list of available delivery types for specified **country** and  **shopify product**. 
     */
    async deliveryTypePostRaw(requestParameters: DeliveryTypePostRequest): Promise<runtime.ApiResponse<Array<DeliveryType>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/delivery/type`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TypePayloadToJSON(requestParameters.typePayload),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(DeliveryTypeFromJSON));
    }

    /**
     * Returns the list of available delivery types for specified **country** and  **shopify product**. 
     */
    async deliveryTypePost(requestParameters: DeliveryTypePostRequest): Promise<Array<DeliveryType>> {
        const response = await this.deliveryTypePostRaw(requestParameters);
        return await response.value();
    }

}
