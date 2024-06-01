const router = require("express").Router();
const {
  registerUser,
  getUserByFields,
  updateUser,
  deleteUser,
  registerUserWithOauth,
  createUserSubscription,
  cancelUserSubscription,
} = require("../controllers/user.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.post("/user", registerUser);
router.post("/oauth/:provider", registerUserWithOauth);
router.get("/user", getUserByFields);
router.put("/user/:id", authMiddleware, updateUser);
router.post("/userSubscription", createUserSubscription);
router.post("/cancelUserSubscription", cancelUserSubscription);
router.delete("/user/:id", authMiddleware, deleteUser);

module.exports = router;
