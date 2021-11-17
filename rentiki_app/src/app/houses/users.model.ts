import { HouseModel } from './house.model';

export class userModel {
    constructor(
        public userId: string,
        public name: string,
        public houses: HouseModel[]
    ) {}
}