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
  const mobileData = await Mobile.find(
    {},
    { _id: 0, __v: 0, company: 1, price: 1, origin: 1 }
  ).catch((err) => {
    return res.status(404).json({ message: err.message });
  });
  return res.status(200).json(mobileData);
});

app
  .route("/mobile/:name")
  .get(async (req, res) => {
    // the information of mobile with name

    const name = req.params.name.split("-").join(" ");
    const mobileData = await Mobile.find({ mobileName: name }, { _id: 0 });
    if (!mobileData.length) {
      return res.status(404).json({ error: `${name} mobile data not found` });
    }

    return res.status(200).json(mobileData[0]);
  })
  .post(async (req, res) => {
    /* only authenticated user can use this method
    adding information of mobile with name */

    if (req.headers.authorization === process.env.AUTH_ID) {
      const name = req.params.name.split("-").join(" ");

      if (!req.body || !req.body.brand || !req.body.price || !req.body.origin) {
        return res.status(204).json({ message: "invalid response" });
      }

      const mobileByName = await Mobile.find({ mobileName: name }, { _id: 0 });
      if (!mobileByName.length) {
        const mobile = new Mobile({
          mobileName: name,
          company: req.body.company,
          price: req.body.price,
          origin: req.body.origin,
        });

        await mobile.save();
        return res.status(200).json({ message: "data added successfully" });
      } else {
        return res.status(200).json({ message: "duplicate data found" });
      }
    }
    return res.status(401).json({ error: "Invalid authorization" });
  })
  .put(async (req, res) => {
    // only authenticated user can use this method
    // updating information of mobile with name

    if (req.headers.authorization === process.env.AUTH_ID) {
      const name = req.params.name.split("-").join(" ");
      if (!req.body) {
        return res.status(204).json({ error: "Invalid response" });
      }
      const mobile = await Mobile.find({ mobileName: name });
      if (!mobile.length) {
        return res.status(404).json({ error: `${name} not found` });
      }
      await Mobile.updateOne(
        { mobileName: name },
        {
          $set: req.body,
        }
      ).catch((err) => {
        console.log(err);
      });
      return res
        .status(200)
        .json({ message: `mobile ${name} is successfully updated` });
    } else {
      return res.status(401).json({ message: "Invalid Authorized" });
    }
  })
  .delete(async (req, res) => {
    // only authenticated user can use this method
    // deleting information of mobile with name
    if (req.headers.authorization === process.env.AUTH_ID) {
      const name = req.params.name.split("-").join(" ");
      const mobile = await Mobile.find({ mobileName: name });
      if (!mobile.length) {
        return res.status(404).json({ error: `${name} not found` });
      }
      await Mobile.deleteOne({ mobileName: name }).catch((err) => {
        console.log(err);
      });
      return res
        .status(200)
        .json({ message: `mobile ${name} data successfully deleted` });
    } else {
      return res.status(401).json({ message: "Invalid Authorized" });
    }
  });

app.use(function (req, res) {
  return res.status(404).json({ error: "Sorry can't find that!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
