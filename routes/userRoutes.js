let express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const { generateToken, jwtAuthMiddleware } = require('../jwt');
const user = require('../modules/user');

router.post('/signup',async(req, res)=>{
    try{
      const data = req.body
      const newUser=new user(data)
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
        const { panCardNumber, password } = req.body;

        // Find user by PAN Card Number
        const User = await user.findOne({ panCardNumber });

        // Validate user existence & correct password comparison
        if (!User || !(await User.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid PAN Card or Password" });
        }

        // Generate and return token
        const payload = { id: User.id };
        const token = generateToken(payload);
        res.json({ token });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
       // console.log("User data:", req.user); 

        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const userProfile = await user.findById(userId);
        if (!userProfile) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ userProfile });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Error obtained" });
    }
});



router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const { currentPassword, newPassword } = req.body;

        const User = await user.findById(userId);
        if (!User) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if current password is correct
        const isMatch = await User.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid current password" });
        }

        // Hash new password before saving
        const salt = await bcrypt.genSalt(10);
        User.password = await bcrypt.hash(newPassword, salt);
        await User.save();

        console.log("Password updated");
        res.status(200).json({ message: "Password updated successfully" });

    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Error obtained" });
    }
});

 module.exports=router;