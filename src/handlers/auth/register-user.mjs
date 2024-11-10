import AWS from "aws-sdk";
import registerUserRequestValidation from "../../validation/auth/RegisterUserRequest.mjs";

const cognito = new AWS.CognitoIdentityServiceProvider();

const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;

export const handler = async (event, context) => {
    try {
        const reqBody = event.body ? JSON.parse(event.body) : {};
        const params = await registerUserRequestValidation.validateAsync(reqBody);
        const signUpResult = await cognito
            .signUp({
                ClientId: CLIENT_ID,
                Username: params.email,
                Password: params.password,
                UserAttributes: [{ Name: "email", Value: params.email }],
            })
            .promise();
        return {
            statusCode: 200,
            body: JSON.stringify(signUpResult),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error || "Some error from server side." }),
        };
    }
};
