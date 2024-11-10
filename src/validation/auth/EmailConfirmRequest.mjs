import Joi from "joi";


const emailConfirmRequest = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().required()
});

export default emailConfirmRequest;
