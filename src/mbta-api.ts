import axios, { AxiosResponse } from 'axios';
import { AdjacentStopsOnLine, RoutePattern, Stop } from './types';

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

export async function fetchMbtaRoutesByStopId(stopId: string): Promise<AxiosResponse<any>> {
    return axios.get(`${BASE_URL}/routes?filter[stop]=${stopId}`)
}

async function fetchCanonicalRoutePatterns(stop: Stop): Promise<RoutePattern[]> {
    const parentStopId = stop.parent_station;
    console.log(`Fetching canonical route patterns for parent stop ${parentStopId}`);
    return axios.get(`${BASE_URL}/route_patterns?filter[stop]=${parentStopId}`)
        .then(response => response.data.data
            // We only need one route per line. The "canonical" trips contain all the stops for that line.
            .filter((pattern: any) => pattern.relationships.representative_trip.data.id.includes("canonical"))
            .map((pattern: any) => ({
                representative_trip: pattern.relationships.representative_trip.data.id,
                route_name: pattern.relationships.route.data.id
            }))
        );
}

async function fetchStopsByIds(stopIds: string[]): Promise<Stop[]> {
    const delimitedStops = stopIds.join(',');
    console.log(`Fetching stops by IDs: ${delimitedStops}`);
    const responses = await axios.get(`${BASE_URL}/stops?filter[id]=${delimitedStops}&filter[route_type]=0,1`)
    return responses.data.data.map((stop: any) => ({
        id: stop.id,
        attributes: stop.attributes,
        parent_station: stop.relationships.parent_station.data.id,
    }));
}

async function fetchTripStopIds(tripId: string): Promise<string[]> {
    console.log(`Fetching stops for trip ${tripId}`);
    const stopIds = await axios.get(`${BASE_URL}/trips/${tripId}?include=stops`)
        .then(response => response.data.data.relationships.stops.data
            .map((stop: any) => (stop.id))
        );
    console.log(`Found ${stopIds.length} stops`);
    return stopIds;
}
