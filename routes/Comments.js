const express = require("express");
const router = express.Router();

const { Comments } = require("../models");

const {validateToken} = require("../middlewares/AuthMiddleware")


router.get("/byId/:postId", async (req, res) => {
  const postId = req.params.postId;
  console.log(postId);

  const comments = await Comments.findAll({
    where: {
      postId: postId,
    },
  });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
    const comment = req.body;
    console.log(req.user)
    const userName = req.user.userName;
    
    console.log(comment)
    comment.userName = userName;
    await Comments.create(comment);
    res.json(comment);
  });


  router.delete("/:commentId", validateToken, async(req, res) => {
    const commentId = req.params.commentId;

    await Comments.destroy({
      where:{
        id: commentId
      }
    })

    res.json({message: "Post deleted succesfully"})

  })

module.exports = router;
