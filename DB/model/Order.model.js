import mongoose, {Schema,Types,model} from 'mongoose'

const orderSchema = new Schema({

    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
        },
    products:[{

        name:{
            type:String,
            required:true,
            min:3,
            max:50
        },
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
        },
        //سعر القطعة الواحده
        unitPrice:{
            type:Number,
            required:true,
            min:1
        },
        //سعر القطعة * الكمية
        totalPrice:{
            type:Number,
            required:true,
            min:1
        },
    }],
    address:{
        type:String,
        required:true
    },
    phone:{
        type:[String],
        required:true
    },
    paymentTypes:{
        type:String,
        enum:['card','cash'],
        default:'cash'
    },
    //السعر النهائي بعد استخدام الكوبون
    finalPrice:{
        type:Number,
        required:true,
        min:1
    },
    //السعر قبل استخدام الكوبون
    subPrice:{
        type:Number,
        required:true,
        min:1
    },
    note:String,
    couponId:{
        type:Types.ObjectId,
        ref:'Coupon',
    },
    status:{
        type:String,
        enum:['placed','onWay','cancelled','rejected','delivered','waitForPayment'],
        default:'placed'
    },
    reason:String,
    updatedBy:{
        type:Types.ObjectId,
        ref:'User'
    }


},{
    timestamps: true
})
//mongoose.model.Order ||
const orderModel = model('Order', orderSchema)

export default orderModel