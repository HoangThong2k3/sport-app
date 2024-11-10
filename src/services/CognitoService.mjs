import AWS from "aws-sdk";
import axios from "axios";
import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";


export default class CognitoService {
    constructor(userPoolId, clientId) {
        this.region = "us-east-1"
        this.userPoolId = userPoolId;
        this.clientId = clientId;
        this.cognito = new AWS.CognitoIdentityServiceProvider();
        this.iss = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
        this.cachedKeys = null;
    }

    async getCognitoPublicKeys() {
        if (!this.cachedKeys) {
            const url = `${this.iss}/.well-known/jwks.json`;
            const {data} = await axios.get(url);
            this.cachedKeys = data.keys;
        }
        return this.cachedKeys;
    }

    async verifyAccessToken(token) {
        try {
            const keys = await this.getCognitoPublicKeys();
            const decoded = jwt.decode(token, {complete: true});

            const pems = keys.reduce((result, key) => {
                const key_id = key.kid;
                const modulus = key.n;
                const exponent = key.e;
                const key_type = key.kty;
                const jwk = { kty: key_type, n: modulus, e: exponent};
                const pem = jwkToPem(jwk);
                result[key_id] = pem;
                return result;
            }, {})

            console.log("pems", pems)

            //Get the kid from the token and retrieve corresponding PEM
            const kid = decoded.header.kid;
            const pem = pems[kid];
            if (!pem) {
                throw new Error('Public key not found for the token');
            }

            const payload = jwt.verify(token, pem, {
                algorithms: ['RS256'],
                issuer: this.iss,
            });

            return payload;  // Return the token payload if verification is successful
        } catch (error) {
            console.error('Token verification failed:', error);
            throw new Error('Unauthorized');
        }
    };
}
