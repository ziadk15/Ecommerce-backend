import { Router} from "express";
import * as couponController from './controller/coupon.controller.js'
import { fileValidation, uploadFile } from "../../utils/cloudinaryMulter.js";
import * as couponValidation from './coupon.validation.js'
import validation from "../../middlewares/validation.js";

const router =  Router();

router
    .post('/createCoupon',
        uploadFile(fileValidation.image).single('file'),
        validation(couponValidation.createCouponSchema),
        couponController.createCoupon
    )
    .get('/getAllCoupon', 
        couponController.getAllCoupon
    )
    .get('/getCouponById/:couponId', 
            validation(couponValidation.getCouponByIdSchema),
            couponController.getCouponById
    )
    .put('/updateCoupon/:couponId',
        uploadFile(fileValidation.image).single('file'),
        validation(couponValidation.updateCouponSchema),
        couponController.updateCoupon
     )




export default router