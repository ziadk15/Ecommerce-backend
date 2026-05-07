import slugify from "slugify"
import subCategoryModel from '../../../../DB/model/SubCategory.model.js'
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import categoryModel from "../../../../DB/model/Category.model.js"


//-1
export const createSubCategory = asyncHandler(
    async(req,res,next)=>{

        const { categoryId } = req.params
        const categoryExists = await categoryModel.findById({_id: categoryId})
        if (!categoryExists) {
            return next(new Error('Could not find category',{cause:404}))
        }
        const {name} = req.body
        if (await subCategoryModel.findOne({name})) {
            return next(new Error('name already exist',{cause:409}))
        }
        const{secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/${categoryId}/subCategory`})
        if (!secure_url) {
            return next(new Error('image not found',{cause:400}))
        }
        req.body.image = {secure_url,public_id}
        req.body.slug = slugify(name)
        req.body.categoryId = categoryId
        const newSubCategory = await subCategoryModel.create(req.body)
        return res.json({message:"done",newSubCategory})
}

)

export const getAllSubCategory = asyncHandler(
    async(req,res,next)=>{
    const {categoryId} = req.params
    const subCategories = await subCategoryModel.find({categoryId}).populate({
        path:'categoryId'
    })
    return res.status(200).json({message: "done", subCategories})
}
)

export const getSubCategoryById = asyncHandler(
    async(req,res,next)=>{
    const {subCategoryId} = req.params
    const subCategory = await subCategoryModel.findById({_id: subCategoryId}).populate({
        path:'categoryId'
    })
    return res.status(200).json({message: "done", subCategory})

}
)


export const updateSubCategory = asyncHandler(
    async (req, res, next) =>{
    
    const {subCategoryId} = req.params
    const subCategoryExist = await subCategoryModel.findById({_id: subCategoryId})
    if (!subCategoryExist) {

        return next(new Error('subCategory not found',{cause:404}));
    }
    
    if (req.body.name) {
       
        if (await subCategoryModel.findOne({name:req.body.name})) {
            return next(new Error('name already exists',{cause:409}));
        }
        req.body.slug = slugify(req.body.name)
    }

    if (req.file) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/${req.params.categoryId}/subCategory`})
        if (!secure_url) {
            return next(new Error('image not found',{cause:404}));
        }
        await cloudinary.uploader.destroy(subCategoryExist.image.public_id)
        req.body.image = {secure_url,public_id}
    }

    const newSubCategory = await subCategoryModel.findByIdAndUpdate({_id: subCategoryId},req.body,{new: true})
    return res.status(201).json({message: "done",newSubCategory})

}
)