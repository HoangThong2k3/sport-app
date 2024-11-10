import Joi from "joi";

const PASSWORD_REGEX = "^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$";

const loginUserRequestValidation = Joi.object({
    email: Joi.string().email().required(),
    // password: Joi.string().regex(new RegExp(PASSWORD_REGEX, "g")).required()
    password: Joi.string().required()
});

export default loginUserRequestValidation;
