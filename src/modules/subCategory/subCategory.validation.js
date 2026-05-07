import joi from "joi"
import generalFields from "../../utils/generalFields.js"


export const createSubCategorySchema = joi.object({
    categoryId:generalFields._id,
    name:generalFields.name,
    file:generalFields.file
}).required()

export const getSubCategoryByIdSchema = joi.object({
    subCategoryId:generalFields._id
}).required()

export const updateSubCategorySchema = joi.object({
    subCategoryId:generalFields._id,
    name:generalFields.name,
    file:generalFields.file
}).required()