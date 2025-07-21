
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