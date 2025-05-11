let mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
           type: Number,
           required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    panCardNumber:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['job_seeker','admin'],
        default:'job_seeker'
    },
    token: { 
        type: String
     },

});
 userSchema.pre('save', async function(next){
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

 userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};


let user=mongoose.model('User',userSchema);
module.exports=user;