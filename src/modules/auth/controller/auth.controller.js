import userModel from '../../../../DB/model/User.model.js'
import { generateToken, verifyToken } from '../../../utils/GenerateAndVerifyToken.js';
import { compare, hash } from '../../../utils/HashAndCompare.js';
import { sendEmail } from '../../../utils/email.js';
import { asyncHandler } from "../../../utils/errorHandling.js";
import {customAlphabet} from 'nanoid'

export const signUP = asyncHandler( 
    async (req,res,next)=>{

        const{email} = req.body
        const user = await userModel.findOne({email})
        if (user) {
            return next(new Error ('email already exists',{cause:409}));
        }

        const token = generateToken({payload:{email},signature:process.env.SIGN_UP_SIGNATURE,expiresIn:60*30})
        const rf_token = generateToken({payload:{email},signature:process.env.SIGN_UP_SIGNATURE,expiresIn:'2d'})
        
        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
        const rf_link = `${req.protocol}://${req.headers.host}/auth/refreshToken/${rf_token}`

        const html = `
        <a href='${link}'>confirm email</a>
        <br>
        <br>
        <a href='${rf_link}'>refresh link</a>
        `

        if (!sendEmail({to:email,subject:'confirm email',html})) {
            return next(new Error ('email already exists',{cause:409}));
        }

        req.body.password = hash({inputData:req.body.password})
        const newUser = await userModel.create(req.body)
        return res.status(201).json({message:"done",newUser:newUser._id})
}
)



export const confirmEmail = asyncHandler( 
    async (req,res,next)=>{
    
        const {token} = req.params
        const {email} = verifyToken({token,signature:process.env.SIGN_UP_SIGNATURE})
        if (!email) {
            return res.redirect('https://sequelize.org/docs/v6/getting-started/')
        }
        const user = await userModel.findOne({email})
        if (!user) {
            return res.redirect('https://sequelize.org/docs/v6/getting-started/')
        }
        if (user.confirmEmail) {
            return res.redirect('https://mongoosejs.com/docs/')
        }

        await userModel.updateOne({email},{confirmEmail:true})

        return res.redirect('https://mongoosejs.com/docs/')

    }
)


export const refreshToken = asyncHandler( 
    async (req,res,next)=>{
    
        const {token} = req.params
        const {email} = verifyToken({token,signature:process.env.SIGN_UP_SIGNATURE})
        if (!email) {
            return res.redirect('https://sequelize.org/docs/v6/getting-started/')
        }
        const user = await userModel.findOne({email})
        if (!user) {
            return res.redirect('https://sequelize.org/docs/v6/getting-started/')
        }
        if (user.confirmEmail) {
            return res.redirect('https://mongoosejs.com/docs/')
        }

        const newToken = generateToken({payload:{email},signature:process.env.SIGN_UP_SIGNATURE,expiresIn:60*10})
        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`

        const html = 
        `
        <a href='${link}'>confirm email</a>
        `
        if (!sendEmail({to:email,subject:'confirm email',html})) {
            return next(new Error ('email already exists',{cause:409}));
        }

        return res.send('<h1>check email</h1>')

    }
)


export const logIn = asyncHandler(
    async (req, res,next) => {

        const {email, password} = req.body
        const emailExists = await userModel.findOne({email})

        if (!emailExists) {
            return next(new Error('invalid email or password',{cause:404}));
        }
        if (!emailExists.confirmEmail) {
            return next(new Error('please confirm email',{cause:400}));
        }

        if (!compare({inputData:password,hashValue:emailExists.password})) {
            return next(new Error('invalid email or password',{cause:404}));
        }

        const token = generateToken({payload:{email,_id:emailExists._id},signature:process.env.TOKEN_SIGNATURE,expiresIn:60*30})
        const rf_token = generateToken({payload:{email,_id:emailExists._id},signature:process.env.TOKEN_SIGNATURE,expiresIn:60*60*30})

        await userModel.updateOne({email},{status:'online'})
        return res.json({message:"success",token,rf_token})
    }
)

export const sendCode = asyncHandler(
    async (req, res,next) => {

        const {email} = req.body
        const emailExists = await userModel.findOne({email})
        if (!emailExists) {
            return next (new Error('email not found',{cause:404}));
        }
        if (!emailExists.confirmEmail) {
            return next (new Error('please confirm email',{cause:400}));

        }
        const nanoId = customAlphabet('123456789',5)
        const code = nanoId()
        if (!sendEmail({to:email,subject:'forget pass',html:`<p>${code}</p>`})) {
            return next (new Error('fail to send email',{cause:400}));
        }
        await userModel.updateOne({email},{code})
        return res.status(200).json({message:"check your email"})
    }
)


export const forgetPassword = asyncHandler(
    async (req, res,next) => {

        const {email} = req.params
        const {code,password} = req.body
        const user = await userModel.findOne({email})
        if (!user) {
            return next (new Error('email not found',{cause:404}));
        }

        if (code != user.code) {
            return next (new Error('invalid code ',{cause:404}));
        }

        const newPassword = hash({inputData:password})
        await userModel.updateOne({email},{password:newPassword,code:null,status:'offline'})
        return res.status(200).json({message:"password updated"})
    }
)