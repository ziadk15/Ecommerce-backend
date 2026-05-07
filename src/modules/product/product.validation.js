import joi from "joi"
import generalFields from "../../utils/generalFields.js"


export const createProductSchema = joi.object({
    name:generalFields.name,
    description:joi.string().min(3).max(50),
    price:joi.number().min(1).positive().required(),
    discount:joi.number().positive(),
    stock:joi.number().positive().integer().min(1).required(),
    colors:joi.array(),
    size:joi.array(),
    categoryId:generalFields._id,
    subCategoryId:generalFields._id,
    brandId:generalFields._id,
    authorization:generalFields.authorization,
    files:joi.object({
        mainImage:joi.array().items(generalFields.file.required()).length(1).required(),
        subImages:joi.array().items(generalFields.file.required()).min(1).max(5)
    }).required()
}).required()



export const updateProductSchema = joi.object({
    name:joi.string().min(3).max(30),
    description:joi.string().min(3).max(50),
    price:joi.number().min(1).positive(),
    discount:joi.number().positive(),
    stock:joi.number().positive().integer().min(1),
    colors:joi.array(),
    size:joi.array(),
    productId:generalFields._id,
    categoryId:generalFields.id,
    subCategoryId:generalFields.id,
    brandId:generalFields.id,
    authorization:generalFields.authorization,
    files:joi.object({
        mainImage:joi.array().items(generalFields.file.required()).length(1),
        subImages:joi.array().items(generalFields.file.required()).min(1).max(5)
    })
}).required()