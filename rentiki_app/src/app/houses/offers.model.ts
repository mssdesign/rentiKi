export class offersModel {
    constructor(
        public userId: string,        
        public offerKey: string,
        public contract: string,
        public title: string,
        public description: string,
        public price: string,
        public contact: string,
        public whatsapp: boolean,
        public location: string,
        public images: string[],
        public favorite: boolean
    ) {}
}

