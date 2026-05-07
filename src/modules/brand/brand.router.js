import { Router} from "express";
import * as brandController from './controller/brand.controller.js' 
import { fileValidation, uploadFile } from "../../utils/cloudinaryMulter.js";
import validation from "../../middlewares/validation.js";
import * as brandValidation from './brand.validation.js'
const router =  Router();

router
    .post( '/createBrand',
            uploadFile(fileValidation.image).single('file'),
            validation(brandValidation.createBrandSchema),
            brandController.createBrand
    )
    .get('/getAllBrand', 
            brandController.getAllBrand
    )
    .get('/getBrandById/:brandId', 
            validation(brandValidation.getBrandByIdSchema),
            brandController.getBrandById
    )
    .put('/updateBrand/:brandId',
        uploadFile(fileValidation.image).single('file'),
        validation(brandValidation.updateBrandSchema),
        brandController.updateBrand
     )


export default router