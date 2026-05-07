import cartModel from "../../../../DB/model/Cart.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



export const addToCart = asyncHandler(
    async (req,res,next)=>{

        const{_id} = req.user
        const {productId,quantity} = req.body
        const cart = await cartModel.findOne({userId:_id})
        const product = await productModel.findOne({_id:productId,isDeleted:false,stock:{$gte:quantity}})
        
        if (!product) {
            return next(new Error('Product not found',{cause:404}))
        }

        if (!cart) {
            const date={

                userId : _id,
                products:[{
                    productId : product._id,
                    quantity
                }]
            }
            const newCart = await cartModel.create(date)
            return res.status(201).json({message:'done', newCart})
        }

        let exist = false
        for(let product of cart.products) {
            if (product.productId.toString() == productId) {
                product.quantity = quantity
                exist = true
                break; 
            }
        }
        if (!exist) {
            const add = await cartModel.findByIdAndUpdate({_id:cart._id},{
                $push:{
                    products :{
                
                        productId : product._id,
                        quantity
                }
        } 
    },{new:true})
    return res.status(200).json({message:"done",cart:add})
  }

  const add = await cartModel.findByIdAndUpdate({_id:cart._id},{
    products:cart.products
},{new:true})
return res.json({message:"done",cart:add})

}
)




export const deleteFromCart = asyncHandler(
    async (req,res,next)=>{
        const{_id} = req.user
        const cart = await cartModel.findOne({userId:_id})
        
        if (!cart) {
            return next(new Error('cart not found',{cause:404}))
        }

        const newCart = await cartModel.findByIdAndUpdate({_id:cart._id},{
           
                $pull:{
            
                    products:{
                        productId:{$in:req.params.productId}
                    }
            }
    
},{new:true})
return res.json({message:"done",cart:newCart})
    }
)




export const clearFromCart = asyncHandler(
    async (req,res,next)=>{
        const{_id} = req.user
        const cart = await cartModel.findOne({userId:_id})
        
        if (!cart) {
            return next(new Error('cart not found',{cause:404}))
        }

        const newCart = await cartModel.findByIdAndUpdate({_id:cart._id},{
           
            products:[]
    
},{new:true})
return res.json({message:"done",cart:newCart})
    }
)