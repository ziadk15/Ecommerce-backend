import joi from "joi"
import generalFields from "../../utils/generalFields.js"


export const createBrandSchema = joi.object({
    name:generalFields.name,
    file:generalFields.file
}).required()

export const getBrandByIdSchema = joi.object({
    brandId:generalFields._id
}).required()

export const updateBrandSchema = joi.object({
    brandId:generalFields._id,
    name:generalFields.name,
    file:generalFields.file
}).required()