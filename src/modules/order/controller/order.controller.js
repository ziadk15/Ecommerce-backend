import cartModel from "../../../../DB/model/Cart.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


export const makeOrder = asyncHandler(
    async (req,res,next) => {
        let {products,couponName} = req.body
        const {_id} = req.user
        const cart = await cartModel.findOne({userId: _id})
        if (!cart?.products?.length) {
            return next(new Error("Cart not found",{cause:404}));
        }
        let coupon = {amount:0}
        if (couponName) {
            coupon = await couponModel.findOne({name: couponName , usedBy :{$nin:_id}})
            if (!coupon) {
                return next(new Error("coupon not found",{cause:404}));
            }
            if (coupon.expireIn.getTime() < new Date().getTime()) {
                return next(new Error("expire coupon",{cause:400}));
            }
        }

        if (!products?.length) {
            products = cart.products.toObject()
        }

        const allProducts = []
        let subPrice = 0
        for(const product of products){
            const productExist = await productModel.findOne({
                _id:product.productId,
                isDeleted:false,
                stock:{$gte:product.quantity}
            })
            if (!productExist) {
                return next(new Error("product not found",{cause:400}));
            }
            product.name = productExist.name
            product.unitPrice = productExist.finalPrice
            product.totalPrice = productExist.finalPrice * product.quantity
            allProducts.push(product)
            subPrice+=product.totalPrice

        }

        for(const product of products){
        
            await cartModel.updateOne({userId:_id},{
                $pull:{
                    products:{
                        productId:{$in:product.productId}
                    }
                }
            })
            await productModel.updateOne({_id:product.productId},{$inc:{stock:-parseInt(product.quantity)}})
        }


        req.body.products = allProducts
        req.body.subPrice = subPrice
        req.body.finalPrice =subPrice - (subPrice * coupon.amount) / 100
        req.body.userId = _id
        const order = await orderModel.create(req.body)
        if (couponName) {
            await couponModel.updateOne({_id:coupon._id},{$push:{usedBy:_id}})
        }
        return res.json({message:"done",order})
    
    }
)


export const cancelOrder = asyncHandler(
    async (req,res,next) => {
        const {orderId} = req.params
        const order = await orderModel.findById({_id:orderId})
        if (!order) {
            return next (new Error('not found order',{cause:404}));
        }
        if (order.status != 'placed' && order.status != 'waitForPayment') {
            return next (new Error('invalid canceled order',{cause:400}));

        }

        for (const product of order.products){
 
            await productModel.updateOne({_id:product.productId},{$inc:{stock: parseInt(product.quantity)}})
        }

        if (order.couponId) {
            await couponModel.updateOne({_id:coupon._id},{$pull:{usedBy:req.user._id}})

        }

        const updateOrder = await orderModel.updateOne({_id:orderId},{status:'cancel'})
        return response.json({message:done,updateOrder})
    }
)


export const deliverOrder = asyncHandler(
    async (req,res,next) => {
        const {orderId} = req.params
        const order = await orderModel.findById({_id:orderId})
        if (!order) {
            return next (new Error('not found order',{cause:404}));
        }
        if (order.status != 'onWay') {
            return next (new Error('invalid delivered order',{cause:400}));

        }

        

        const updateOrder = await orderModel.updateOne({_id:orderId},{status:'delivered'})
        return response.json({message:done,updateOrder})
    }
)


