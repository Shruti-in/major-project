const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("connected to DB sucessfully");
})
.catch(err=>console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    
}

const initDB = async () => {
  try {
    await listing.deleteMany({});
    //const ownerId = new mongoose.Types.ObjectId('6875dfe8c6e230b4a709f0f8'); // ✅ Real ObjectId

    initData.data = initData.data.map((obj) => ({...obj, owner:'6875dfe8c6e230b4a709f0f8'}));
    await listing.insertMany(initData.data);
    console.log("Data is initialized");
  } catch (err) {
    console.error("Initialization failed:", err);
  }
};

initDB();