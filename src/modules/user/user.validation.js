import joi from 'joi'
import generalFields from '../../../utils/generalFields.js'

export const signUpSchema = joi.object({

    userName:joi.string().min(3).max(15).required(),
    email:generalFields.email,
    gender:joi.string().valid('male', 'female'),
    password:generalFields.password,
    cPassword:joi.string().valid(joi.ref('password')).required()
}).required()

export const logInSchema = joi.object({

   
    email:generalFields.email,
    
    password:generalFields.password
    
}).required()

export const changePassSchema = joi.object({

    oldPassword:generalFields.password,
    newPassword:generalFields.password,
    cPassword:joi.string().valid(joi.ref('newPassword')).required()
    
}).required()

export const viewSchema = joi.object({

    _id:generalFields._id
    
}).required()

export const profileSchema = joi.object({

    authorization:generalFields.authorization
    
}).required()

export const updateUserSchema = joi.object({
    
    age:joi.number().integer(),
    firstName:joi.string().min(3).max(15),
    lastName:joi.string().min(3).max(15),
    authorization:generalFields.authorization
    
}).required()

export const deleteUserSchema = joi.object({
    
    _id:generalFields._id,
    authorization:generalFields.authorization
    
}).required()