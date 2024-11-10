import AWS from "aws-sdk";
import loginUserRequestValidation from "../../validation/auth/LoginUserRequest.mjs";

const cognito = new AWS.CognitoIdentityServiceProvider();

const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;

export const handler = async (event, context) => {
    try {
        const reqBody = event.body ? JSON.parse(event.body) : {};
        const params = await loginUserRequestValidation.validateAsync(reqBody);
        const loginResult = await cognito
            .initiateAuth({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: CLIENT_ID,
                AuthParameters: {
                    USERNAME: params.email,
                    PASSWORD: params.password,
                },
            })
            .promise();
        const response = {
            accessToken: loginResult.AuthenticationResult.AccessToken,
            idToken: loginResult.AuthenticationResult.IdToken,
            refreshToken: loginResult.AuthenticationResult.RefreshToken,
        }
        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error || "Some error from server side." }),
        };
    }
};
