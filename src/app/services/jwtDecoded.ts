interface IJwtDecoded {
  _id: string;
  isAdmin: boolean;
  iat: string;
}

export class JwtDecoded implements IJwtDecoded {
  _id: string;
  isAdmin: boolean;
  iat: string;

  constructor(jwtD: IJwtDecoded) {
    this._id = jwtD._id;
    this.isAdmin = jwtD.isAdmin;
    this.iat = jwtD.iat;
  }

  string(): string {
    return '{ _id:' + this._id + ', isAdmin:' + this.isAdmin + ', iat:' + this.iat + '}';
  }
}