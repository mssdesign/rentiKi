export class UserDataModel {
    constructor(
        public id: string,
        public email: string,
        private _token: string,
        private tokenExpirationDate: Date
    ) {}

    get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }

        return this._token;
    }

    get tokenDuration() {
        if (!this.token) {
            return 0;
        }

        return this.tokenExpirationDate.getTime() - new Date().getTime();   //Determinando tempo do token tempo do token - hora atual
    }
}