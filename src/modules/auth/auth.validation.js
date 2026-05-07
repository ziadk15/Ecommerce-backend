import joi from "joi"
import generalFields from "../../utils/generalFields.js"


export const signUpSchema = joi.object({

    email:generalFields.email,
    userName:joi.string().min(3).max(15).trim().required(),
    password:generalFields.password,
    cPassword:joi.string().valid(joi.ref('password')).required(),
    phone:joi.string()

}).required()

export const tokenSchema = joi.object({

    token:joi.string().required()

}).required()


export const logInSchema = joi.object({

    email:generalFields.email,
    password:generalFields.password

}).required()

export const sendCodeSchema = joi.object({

    email:generalFields.email,

}).required()

export const forgetPasswordSchema = joi.object({

    email:generalFields.email,
    code:joi.string().required(),
    password:generalFields.password,
    cPassword:joi.string().valid(joi.ref('password')).required()

}).required()
