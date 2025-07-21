import e from "express";
import { JsonObject } from "swagger-ui-express";

export const BASE_URL = "https://api-v3.mbta.com"

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
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
