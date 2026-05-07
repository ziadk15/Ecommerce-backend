import { Router} from "express";
import * as productController from './controller/product.controller.js'
import { fileValidation, uploadFile } from "../../utils/cloudinaryMulter.js";
import auth, { roles } from "../../middlewares/auth.js";
import validation from "../../middlewares/validation.js";
import * as productValidation from './product.validation.js'
const router =  Router();

router.post('/createProduct',
auth(roles.Admin),
uploadFile(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:5}
]),
validation(productValidation.createProductSchema),
productController.createProduct)

.put('/updateProduct/:productId',
auth(roles.Admin),
uploadFile(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:5}
]),
validation(productValidation.updateProductSchema),
productController.updateProduct)

.get('/getAllProducts',
productController.getAllProducts
)

.get('/getOneProduct/:productId',
productController.getOneProduct
)


export default router