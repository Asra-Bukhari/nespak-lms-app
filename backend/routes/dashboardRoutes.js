const express = require("express");
const router = express.Router();
const { getModuleStats,getDashboardStats, getAdminDashboardStats  } = require("../controllers/dashboardController");

router.get("/stats", getDashboardStats);
router.get("/module-stats", getModuleStats);
router.get('/adminOnly-stats', getAdminDashboardStats);

module.exports = router;
