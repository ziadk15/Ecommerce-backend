import mongoose from 'mongoose';

const connection = async ()=>{
    return await mongoose.connect(process.env.DB_LOCAL).then(()=>{
        console.log("Connection established");
    }).catch((error)=>{
            console.log(error);
    })
}

export default connection

