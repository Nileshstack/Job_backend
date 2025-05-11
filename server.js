let express=require('express');
//let mongoose=require('mongoose');
let app=express();
require('dotenv').config();
const db=require('./db');

const bodyParaser=require('body-parser');
const router = require('./routes/userRoutes');
const employerRoutes = require('./routes/employerRoutes');
const jobRouter = require('./routes/jobRoutes');
app.use(bodyParaser.json());
const PORT=process.env.PORT||3000;


  //use the personRoutes
 app.use('/user',router);
  app.use('/employer',employerRoutes);
  app.use('/job',jobRouter);
  
app.listen(3000,()=>{
    console.log('listen on port 3000');
})