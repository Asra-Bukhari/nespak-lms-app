const { sql } = require('../config/db');
const validator = require('validator');

// Helper: simple YouTube URL check
function isValidYouTube(url) {
  if (!url) return false;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.*/i.test(url);
}

exports.createContent = async (req, res) => {
  try {
    // admin only via middleware
    const { title, description, speaker_name, video_url, section_id } = req.body;
    const slideFile = req.file; // multer
    if (!title || !video_url || !section_id) return res.status(400).json({ message: 'Missing fields' });
    if (!isValidYouTube(video_url)) return res.status(400).json({ message: 'Invalid YouTube URL' });

    const slide_url = slideFile ? `${process.env.BASE_URL}/${process.env.UPLOADS_DIR || 'uploads'}/${slideFile.filename}` : null;

    await sql.query`
      INSERT INTO Content (title, description, speaker_name, video_url, slide_url, section_id, uploaded_by)
      VALUES (${title}, ${description || null}, ${speaker_name || null}, ${video_url}, ${slide_url}, ${section_id}, ${req.user.user_id})
    `;

    res.status(201).json({ message: 'Content created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllContent = async (req, res) => {
  try {
    // optional filters: section, tag, speaker, title
    const { section, tag, speaker, title } = req.query;

    // base query with joins for tags
    let q = `
      SELECT c.*, s.name AS section_name,
        STUFF((SELECT ',' + t.name FROM ContentTags ct
               JOIN Tags t ON ct.tag_id = t.tag_id
               WHERE ct.content_id = c.content_id
               FOR XML PATH('')),1,1,'') AS tags
      FROM Content c
      JOIN Sections s ON c.section_id = s.section_id
      WHERE c.is_deleted IS NULL OR c.is_deleted = 0
    `;

    // add simple filters (avoid SQL injection by using Request/input)
    const request = new sql.Request();
    if (section) { q += ' AND c.section_id = @section'; request.input('section', sql.Int, section); }
    if (speaker) { q += ' AND c.speaker_name LIKE @speaker'; request.input('speaker', sql.NVarChar, `%${speaker}%`); }
    if (title) { q += ' AND c.title LIKE @title'; request.input('title', sql.NVarChar, `%${title}%`); }
    // tag filtering is a bit more complex: join via ContentTags
    if (tag) {
      q += ` AND EXISTS (SELECT 1 FROM ContentTags ct JOIN Tags t ON ct.tag_id=t.tag_id WHERE ct.content_id=c.content_id AND t.name=@tag)`;
      request.input('tag', sql.NVarChar, tag);
    }

    const result = await request.query(q);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getContentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await sql.query`
      SELECT c.*, s.name AS section_name
      FROM Content c JOIN Sections s ON c.section_id = s.section_id
      WHERE c.content_id = ${id}
    `;
    if (!result.recordset.length) return res.status(404).json({ message: 'Not found' });
    const content = result.recordset[0];

    // get tags
    const tags = await sql.query`
      SELECT t.name FROM ContentTags ct JOIN Tags t ON ct.tag_id = t.tag_id WHERE ct.content_id = ${id}
    `;
    content.tags = tags.recordset.map(r => r.name);
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, speaker_name, video_url, section_id } = req.body;
    // allow updating fields if provided
    await sql.query`
      UPDATE Content SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        speaker_name = COALESCE(${speaker_name}, speaker_name),
        video_url = COALESCE(${video_url}, video_url),
        section_id = COALESCE(${section_id}, section_id)
      WHERE content_id = ${id}
    `;
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // soft delete
    await sql.query`UPDATE Content SET is_deleted = 1 WHERE content_id = ${id}`;
    res.json({ message: 'Deleted (soft)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
