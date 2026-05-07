import jwt from 'jsonwebtoken'
import userModel from '../../DB/model/User.model.js'
import { asyncHandler } from '../utils/errorHandling.js'

export const roles = {

    Admin:'Admin',
    User:'User'
}

const auth = (role = Object.values(roles)) => {
    return asyncHandler(
        async (req,res,next) => {
    
        const {authorization} = req.headers
        if (!authorization) {
            return next (new Error("please login",{cause:401}))
        }
        if (!authorization.startsWith(process.env.BEARER_KEY)) {
            return next (new Error("invalid bearer key",{cause:404}))
        }
        const token = authorization.split(process.env.BEARER_KEY)[1]
        if (!token) {
            return next (new Error("invalid token",{cause:400}))
        }
    
        const payload = jwt.verify(token,process.env.TOKEN_SIGNATURE)
        //console.log(payload);
        if(!payload?._id){
            return next (new Error("invalid payload",{cause:404}))
        }
        
        const user = await userModel.findById({_id:payload._id}).select('-password')
        if (!user) {
            return next (new Error("user not found",{cause:404}))
        }
        if (user.status!='online') {
            return next (new Error("invalid token please login",{cause:400}))
        }
        if (!role.includes(user.role)) {
            return next (new Error("no authorization",{cause:401}))
        }
        req.user = user
        return next()
    }
    )
}

export default auth