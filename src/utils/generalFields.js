import joi from "joi"
import { Types } from "mongoose"

export const validateObjectId = (value,helper)=>{

    return Types.ObjectId.isValid(value)?true:helper.message('invalid value')
}


const generalFields = {
    name:joi.string().max(20).min(3).required(),
    email:joi.string().email({ tlds: { allow: ['com', 'net'] } }).required(),
    password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    id:joi.custom(validateObjectId),
    _id:joi.custom(validateObjectId).required(),
    authorization:joi.string().required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
        })
}

export default generalFields