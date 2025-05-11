let mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const employerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    companyName: {
         type: String,
          required: true
         },
   industry:{
        type:String,
        required:true
        },

    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['employer','admin'],
        default:'employer'
    },
    mobile:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    companyDescription: { 
        type: String 
    },

    token: { 
        type: String
     }

});
 employerSchema.pre('save', async function(next){
    const person = this;
    if(!person.isModified('password')) return next();
     
    try{
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(person.password, salt);
        person.password=hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
 });

 employerSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};


let employer=mongoose.model('Employer',employerSchema);
module.exports=employer;