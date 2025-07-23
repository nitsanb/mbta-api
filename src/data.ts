import {
    fetchMbtaRailsStops,
    fetchMbtaRoutesByStopId,
    fetchMbtaRoutePatternsByStopId,
    fetchMbtaRailsStopsByIds,
    fetchMbtaStopsIdByTripId
} from './mbta-api';
import { AdjacentStopsOnLine, RoutePattern, Stop } from './types';

const BASE_URL = "https://api-v3.mbta.com"

export let stopsCache: Stop[] = [];

export async function fetchAndCacheAllStops(): Promise<Stop[]> {
    const stops = fetchMbtaRailsStops()
        .then(response => response.data.data.map((stop: any) => ({
            id: stop.id,
            attributes: stop.attributes,
            parent_station: stop.relationships.parent_station.data.id,
        })))
    stopsCache = await stops;
    return stopsCache;
}

export async function fetchAllStops(): Promise<Stop[]> {
    if (stopsCache.length > 0) {
        console.log('Using cached stops');
        return stopsCache;
    }
    return await fetchAndCacheAllStops();
}

export async function fetchLineNamesByParentStation(stopId: string): Promise<string[]> {
    console.log(`Fetching lines for stop ${stopId}`);
    return fetchMbtaRoutesByStopId(stopId)
        .then(response => response.data.data.map((line: any) => line.attributes.long_name))
}

export async function fetchAdjacentStops(targetStop: Stop): Promise<AdjacentStopsOnLine[]> {
    console.log(`Fetching adjacent stops for stop ${targetStop.id}`);
    // Get the routes from the parent station
    const routePatterns = await fetchCanonicalRoutePatterns(targetStop);
    console.log(`Found ${routePatterns.length} route patterns for stop ${targetStop.id}`);
    // Remove duplicates based on route_name
    const uniqueRoutePatterns = Array.from(
        new Map(routePatterns.map(pattern => [pattern.route_name, pattern])).values()
    );
    console.log(`Found ${uniqueRoutePatterns.length} unique route patterns: ${JSON.stringify(uniqueRoutePatterns.map(p => p.route_name))}`);
    // Trips contain only the stop IDs. Fetch the stops and find the adjacent stops in the trip.
    const stopsByLine: AdjacentStopsOnLine[] = [];
    for (const pattern of uniqueRoutePatterns) {
        const stopIds = await fetchTripStopIds(pattern.representative_trip);
        const tripStops = await fetchStopsByIds(stopIds)
        const adjacentStops = getAdjacentStops(targetStop, tripStops);
        stopsByLine.push({
            line: pattern.route_name,
            stops: adjacentStops
        });
    }
    const simplified = stopsByLine.map(line => ({
        line: line.line,
        stops: line.stops.map(stop => stop.attributes.name)
    }));
    const toLog = JSON.stringify(simplified, null, 2);
    console.log(toLog);
    return stopsByLine;
}

async function fetchCanonicalRoutePatterns(stop: Stop): Promise<RoutePattern[]> {
    const parentStopId = stop.parent_station;
    console.log(`Fetching canonical route patterns for parent stop ${parentStopId}`);
    return fetchMbtaRoutePatternsByStopId(parentStopId)
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
    console.log(`Fetching stops by IDs: ${stopIds.join(', ')}`);
    const responses = await fetchMbtaRailsStopsByIds(stopIds)
    return responses.data.data.map((stop: any) => ({
        id: stop.id,
        attributes: stop.attributes,
        parent_station: stop.relationships.parent_station.data.id,
    }));
}

async function fetchTripStopIds(tripId: string): Promise<string[]> {
    console.log(`Fetching stops for trip ${tripId}`);
    const stopIds = await fetchMbtaStopsIdByTripId(tripId)
        .then(response => response.data.data.relationships.stops.data
            .map((stop: any) => (stop.id))
        );
    console.log(`Found ${stopIds.length} stops`);
    return stopIds;
}

// Return the adjacent stops for a given stop in a route. There can only be one or two adjacent stops in a route.
function getAdjacentStops(targetStop: Stop, routeStops: Stop[]): Stop[] {
    const targetIndex = routeStops.findIndex(stop => stop.parent_station === targetStop.parent_station);
    if (targetIndex === -1) {
        return [];
    }
    const adjacentStops: Stop[] = [];
    if (targetIndex > 0) {
        adjacentStops.push(routeStops[targetIndex - 1]); // Previous stop
    }
    if (targetIndex < routeStops.length - 1) {
        adjacentStops.push(routeStops[targetIndex + 1]); // Next stop
    }
    return adjacentStops;
}

