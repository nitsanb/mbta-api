import axios, { AxiosResponse } from 'axios';

const BASE_URL = "https://api-v3.mbta.com"

enum RouteType {
    LIGHT_RAIL = 0, // Tram, Streetcar, Light rail
    HEAVY_RAIL = 1, // Subway, Metro
}

/**
 * Fetch light/heavy rail stops from MBTA API. Error handling is done by the calling route handler.
 * 
 * @returns (Promise) Response from MBTA API containing stops data
 */
export async function fetchMbtaRailsStops(): Promise<AxiosResponse<any>> {
    return axios.get(`${BASE_URL}/stops?include=route&filter[route_type]=${RouteType.LIGHT_RAIL},${RouteType.HEAVY_RAIL}`)
}

export async function fetchMbtaRailsStopsByIds(stopIds: string[]): Promise<AxiosResponse<any>> {
    const delimitedStops = stopIds.join(',');
    return axios.get(`${BASE_URL}/stops?filter[id]=${delimitedStops}&filter[route_type]=0,1`)
}

export async function fetchMbtaRoutesByStopId(stopId: string): Promise<AxiosResponse<any>> {
    return axios.get(`${BASE_URL}/routes?filter[stop]=${stopId}`)
}

export async function fetchMbtaRoutePatternsByStopId(stopId: string): Promise<AxiosResponse<any>> {
    return axios.get(`${BASE_URL}/route_patterns?filter[stop]=${stopId}`)
}

export async function fetchMbtaStopsIdByTripId(tripId: string): Promise<AxiosResponse<any>> {
    return axios.get(`${BASE_URL}/trips/${tripId}?include=stops`)
}
