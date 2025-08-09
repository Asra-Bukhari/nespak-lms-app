const { sql } = require('../config/db');

exports.search = async (req, res) => {
  try {
    const { title, tag, section, speaker } = req.query;
    let q = `
      SELECT DISTINCT c.content_id, c.title, c.speaker_name, c.video_url, c.slide_url, s.name AS section
      FROM Content c
      JOIN Sections s ON s.section_id = c.section_id
      LEFT JOIN ContentTags ct ON ct.content_id = c.content_id
      LEFT JOIN Tags t ON t.tag_id = ct.tag_id
      WHERE (c.is_deleted IS NULL OR c.is_deleted = 0)
    `;
    const request = new sql.Request();
    if (title) { q += ' AND c.title LIKE @title'; request.input('title', sql.NVarChar, `%${title}%`); }
    if (speaker) { q += ' AND c.speaker_name LIKE @speaker'; request.input('speaker', sql.NVarChar, `%${speaker}%`); }
    if (section) { q += ' AND c.section_id = @section'; request.input('section', sql.Int, section); }
    if (tag) { q += ' AND t.name = @tag'; request.input('tag', sql.NVarChar, tag); }
    const result = await request.query(q);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
