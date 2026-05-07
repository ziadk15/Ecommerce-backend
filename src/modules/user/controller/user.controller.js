import userModel from '../../../../DB/model/User.model.js'
import productModel from '../../../../DB/model/Product.model.js'
import { asyncHandler } from '../../../utils/errorHandling.js';



export const addToWishList = asyncHandler(
    async(req, res, next) =>{
        const {productId} = req.params
        const product = await productModel.findById({_id:productId,isDeleted:false})
        if (!product) {
            return next(new Error('invalid product',{cause:404}))
        }
        const user = await userModel.findByIdAndUpdate({_id:req.user._id},{$addToSet:{wishList:product._id}},{new:true})
        return res.json({message:"done",user})
    }
    
)
