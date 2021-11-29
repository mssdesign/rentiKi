import { phoneModel } from './phone.model';

export class offersModel {
    constructor(
        public userId: string,        
        public offerKey: string,
        public name: string,
        public contract: string,
        public title: string,
        public description: string,
        public price: string,
        public contact: phoneModel[],
        public location: string,
        public images: string[],
        public favorite: boolean
    ) {}
}