import AWS from "aws-sdk";
import changePasswordRequestValidation from "../../validation/auth/ChangePasswordRequest.mjs";

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event, context) => {
  try {
    const reqBody = event.body ? JSON.parse(event.body) : {};

    // Validate request parameters for change password
    const params = await changePasswordRequestValidation.validateAsync(reqBody);

    // Extract parameters
    const { PreviousPassword, ProposedPassword, AccessToken } = params;

    // Call changePassword with validated parameters
    const changePasswordResult = await cognito
      .changePassword({
        PreviousPassword,
        ProposedPassword,
        AccessToken,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(changePasswordResult),
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Server error." }),
    };
  }
};
