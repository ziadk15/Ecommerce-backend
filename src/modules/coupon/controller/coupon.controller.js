import couponModel from "../../../../DB/model/Coupon.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js"



export const createCoupon = asyncHandler( 
    async (req,res,next)=>{

        const {name} = req.body
        if (await couponModel.findOne({name})) {
            return next (new Error('name already exists',{cause:409}));
        }

        if (req.file) {
            const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/coupon`})
            if (!secure_url) {
                return next(new Error('image not found',{cause:400}));
        
            }
            req.body.image = {secure_url,public_id}
        }

        const coupon = await couponModel.create(req.body)
        return res.status(201).json({message:'done', coupon})
})


export const getAllCoupon = asyncHandler(
    async(req,res,next)=>{

    const coupons = await couponModel.find()
    return res.status(200).json({message: "done", coupons})
}
)


//-3
export const getCouponById = asyncHandler(
    async(req,res,next)=>{
    const {couponId} = req.params
    const coupon = await couponModel.findById({_id: couponId})
    return res.status(200).json({message: "done", coupon})

}
)

export const updateCoupon = asyncHandler(
    async (req, res, next) =>{
    
    const {couponId} = req.params
    const couponExist = await couponModel.findById({_id: couponId})
    if (!couponExist) {

        return next(new Error('coupon not found',{cause:404}));
    }
    
    if (req.body.name) {
       
        if (await couponModel.findOne({name:req.body.name})) {
            return next(new Error('name already exists',{cause:409}));
        }
    }

    if (req.file) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/coupon`})
        if (!secure_url) {
            return next(new Error('image not found',{cause:404}));

        }
        if (couponExist.image?.public_id) {
            await cloudinary.uploader.destroy(couponExist.image.public_id)
        }
        req.body.image = {secure_url,public_id}
    }

    const newCoupon = await couponModel.findByIdAndUpdate({_id: couponId},req.body,{new: true})
    return res.status(201).json({message: "done",newCoupon})

}
)