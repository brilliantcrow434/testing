const express = require("express");
const bcrypt = require("bcrypt");
const { jwt, sign } = require("jsonwebtoken");
const router = express.Router();

const { Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", async (req, res) => {
  const { userName, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  await Users.create({
    userName: userName,
    password: hash,
  });

  res.json("Success");
});

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  const user = await Users.findOne({ where: { userName: userName } });

  if (!user) {
    res.json("User doesn't exist");
    return;
  }

  try {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res
        .status(400)
        .json({ error: "Wrong userName and Password combination" });
      return;
    }

    const accessToken = sign(
      {
        userName: user.userName,
        id: user.id,
      },
      "secret"
    );

    res.json(accessToken);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//instead of checking localstorage

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user)
})


router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

router.put("/changePassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { userName: req.user.userName } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { userName: req.user.userName } }
      );
      res.json("SUCCESS");
    });
  });
});


module.exports = router;
