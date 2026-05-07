import joi from "joi"
import generalFields from "../../utils/generalFields.js"


export const createCategorySchema = joi.object({
    name:generalFields.name,
    file:generalFields.file,
    authorization:generalFields.authorization
}).required()

export const getCategoryByIdSchema = joi.object({
    categoryId:generalFields._id
}).required()

export const updateCategorySchema = joi.object({
    categoryId:generalFields._id,
    name:generalFields.name,
    file:generalFields.file,
    authorization:generalFields.authorization
}).required()