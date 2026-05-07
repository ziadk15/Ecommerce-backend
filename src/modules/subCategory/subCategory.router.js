import { Router} from "express";
import * as subCategoryController from './controller/subCategory.controller.js' 
import { fileValidation, uploadFile } from "../../utils/cloudinaryMulter.js";
import validation from "../../middlewares/validation.js";
import * as subCategoryValidation from './subCategory.validation.js'
const router =  Router({mergeParams:true});

router
    .post( '/createSubCategory',
            uploadFile(fileValidation.image).single('file'),
            validation(subCategoryValidation.createSubCategorySchema),
            subCategoryController.createSubCategory
    )
    .get('/getAllSubCategory', 
        subCategoryController.getAllSubCategory
    )
    .get('/getSubCategoryById/:subCategoryId', 
        validation(subCategoryValidation.getSubCategoryByIdSchema),
        subCategoryController.getSubCategoryById
    )
    .put('/updateCategory/:subCategoryId',
        uploadFile(fileValidation.image).single('file'),
        validation(subCategoryValidation.updateSubCategorySchema),
        subCategoryController.updateSubCategory
     ) 
       


export default router