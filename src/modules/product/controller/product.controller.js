import { asyncHandler } from "../../../utils/errorHandling.js";
import categoryModel from "../../../../DB/model/Category.model.js"
import subCategoryModel from '../../../../DB/model/SubCategory.model.js'
import brandModel from '../../../../DB/model/Brand.model.js'
import slugify from "slugify";
import { nanoid } from "nanoid";
import productModel from "../../../../DB/model/Product.model.js";
import cloudinary from "../../../utils/cloudinary.js"
import { apiFeatures } from "../../../utils/apiFeatures.js";






export const createProduct = asyncHandler(
    async(req,res,next)=>{


        const {categoryId,subCategoryId,brandId,price,discount} = req.body
     if (!await categoryModel.findById({_id: categoryId})) {
        return next(new Error('categoryId not found',{cause:404}));
        }
    if (!await subCategoryModel.findById({_id: subCategoryId,categoryId})) {
        return next(new Error('subCategoryId not found',{cause:404}));
     }
    if (!await brandModel.findById({_id: brandId})) {
        return next(new Error('brandId not found',{cause:404}));
     }

    req.body.slug = slugify(req.body.name,{
        trim: true,
        lower: true
    })

    req.body.finalPrice = price-(price*discount||0)/100
    
    req.body.customId = nanoid()

    const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}/mainImage`})

    if (!secure_url) {
        return next(new Error('mainImage not found',{cause:400}));
    }
    req.body.mainImage = {secure_url,public_id}
   

    if (req.files.subImages.length) {
        let images = []
        for (const image of req.files.subImages) {
            const {secure_url,public_id} = await cloudinary.uploader.upload(image.path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}/subImages`})
            if (!secure_url) {
                return next(new Error('subImages not found',{cause:400}));
            }
           images.push({secure_url,public_id})
        }
        req.body.subImages = images
    }
    req.body.createdBy = req.user._id
    const product = await productModel.create(req.body)
    return res.status(201).json({message:'done',product})
    
}

)



export const updateProduct = asyncHandler(
    async(req,res,next)=>{

    const {productId} = req.params
    const product = await productModel.findById({_id:productId})
     if (!product) {
        return next(new Error('products not found',{cause:404}));
    }
    if (req.body.subCategoryId && !await subCategoryModel.findById({_id:req.body.subCategoryId})) {
        return next(new Error('subCategory not found',{cause:404}));
    }
    if (req.body.brandId &&!await brandModel.findById({_id: brandId})) {
        return next(new Error('brand not found',{cause:404}));
    }

    if (req.body.name) {
        req.body.slug = slugify(req.body.name,{
            trim: true,
            lower: true
        })
    }

    req.body.finalPrice = req.body.price || product.price - (req.body.price || product.price*req.body.discount||product.discount||0)/100
    
    
    if (req.files?.mainImage?.length) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/${product.customId}/mainImage`})
        if (!secure_url) {
            return next(new Error('image not found',{cause:400}));
        }
        await cloudinary.uploader.destroy(product.mainImage.public_id)
        req.body.mainImage = {secure_url,public_id}
    }

    if (req.files?.subImages?.length) {
        for (const image of req.files.subImages) {
            const {secure_url,public_id} = await cloudinary.uploader.upload(image.path,{folder:`${process.env.APP_NAME}/product/${product.customId}/subImages`})
            if (!secure_url) {
                return next(new Error('image not found',{cause:400}));
           }
           product.subImages.push({secure_url,public_id})
        }
        req.body.subImages = product.subImages
    }
    req.body.updatedBy = req.user._id
    const update = await productModel.findByIdAndUpdate({_id:productId},req.body,{new:true})
    return res.json({message:'done',update})
}
)

export const getAllProducts = asyncHandler(
    async (req, res,next) => {
        //  let {page,size} = req.query
        //  const {limit,skip} = pagination(page,size)
        // // const products = await productModel.find({}).limit(limit).skip(skip)  
        
        // let filter = {...req.query}
        // let excludeQueryParams = ['page','size','skip','fields','sort','search']
        // excludeQueryParams.forEach((element)=>{
        //     delete filter[element]
        // })
        // filter = JSON.parse(JSON.stringify(filter).replace(/(gt|lt|eq|gte|lte|ne|nin|in)/g,(match)=>`$${match}`))
        // const products = await productModel.find(filter).limit(limit).skip(skip)


        // let products
        // if (req.query.sort) {
        //     products = await productModel.find({}).sort(req.query.sort.replaceAll(',',' '))
        // }

        // let products
        // if (req.query.fields) {
        //     products = await productModel.find({}).select(req.query.fields.replaceAll(',',' '))
        // }

        // const products = await productModel.find({
        //     name:{$regex: req.query.search}
        // })

        const apiFeature = new apiFeatures(productModel.find(),req.query).pagination()
        const products = await apiFeature.mongooseQuery



        return res.status(200).json({message:"success",products})
    }
)


export const getOneProduct = asyncHandler(
    async (req, res,next) => {

        const product = await productModel.findById({_id:req.params.productId})
        return res.status(200).json({message:"success",product})
    }
)
