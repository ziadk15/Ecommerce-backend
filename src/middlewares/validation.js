import { asyncHandler } from "../utils/errorHandling.js"


const validation = (schema)=>{

    return asyncHandler(async (req,res,next)=>{
        let methods
        if(req.headers.authorization){

             methods = {...req.body, ...req.query, ...req.params,authorization:req.headers.authorization}
        }else{
            methods = {...req.body, ...req.query, ...req.params}
        }

        if (req.file) {
            methods.file = req.file
        }

        if (req.files) {
            methods.files = req.files
        }
        
        const validationResult = await schema.validate(methods,{abortEarly:false})
        if (validationResult?.error) {
        return res.json({message:'validation error',result:validationResult.error.details})
        }
        return next()
    })
}

export default validation