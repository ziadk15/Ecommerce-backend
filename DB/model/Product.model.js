import mongoose, {Schema,Types,model} from 'mongoose'

const productSchema = new Schema({

    name:{
        type:String,
        required: [true,'name is required'],
        trim:true,
        lowercase:true
    },
    slug:{
        type:String,
        required: [true,'slug is required'],
        trim:true,
        lowercase:true
    },
    mainImage:{
        type:Object,
        required: [true,'image is required']
    },
    subImages:[{
        type:Object,
    }],
    description:String,
    stock:Number,
    colors:[String],
    size:[String],
    finalPrice:{
        type:Number,
        required: [true,'price is required']
    },
    discount:{
        type:Number,
        default:0
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:[true,'createdBy is required'] // change true
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User'
        },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:[true,'categoryId is required'] // change true
    },
    subCategoryId:{
        type:Types.ObjectId,
        ref:'SubCategory',
        required:[true,'SubCategory is required'] // change true
    },
    brandId:{
        type:Types.ObjectId,
        ref:'Brand',
        required:[true,'Brand is required'] // change true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    customId:{
        type:String,
        required:true
    }

},{
    timestamps: true
})

const productModel =mongoose.model.Product || model('Product', productSchema)

export default productModel