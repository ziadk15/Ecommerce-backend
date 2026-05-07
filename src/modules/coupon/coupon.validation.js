import joi from "joi"
import generalFields from "../../utils/generalFields.js"


export const createCouponSchema = joi.object({
    name:generalFields.name,
    file:generalFields.file,
    amount:joi.number().positive().min(1).max(100).required(),
    expireIn:joi.string()
}).required()

export const getCouponByIdSchema = joi.object({
    couponId:generalFields._id
}).required()

export const updateCouponSchema = joi.object({
    couponId:generalFields._id,
    name:generalFields.name,
    file:generalFields.file,
    amount:joi.number().positive().min(1).max(100),
    expireIn:joi.string()
}).required()