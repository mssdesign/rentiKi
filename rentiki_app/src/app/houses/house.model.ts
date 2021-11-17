import { HouseLocation } from './location.model';

export interface HouseModel {
    contract: string;
    title: string;
    description: string;
    price: string;
    contact: string[];
    location: HouseLocation;
    images: string[];
}