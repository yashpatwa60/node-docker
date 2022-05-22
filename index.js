const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

//   ---- redis part -----
const session = require("express-session");
const redis = require("redis");

let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRoutter = require("./routes/postRoutes.js");
const userRoutter = require("./routes/userRoutes");

const oldURL = "mongodb://yash:yash@mongo:27017/?authSource=admin";
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
const newMongo = "mongodb://yash:yash@host:27017/?authSource=admin";

//resolving error connecting with mongoDB
const connectWithRetry = () => {
  mongoose
    .connect(oldURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log("successfully connected to DB"))
    .catch((e) => {
      console.log(e);
      // setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

//Middlewares
app.enable("trust proxy");

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 60000,
    },
  })
);

app.use(express.json());
app.use(cors());

app.get("/api/v1", (req, res) => {
  console.log("yeah it ran")
  res.send("<h2>Hi There yash patwa</h2>");
});

//localhost:3000/api/v1/posts  <-- usually
//localhost:3000/posts
app.use("/api/v1/posts", postRoutter);
app.use("/api/v1/users", userRoutter);

const port = process.env.Port || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
