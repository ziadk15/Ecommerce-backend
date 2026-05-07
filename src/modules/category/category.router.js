import { Router} from "express";
import * as categoryController from './controller/category.controller.js' 
import subCategoryRouter from '../subCategory/subCategory.router.js'
import { fileValidation, uploadFile } from "../../utils/cloudinaryMulter.js";
import validation from "../../middlewares/validation.js";
import * as categoryValidation from './category.validation.js'
import auth from "../../middlewares/auth.js";
import categoryEndPoint from "./category.endPoint.js";
const router =  Router();

router
    .post( '/createCategory',
            auth(categoryEndPoint.create),
            uploadFile(fileValidation.image).single('file'),
            validation(categoryValidation.createCategorySchema),
            categoryController.createCategory
    )
    .get('/getAllCategory', 
            categoryController.getAllCategory
    )
    .get('/getCategoryById/:categoryId', 
            validation(categoryValidation.getCategoryByIdSchema),
            categoryController.getCategoryById
    )
    .put('/updateCategory/:categoryId',
        auth(categoryEndPoint.update),
        uploadFile(fileValidation.image).single('file'),
        validation(categoryValidation.updateCategorySchema),
        categoryController.updateCategory
     )
     .use('/:categoryId/subCategory',subCategoryRouter) 


export default router