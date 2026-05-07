import { Router} from "express";
import *as cartController from './controller/cart.controller.js'
import *as cartValidation from './cart.validation.js'
import auth, { roles } from "../../middlewares/auth.js";
import validation from "../../middlewares/validation.js";




const router =  Router();

router.post('/addToCart', 
auth(roles.Admin), // متنساش تغير ال roles من admin ل user  انا عاملها دلوقتي ادمين عشان مخشش اغير في الداتا بيز
validation(cartValidation.addToCartSchema),
cartController.addToCart)

.patch('/deleteFromCart/:productId', 
auth(roles.Admin) // متنساش تغير ال roles من admin ل user  انا عاملها دلوقتي ادمين عشان مخشش اغير في الداتا بيز
,cartController.deleteFromCart)

.patch('/clearFromCart', 
auth(roles.Admin) // متنساش تغير ال roles من admin ل user  انا عاملها دلوقتي ادمين عشان مخشش اغير في الداتا بيز
,cartController.clearFromCart)


export default router