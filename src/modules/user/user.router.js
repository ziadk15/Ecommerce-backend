import { Router } from "express";
import auth, { roles } from "../../middlewares/auth.js";
import * as  userController from './controller/user.controller.js'



const router = Router()

router.patch('/addToWishList/:productId',auth(roles.Admin),userController.addToWishList)

export default router
