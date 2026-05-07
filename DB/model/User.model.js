import mongoose, {Schema,Types,model} from 'mongoose'

const userSchema = new Schema({

    userName:{
        type:String,
        required:[true,'userName is required'],
        min:[2,'minimum length is 2'],
        max:[15,'maximum length is 15'],
        lowercase:true
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,'password is required'],
    },
    phone:String,
    role:{
        type:String,
        default:'User',
        enum:['User','Admin']        
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:"offline",
        enum:['offline','online'],
        lowercase:true
    },
    gender:{
        type:String,
        default:'male',
        enum:['male','female']
    },
    code:String,
    address:String,
    image:String,
    DOB:String,
    wishList:[
        {
            type:Types.ObjectId,
            ref:'Product'
        }
    ]

},{
    timestamps: true,
})


const userModel = mongoose.model.User || model('User',userSchema)
export default userModel