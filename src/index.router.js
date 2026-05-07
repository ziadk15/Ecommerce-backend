import categoryRouter from './modules/category/category.router.js'
import subCategoryRouter from './modules/subCategory/subCategory.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import brandRouter from './modules/brand/brand.router.js'
import authRouter from './modules/auth/auth.router.js'
import productRouter from './modules/product/product.router.js'
import cartRouter from './modules/cart/cart.router.js'
import orderRouter from './modules/order/order.router.js'
import userRouter from './modules/user/user.router.js'
import connection from "../DB/connection.js";
import {globalError} from './utils/errorHandling.js'

const bootstrap = (app,express)=>{

    //convert buffer to data
    app.use(express.json());

    //setup API routing
    app.use('/category',categoryRouter)
    app.use('/subCategory',subCategoryRouter)
    app.use('/coupon',couponRouter)
    app.use('/brand',brandRouter)
    app.use('/auth',authRouter)
    app.use('/product',productRouter)
    app.use('/cart',cartRouter)
    app.use('/order',orderRouter)
    app.use('/user',userRouter)
    app.use('*',(req, res, next)=>{
        return res.json("invalid request")
    })

    connection()
    app.use(globalError)
}

export default bootstrap