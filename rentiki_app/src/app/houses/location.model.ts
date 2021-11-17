export interface Coordinates {
    lat: number;
    lng: number;
}

export interface HouseLocation extends Coordinates {
    address: string;
    staticMapImageUrl: string;
}