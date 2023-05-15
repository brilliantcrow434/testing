const express = require('express');
const db = require('./models');
const cors = require("cors")

const app = express();

app.use(express.json())

app.use(cors())
// Routers

const postRouter = require("./routes/Post")

const commentRouter = require("./routes/Comments")

const userRouter = require("./routes/User")


app.use("/api/v1/post", postRouter)
app.use("/api/v1/comment", commentRouter)

app.use("/api/v1/auth", userRouter)

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  });


