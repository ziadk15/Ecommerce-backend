import {Router} from 'express'
import * as authController from './controller/auth.controller.js'
import *as authValidation from './auth.validation.js'
import validation from '../../middlewares/validation.js'
const router = Router()

router.post('/signUp',
validation(authValidation.signUpSchema)
,
 authController.signUP
 )
 .get('/confirmEmail/:token',
  validation(authValidation.tokenSchema),
  authController.confirmEmail
  )
  .get('/refreshToken/:token',
  validation(authValidation.tokenSchema)
  ,
  authController.refreshToken
  )
  .post('/logIn',
   validation(authValidation.logInSchema)
   ,
  authController.logIn
  )
  .patch('/sendCode',
  validation(authValidation.sendCodeSchema),
  authController.sendCode
  )
  .put('/forgetPassword/:email',
  validation(authValidation.forgetPasswordSchema),
  authController.forgetPassword
  )



export default router