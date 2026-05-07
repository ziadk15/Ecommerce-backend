import { Router} from "express";
import *as orderController from './controller/order.controller.js'
import *as orderValidation from './order.validation.js'
import auth, { roles } from "../../middlewares/auth.js";
import validation from "../../middlewares/validation.js";




const router =  Router();

router.post('/makeOrder', 
auth(roles.Admin), // متنساش تغير ال roles من admin ل user  انا عاملها دلوقتي ادمين عشان مخشش اغير في الداتا بيز
//validation(orderValidation.addToCartSchema),
orderController.makeOrder
)
.patch('/deliverOrder/:orderId',
auth(roles.Admin),
orderController.deliverOrder
)

export default router