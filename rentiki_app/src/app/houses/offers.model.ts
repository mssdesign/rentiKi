import { HouseLocation } from './location.model';

export class offersModel {
    constructor(
        public id: string,
        public userId: string,
        public name: string,
        public contract: string,
        public title: string,
        public description: string,
        public price: string,
        public contact: string[],
        public location: HouseLocation,
        public images: string[]
    ) {}
}