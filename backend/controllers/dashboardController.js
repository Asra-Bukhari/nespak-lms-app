const sql = require("mssql");


exports.getDashboardStats = async (req, res) => {
  try {
    const pool = await sql.connect();

    // Modules accessed this week (Views this week for current user)
    const userId = req.query.userId; 
    const accessedResult = await pool.request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT COUNT(DISTINCT content_id) AS modules_accessed
        FROM Views
        WHERE user_id = @userId
          AND viewed_at >= DATEADD(day, -7, GETDATE())
      `);
    const modulesAccessed = accessedResult.recordset[0].modules_accessed || 0;

    // New uploads this month (all new Content uploaded this month)
    const uploadsResult = await pool.request().query(`
      SELECT COUNT(content_id) AS new_uploads
      FROM Content
      WHERE is_deleted = 0
        AND uploaded_at >= DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)
    `);
    const newUploads = uploadsResult.recordset[0].new_uploads || 0;

    // Completed Modules (Views with progress = 100)
    const completedResult = await pool.request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT COUNT(*) AS completed_modules
        FROM Views
        WHERE user_id = @userId
          AND progress = 100
      `);
    const completedModules = completedResult.recordset[0].completed_modules || 0;

    // Section counts (Trainings, Events, Documents, Files)
    const sectionsResult = await pool.request().query(`
      SELECT s.name AS section_name, COUNT(c.content_id) AS content_count
      FROM Sections s
      LEFT JOIN Content c ON s.section_id = c.section_id AND c.is_deleted = 0
      GROUP BY s.name
    `);

    const sectionStats = {};
    sectionsResult.recordset.forEach(r => {
      switch(r.section_name) {
        case "Trainings & Development": sectionStats.trainings = r.content_count; break;
        case "Nespak Representation": sectionStats.events = r.content_count; break;
        case "Nespak Preferences": sectionStats.documents = r.content_count; break;
        case "Project-Related Documents": sectionStats.files = r.content_count; break;
      }
    });

    res.json({
      ...sectionStats,
      modulesAccessed,
      newUploads,
      completedModules
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getModuleStats = async (req, res) => {
  try {
    const pool = await sql.connect();
    

    const result = await pool.request().query(`
      SELECT s.name AS section_name,
             COUNT(c.content_id) AS content_count,
             SUM(CASE WHEN s.name='Trainings & Development' THEN 1 ELSE 0 END) AS trainings_count,
             SUM(CASE WHEN s.name='Nespak Representation' THEN 1 ELSE 0 END) AS events_count,
             SUM(CASE WHEN s.name='Nespak Preferences' THEN 1 ELSE 0 END) AS documents_count,
             SUM(CASE WHEN s.name='Project-Related Documents' THEN 1 ELSE 0 END) AS files_count
      FROM Sections s
      LEFT JOIN Content c ON s.section_id = c.section_id AND c.is_deleted = 0
      GROUP BY s.name
    `);

    const stats = {};
    result.recordset.forEach(r => {
      switch(r.section_name) {
        case "Trainings & Development":
          stats.trainings = r.content_count;
          break;
        case "Nespak Representation":
          stats.events = r.content_count;
          break;
        case "Nespak Preferences":
          stats.documents = r.content_count;
          break;
        case "Project-Related Documents":
          stats.files = r.content_count;
          break;
      }
    });

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const pool = await sql.connect();

    // Total content (excluding deleted)
    const contentResult = await pool.request()
      .query(`SELECT COUNT(*) AS totalContent FROM Content WHERE is_deleted = 0`);
    const totalContent = contentResult.recordset[0].totalContent || 0;

    // Active users (role != admin)
    const usersResult = await pool.request()
      .query(`SELECT COUNT(*) AS activeUsers FROM Users WHERE role != 'admin'`);
    const activeUsers = usersResult.recordset[0].activeUsers || 0;

    // Pending requests
    const pendingRequestsResult = await pool.request()
      .query(`SELECT COUNT(*) AS pendingRequests FROM Requests WHERE status = 'pending'`);
    const pendingRequests = pendingRequestsResult.recordset[0].pendingRequests || 0;

    // This month uploads
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const uploadsResult = await pool.request()
      .input('monthStart', sql.DateTime, monthStart)
      .query(`SELECT COUNT(*) AS thisMonthUploads FROM Content WHERE uploaded_at >= @monthStart AND is_deleted = 0`);
    const thisMonthUploads = uploadsResult.recordset[0].thisMonthUploads || 0;

    res.json({
      totalContent,
      activeUsers,
      pendingRequests,
      thisMonthUploads
    });

  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};