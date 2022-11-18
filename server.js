const app = require("./app");
const mongoose = require("mongoose");

require("dotenv").config();

const uriDb = process.env.MONGO_DB;
mongoose.Promise = global.Promise;

mongoose
  .connect(uriDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful");
    });
  })
  .catch((err) =>
    console
      .log(`Server not running. Error message: ${err.message}`)
      .process.exit(1)
  );
