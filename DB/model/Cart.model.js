import mongoose, {Schema,Types,model} from 'mongoose'

const cartSchema = new Schema({

    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    products:[{
        productId:{
            type:Types.ObjectId,
        ref:'Product',
        required:true,
        unique:true
        },
        quantity:{
            type:Number,
            required:true,
            min:1
        }
    }]

},{
    timestamps: true
})

const cartModel =mongoose.model.Cart || model('Cart', cartSchema)

export default cartModel