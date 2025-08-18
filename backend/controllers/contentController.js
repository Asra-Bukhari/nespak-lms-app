const sql = require("mssql");

// helper: extract YouTube thumbnail
const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
};

// convert any YouTube link to embed link
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};


// Get all content for a section (overview page)
exports.getContentBySection = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input("sectionId", sql.Int, sectionId)
      .query(`
        SELECT 
          c.content_id,
          c.title,
          c.description,
          c.speaker_name,
          c.video_url,
          c.level,
          c.uploaded_at,
          u.name AS uploaded_by,
          STRING_AGG(t.name, ', ') AS tags
        FROM Content c
        JOIN Users u ON c.uploaded_by = u.user_id
        LEFT JOIN ContentTags ct ON c.content_id = ct.content_id
        LEFT JOIN Tags t ON ct.tag_id = t.tag_id
        WHERE c.section_id = @sectionId AND c.is_deleted = 0
        GROUP BY c.content_id, c.title, c.description, c.speaker_name, 
                 c.video_url, c.level, c.uploaded_at, u.name
        ORDER BY c.uploaded_at DESC
      `);

    const data = result.recordset.map(item => {
      return {
        content_id: item.content_id,
        title: item.title,
        speaker_name: item.speaker_name,
        level: item.level,
        uploaded_at: item.uploaded_at,
        tags: item.tags ? item.tags.split(", ") : [],
        thumbnail: getYouTubeThumbnail(item.video_url),
        short_description: item.description 
          ? item.description.split(".")[0] + "." 
          : "",
      };
    });

    res.json({ content: data });

  } catch (err) {
    console.error("Error fetching content by section:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single content details (details page)
exports.getContentById = async (req, res) => {
  const { contentId } = req.params;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input("contentId", sql.Int, contentId)
      .query(`
        SELECT 
          c.content_id,
          c.title,
          c.description,
          c.speaker_name,
          c.video_url,
          c.slide_url,
          c.level,
          c.uploaded_at,
          u.name AS uploaded_by,
          s.name AS section_name,
          STRING_AGG(t.name, ', ') AS tags
        FROM Content c
        JOIN Users u ON c.uploaded_by = u.user_id
        JOIN Sections s ON c.section_id = s.section_id
        LEFT JOIN ContentTags ct ON c.content_id = ct.content_id
        LEFT JOIN Tags t ON ct.tag_id = t.tag_id
        WHERE c.content_id = @contentId AND c.is_deleted = 0
        GROUP BY c.content_id, c.title, c.description, c.speaker_name, 
                 c.video_url, c.slide_url, c.level, c.uploaded_at, 
                 u.name, s.name
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Content not found" });
    }

    const item = result.recordset[0];

    res.json({
      content_id: item.content_id,
      title: item.title,
      description: item.description,
      speaker_name: item.speaker_name,
      video_url: getYouTubeEmbedUrl(item.video_url), 
      slide_url: item.slide_url,
      level: item.level,
      uploaded_by: item.uploaded_by,
      section_name: item.section_name,
      uploaded_at: item.uploaded_at,
      tags: item.tags ? item.tags.split(", ") : [],
      thumbnail: getYouTubeThumbnail(item.video_url),
    });
  } catch (err) {
    console.error("Error fetching content details:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Helper: get or create tags
const getOrCreateTags = async (tags, pool) => {
  const tagIds = [];

  for (const tag of tags) {
    const existingTag = await pool
      .request()
      .input("name", sql.VarChar(50), tag)
      .query("SELECT tag_id FROM Tags WHERE name = @name");

    if (existingTag.recordset.length > 0) {
      tagIds.push(existingTag.recordset[0].tag_id);
    } else {
      const inserted = await pool
        .request()
        .input("name", sql.VarChar(50), tag)
        .query("INSERT INTO Tags (name) OUTPUT INSERTED.tag_id VALUES (@name)");
      tagIds.push(inserted.recordset[0].tag_id);
    }
  }

  return tagIds;
};

// Upload new content
exports.uploadContent = async (req, res) => {
  const {
    title,
    description,
    speaker_name,
    video_url,
    slide_url,
    section_id,
    level,
    tags,
    uploaded_by,
  } = req.body;

  if (!title || !section_id || !uploaded_by) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const pool = await sql.connect();

    // Insert into Content table
    const result = await pool
      .request()
      .input("title", sql.VarChar(200), title)
      .input("description", sql.VarChar(sql.MAX), description || null)
      .input("speaker_name", sql.VarChar(100), speaker_name || null)
      .input("video_url", sql.VarChar(sql.MAX), video_url || null)
      .input("slide_url", sql.VarChar(sql.MAX), slide_url || null)
      .input("section_id", sql.Int, section_id)
      .input("level", sql.VarChar(20), level || "beginner")
      .input("uploaded_by", sql.Int, uploaded_by)
      .query(
        `INSERT INTO Content (title, description, speaker_name, video_url, slide_url, section_id, level, uploaded_by)
         OUTPUT INSERTED.content_id
         VALUES (@title, @description, @speaker_name, @video_url, @slide_url, @section_id, @level, @uploaded_by)`
      );

    const contentId = result.recordset[0].content_id;

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagIds = await getOrCreateTags(tags, pool);

      for (const tagId of tagIds) {
        await pool
          .request()
          .input("content_id", sql.Int, contentId)
          .input("tag_id", sql.Int, tagId)
          .query(
            "INSERT INTO ContentTags (content_id, tag_id) VALUES (@content_id, @tag_id)"
          );
      }
    }

    res.json({ message: "Content uploaded successfully", contentId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
