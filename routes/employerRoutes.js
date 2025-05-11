let express=require('express');
const router=express.Router();
const { generateToken, jwtAuthMiddleware } = require('../jwt');
const user = require('./../modules/user');
const employer = require('../modules/employer');
const jwt = require('jsonwebtoken');

//to check weather admin or not
const checkAdminRole=async(userId)=>{
     try{
        const users= await user.findById(userId);
        return users.role === 'admin'; 
     }catch(err){
        return false;
     }
}
//to add a employer
router.post('/signup',jwtAuthMiddleware,async(req, res)=>{
    try{
        if(!await(checkAdminRole(req.user.id))){
            return res.status(403).json({message:'user dose not have admin role'})  
        }
        const data = req.body
        const newUser=new employer(data)
       const response = await newUser.save()
       console.log("Data Saved");
  
       const payload={
          id:response.id
       }
       console.log(JSON.stringify(payload));
       const token = generateToken(payload);
       console.log("The Token is:",token);
        
       //saving token in the backend file
       response.token = token;
       await response.save();
  
       res.status(200).json({response:response, token:token});
      }catch(err){
        res.status(500).json({err:"Error obtained"});
        console.log(err);
    
      }
  });
  router.post('/login', async (req, res) => {
      try {
          const { email, password } = req.body;
  
          // Find employer by email
          const Employer = await employer.findOne({ email });
  
          if (!Employer) {
              return res.status(404).json({ error: "Employer not found" });
          }
  
          // Validate password
          const isMatch = await Employer.comparePassword(password);
          if (!isMatch) {
              return res.status(401).json({ error: "Invalid Password" });
          }
  
          // Generate JWT token
          const payload = { id: Employer._id };
          const token = jwt.sign(payload, "your_secret_key", { expiresIn: "2h" });
  
          res.json({ token });
  
      } catch (err) {
          console.error("Login Error:", err);
          res.status(500).json({ error: "Server Error" });
      }
  });
  module.exports = router;
//to update a employer
   router.put('/:employerID',jwtAuthMiddleware,async(req,res)=>{
     try{
      if(!await(checkAdminRole(req.user.id))){
        return res.status(403).json({message:'user dose not have admin role'})  
    }
        const employerID=req.params.employerID;
        const updatedEmployerData=req.body;
        const response = await employer.findByIdAndUpdate(employerID,updatedEmployerData,{
          new: true, //Return the update document
          runValidators: true,
        });
        if(!response){
          return res.status(404).json({err:"Candidate not found"});
        }
        res.status(200).json(response);
      
     }catch(err){
      res.status(500).json({err:"Error obtained"});  
     console.log(err);
     }
   });
  
   router.delete('/:employerID',jwtAuthMiddleware,async(req,res)=>{
    try{
      if(!await(checkAdminRole(req.user.id))){
        return res.status(403).json({message:'user dose not have admin role'})  
    }
       const employerID=req.params.employerID;
      
       const response = await employer.findByIdAndDelete(employerID)
       if(!response){
         return res.status(404).json({err:"Candidate not found"});
       }
       res.status(200).json(response);
     
    }catch(err){
     res.status(500).json({err:"Error obtained"});
    console.log(err);
    }
  });

 //list of candidates
 router.get('/info', async (req, res) => {
    try {
      const Employer = await employer.find().sort({ companyName: "asc" }); // Sorts alphabetically by company name
  
      // Return all employer data
      return res.status(200).json(Employer);
    } catch (err) {
      res.status(500).json({ err: "Error obtained" });
      console.log(err);
    }
  });

 module.exports=router;