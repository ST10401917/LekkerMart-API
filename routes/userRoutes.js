const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/profile",
    authenticateToken,
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            user: {
                id: req.user.userId,
                role: req.user.role
            }
        });
    }
);

module.exports = router;