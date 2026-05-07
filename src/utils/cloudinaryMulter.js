import multer from "multer";


export const fileValidation = {
    image:['image/png', 'image/jpeg'],
    file:['application/json', 'application/xml', 'application/pdf'],
    video:['video/mp4']
}

export function uploadFile(customValidation=[]){

    const storage = multer.diskStorage({})

    function fileFilter  (req,file,cb){
        if (customValidation.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb('Invalid file',false)
        }
    }
     
    const upload = multer({fileFilter,storage})
    return upload
}

