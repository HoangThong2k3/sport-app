import AWS from "aws-sdk";
import emailConfirmRequest from "../../validation/auth/EmailConfirmRequest.mjs";
import {PasswordType, TokenModelType} from "aws-sdk/clients/cognitoidentityserviceprovider";

const cognito = new AWS.CognitoIdentityServiceProvider();

const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;

export const handler = async (event, context) => {
    try {
        const reqBody = event.body ? JSON.parse(event.body) : {};
        const params = await emailConfirmRequest.validateAsync(reqBody);
        const signUpResult = await cognito
            .changePassword({
                PreviousPassword: "old-pw",
                ProposedPassword: "new-pw",
                AccessToken: "header-token",
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
