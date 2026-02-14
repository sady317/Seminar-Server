const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//MONGO DB

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djciamc.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const seminarCollection = client.db("SeminarUserDB").collection("Users");
    await client.connect();

    // CREATE
    app.post("/seminar", async (req, res) => {
      const data = req?.body;
      const result = await seminarCollection.insertOne(data);
      res.json({
        success: true,
        msg: "Successfully Submited",
        result: result,
      });
    });
    // READ
    app.get("/seminar", async (req, res) => {
      const result = await seminarCollection.find().toArray();
      res.send(result);
    });


    // Delete using body!
    // app.delete("/delete",async(req,res)=>{
    //   const id =req.body.id
    //   const result=await seminarCollection.deleteOne()({_id:new ObjectId(id)})
    //   res.send(result)
    // }) 


    // Delete using params!
    app.delete("/delete/:id",async(req,res)=>{
      const id=req.params.id
      const result=await seminarCollection.deleteOne({_id:new ObjectId(id)})
      res.send(result)
    })


 


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
