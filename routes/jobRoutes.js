let express=require('express');
const router=express.Router();
const { generateToken, jwtAuthMiddleware } = require('../jwt');
const job = require('../modules/job');
const jwt = require('jsonwebtoken');
const employer = require('../modules/employer');
const user = require('../modules/user');

//to check weather employer or not
const checkEmployerRole=async(userId)=>{
     try{
        const users= await employer.findById(userId);
        return users.role === 'employer'; 
     }catch(err){
        return false;
     }
}
//to add a job
router.post('/list',jwtAuthMiddleware,async(req, res)=>{
    try{
        if(!await(checkEmployerRole(req.user.id))){
            return res.status(403).json({message:'User dose not have employer role'})  
        }
        const data = req.body
        const newUser=new job(data)
       const response = await newUser.save()
       console.log("Data Saved");
  
       res.status(200).json({response:response});
      }catch(err){
        res.status(500).json({err:"Error encountered"});
        console.log(err);
    
      }
  });
//to update a job
   router.put('/:jobID',jwtAuthMiddleware,async(req,res)=>{
     try{
      if(!await(checkEmployerRole(req.user.id))){
        return res.status(403).json({message:'user dose not have employer role'})  
    }
        const jobID=req.params.jobID;
        const updatedjobData=req.body;
        const response = await job.findByIdAndUpdate(jobID,updatedjobData,{
          new: true, //Return the update document
          runValidators: true,
        });
        if(!response){
          return res.status(404).json({err:"Job not found"});
        }
        res.status(200).json(response);
      
     }catch(err){
      res.status(500).json({err:"Error encountered"});  
     console.log(err);
     }
   });
  
   router.delete('/:jobID',jwtAuthMiddleware,async(req,res)=>{
    try{
      if(!await(checkEmployerRole(req.user.id))){
        return res.status(403).json({message:'User dose not have employer role'})  
    }
       const jobID=req.params.jobID;
      
       const response = await job.findByIdAndDelete(jobID)
       if(!response){
         return res.status(404).json({err:"Job not found"});
       }
       res.status(200).json(response);
     
    }catch(err){
     res.status(500).json({err:"Error encountered"});
    console.log(err);
    }
  });
  
  router.post('/applied/:jobID',jwtAuthMiddleware,async(req,res)=>{
    jobID=req.params.jobID;
    userId=req.user.id;
    try{
     const Job = await job.findById(jobID)
       if(!Job){
         return res.status(404).json({message:'job not found'});
       }
       const User=await user.findById(userId);
       if(!User){
         return res.status(404).json({message:'User not found'});
       }
       //update job document
       Job.applicants.push({user: userId});
       Job.applicantCount++;
       await Job.save();
       res.status(200).json({message:'Your application Recorded successfully'});
 
    }catch(err){
     res.status(500).json({err:"Error encountered"});
    console.log(err);
    }
   });
 
   //Applicant count
   router.get('/applicant/count',async(req,res)=>{
       try{
         //find all Applicant and sort them
         const Job = await job.find().sort({ applicantCount: "desc" });
           //ret there name and vote count
           const applicationRecord= Job.map((data)=>{
             return{
               title:data.title,
               location:data.location,
               Number_Of_Applications:data.applicantCount
             }
           });
           return res.status(200).json(applicationRecord);
       }catch(err){
     res.status(500).json({err:"Error encountered"});
    console.log(err);
    }
   });

 //list of job
 router.get('/info', async (req, res) => {
    try {
      const Job = await job.find().sort({ title: "asc" }); // Sorts alphabetically by company name
  
      // Return all employer data
      return res.status(200).json(Job);
    } catch (err) {
      res.status(500).json({ err: "Error encountered" });
      console.log(err);
    }
  });

 module.exports=router;