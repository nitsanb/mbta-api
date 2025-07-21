import e from "express";
import { JsonObject } from "swagger-ui-express";

export const BASE_URL = "https://api-v3.mbta.com"

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export enum RouteType {
    LIGHT_RAIL = 0, // Tram, Streetcar, Light rail
    HEAVY_RAIL = 1, // Subway, Metro
}

// Types
export interface Stop {
    id: string
    attributes: Attributes;
    parent_station: string;
    all_lines?: string[];
    neighbors?: string[];
}

export interface Attributes {
    name: string;
    description: string;
    line: string;
    latitude: number;
    longitude: number;
}
