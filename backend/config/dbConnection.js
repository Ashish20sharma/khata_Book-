const mongoose=require("mongoose");
const URL=process.env.MONGO_URL;

const dbConnection=()=>{
    try {
        const dbconnect=mongoose.connect(URL);
        console.log("DB connected")
    } catch (error) {
        console.log("Db connection error",error);
    }
}

module.exports=dbConnection;