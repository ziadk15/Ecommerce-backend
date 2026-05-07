import slugify from "slugify"
import categoryModel from "../../../../DB/model/Category.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/errorHandling.js"


//-1
export const createCategory = asyncHandler(
    async(req,res,next)=>{

    const {name} = req.body
    if (await categoryModel.findOne({name})) {
        return next(new Error('name already exists',{cause:409}));
    }

  
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`})
    if (!secure_url) {
        return next(new Error('image not found',{cause:400}));

    }
    req.body.image = {secure_url,public_id}
    req.body.slug = slugify(name)
    req.body.createdBy = req.user._id

    const category = await categoryModel.create(req.body)
    return res.status(201).json({message: "done", category})
}

)

//-2
export const getAllCategory = asyncHandler(
    async(req,res,next)=>{

    const categories = await categoryModel.find().populate({
        path: 'subCategory'
    })
    return res.status(200).json({message: "done", categories})
}
)


//-3
export const getCategoryById = asyncHandler(
    async(req,res,next)=>{
    const {categoryId} = req.params
    const category = await categoryModel.findById({_id: categoryId}).populate({
        path: 'subCategory'
    })
    return res.status(200).json({message: "done", category})

}
)

//-4

export const updateCategory = asyncHandler(
    async (req, res, next) =>{
    
    const {categoryId} = req.params
    const categoryExist = await categoryModel.findById({_id: categoryId})
    if (!categoryExist) {

        return next(new Error('category not found',{cause:404}));
    }
    
    if (req.body.name) {
       
        if (await categoryModel.findOne({name:req.body.name})) {
            return next(new Error('name already exists',{cause:409}));
        }
        req.body.slug = slugify(req.body.name)
    }

    


    if (req.file) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`})
        if (!secure_url) {
            return next(new Error('image not found',{cause:404}));

        }
        await cloudinary.uploader.destroy(categoryExist.image.public_id)
        req.body.image = {secure_url,public_id}
    }

    req.body.updatedBy = req.user._id

    const newCategory = await categoryModel.findByIdAndUpdate({_id: categoryId},req.body,{new: true})
    return res.status(201).json({message: "done",newCategory})

}
)


