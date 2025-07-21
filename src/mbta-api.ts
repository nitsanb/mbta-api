import axios from 'axios';
import { Stop } from './types';

const BASE_URL = "https://api-v3.mbta.com"

export enum RouteType {
    LIGHT_RAIL = 0, // Tram, Streetcar, Light rail
    HEAVY_RAIL = 1, // Subway, Metro
}

export let stopsCache: Stop[] | null = null;

export async function fetchAndCacheAllStops(): Promise<Stop[]> {
    const [lightStops, heaveyStops] = await Promise.all([
        fetchStops(RouteType.LIGHT_RAIL),
        fetchStops(RouteType.HEAVY_RAIL)
    ]);
    stopsCache = [...lightStops, ...heaveyStops];
    return stopsCache;
}

export async function fetchAllStops(): Promise<Stop[]> {
    if (stopsCache) {
        console.log('Using cached stops');
        return stopsCache;
    }
    return await fetchAndCacheAllStops();
}
    

/**
 * Fetch light/heavy rail stops from MBTA API. Error handling is done by the calling route handler.
 * 
 * @param routeType - The type of route to filter stops
 * @returns (Promise) Array of stops
 */
async function fetchStops(routeType: RouteType): Promise<Stop[]> {
    return axios.get(`${BASE_URL}/stops?include=route&filter[route_type]=${routeType}`)
        .then(response => response.data.data.map((stop: any) => ({
            id: stop.id,
            attributes: stop.attributes,
            parent_station: stop.relationships.parent_station.data.id,
        })))
}

export async function fetchLinesByParentStation(stopId: string): Promise<string[]> {
    return await axios.get(`${BASE_URL}/routes?filter[stop]=${stopId}`)
        .then(response => response.data.data.map((line: any) => line.attributes.long_name))
}
