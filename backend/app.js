require("dotenv").config();
const express =require("express");
const dbConnection = require("./config/dbConnection");
const app=express();
const port=process.env.PORT;
const userRoute=require("./routes/userRoutes")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/v1/users",userRoute);

app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
    dbConnection();
});




