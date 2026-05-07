import slugify from "slugify"
import brandModel from '../../../../DB/model/Brand.model.js'
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/errorHandling.js"

export const createBrand = asyncHandler(
     async(req,res,next)=>{

        const {name} = req.body
        if (await brandModel.findOne({name})) {
        return next(new Error('name already exists',{cause:409}));
        }

  
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/brand`})
    if (!secure_url) {
        return next(new Error('image not found',{cause:400}));

    }
    req.body.image = {secure_url,public_id}
    req.body.slug = slugify(name)

    const brand = await brandModel.create(req.body)
    return res.status(201).json({message: "done", brand})
}
)

export const getAllBrand = asyncHandler(
    async (req, res,next) => {
        const brands = await brandModel.find()
        return res.status(200).json({message: "done",brands })
})

export const getBrandById = asyncHandler(
    async (req, res, next) =>{
        const {brandId} = req.params
        const brand = await brandModel.findById({_id: brandId})
    return res.status(200).json({message: "done", brand})
    }
)


export const updateBrand = asyncHandler(
    async (req, res, next) =>{
    
    const {brandId} = req.params
    const brandExist = await brandModel.findById({_id: brandId})
    if (!brandExist) {

        return next(new Error('category not found',{cause:404}));
    }
    
    if (req.body.name) {
       
        if (await brandModel.findOne({name:req.body.name})) {
            return next(new Error('name already exists',{cause:409}));
        }
        req.body.slug = slugify(req.body.name)
    }

    
    if (req.file) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/brand`})
        if (!secure_url) {
            return next(new Error('image not found',{cause:404}));

        }
        await cloudinary.uploader.destroy(brandExist.image.public_id)
        req.body.image = {secure_url,public_id}
    }

    const newBrand = await brandModel.findByIdAndUpdate({_id: brandId},req.body,{new: true})
    return res.status(201).json({message: "done",newBrand})

}
)

