let mongoose=require('mongoose');
const jobSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    summary:{
           type: String,
           required:true
    },
    duties:{
        type:String,
        required:true
    },
    qualifications:{
        type:String,
        required:true
    },
    environment:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    
    overview:{
        type:String,
        required:true
    },
    process:{
        type:String,
        required:true
    },
    applicants:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        },
        appliedAt:{
            type:Date,
            default:Date.now()
        }
    }],
    applicantCount:{
        type:Number,
        default:0
    }

});

let job=mongoose.model('job',jobSchema);
module.exports=job;