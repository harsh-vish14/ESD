const dotenv = require("dotenv");
dotenv.config();
require("./database/connection");
const Mobile = require("./database/models/mobile");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

// this is get request method
app.get("/mobile", async (req, res) => {
  //all mobiles will be display here with name, brand, price, origin
  const mobileData = await Mobile.find({}, { _id: 0 }).catch((err) => {
    res.status(404).json({ message: err.message });
  });
  res.status(200).json(mobileData);
});

app
  .route("/mobile/:name")
  .get(async (req, res) => {
    // the information of mobile with name

    const name = req.params.name.split("-").join(" ");
    const mobileData = await Mobile.find({ mobileName: name }, { _id: 0 });
    res.status(200).json(mobileData);
  })
  .post(async (req, res) => {
    /* only authenticated user can use this method
    adding information of mobile with name */

    if (req.headers.authorization === process.env.AUTH_ID) {
      const name = req.params.name.split("-").join(" ");

      if (!req.body || !req.body.brand || !req.body.price || !req.body.origin) {
        res.status(204).json({ message: "invalid response" });
      }

      const mobileByName = await Mobile.find({ mobileName: name }, { _id: 0 });
      if (!mobileByName.length) {
        const mobile = new Mobile({
          mobileName: name,
          brand: req.body.brand,
          price: req.body.price,
          origin: req.body.origin,
        });
        mobile.save();
        res.status(200).send({ message: "data added successfully" });
      } else {
        res.status(200).send({ message: "duplicate data found" });
      }
    } else {
      res.status(401).json({ error: "Invalid authorization" });
    }
  })
  .put((req, res) => {
    // only authenticated user can use this method
    // updating information of mobile with name
    if (req.headers.authorization === process.env.AUTH_ID) {
      const name = req.params.name.split("-").join(" ");
      let u_mobile = await Mobile.updateOne({mobileName: name},{
        "$set" :{
          "mobileName" : req.body.name,
          "brand" : req.body.brand,
          "price" : req.body.price,
          "origin" : req.body.origin
        }
      });
      u_mobile.save();
      res.send("Name of Mobile updated"+u_mobile);
    }
    else{
      res.status(200).send({message: "NOT Authorized"});
    }
  })
  .delete((req, res) => {
    // only authenticated user can use this method
    // deleting information of mobile with name
    if (req.headers.authorization === process.env.AUTH_ID) {
      const name = req.params.name.split("-").join(" ");
      let d_data = await Mobile.deleteOne({mobileName:name})
      res.send("Mobile "+name+" Record Deleted");
      d_data.save();
    }else{
      res.status(200).send({message: "NOT Authorized"});
    }
  });

app.use(function (req, res, next) {
  res.status(404).json({ error: "Sorry can't find that!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
