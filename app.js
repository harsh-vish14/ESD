const dotenv = require("dotenv");
dotenv.config();

require("./database/connection");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 8000;
app.use(express.json());

// this is get request method
app.post("/mobile", async (req, res) => {
  //all mobiles will be display here with name, brand, price, origin
});

app
  .route("/mobile/:name")
  .get((req, res) => {
    // the information of mobile with name
  })
  .post(async (req, res) => {
    // only authenticated user can use this method
    // adding information of mobile with name
  })
  .put((req, res) => {
    // only authenticated user can use this method
    // updating information of mobile with name
  })
  .delete((req, res) => {
    // only authenticated user can use this method
    // deleting information of mobile with name
  });

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
