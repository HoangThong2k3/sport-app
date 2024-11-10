import CognitoService from "../../services/CognitoService.mjs";

const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;

export const handler = async (event, context) => {
    try {
        console.log("event", event);
        const cognitoService = new CognitoService(USER_POOL_ID, CLIENT_ID);
        // const token = event.authorizationToken;
        const authHeader = event.headers.Authorization || event.headers.authorization;
        const token = authHeader.split(" ")[1];
        const tokenPayload = await cognitoService.verifyAccessToken(token)
        return {
            statusCode: 200,
            body: JSON.stringify(tokenPayload),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error || "Some error from server side." }),
        };
    }
};
