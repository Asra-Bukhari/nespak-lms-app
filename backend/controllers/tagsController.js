const { sql } = require('../config/db');

exports.getAllTags = async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Tags ORDER BY name`;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    await sql.query`INSERT INTO Tags (name) VALUES (${name})`;
    res.status(201).json({ message: 'Tag created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await sql.query`DELETE FROM Tags WHERE tag_id = ${id}`;
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTagsToContent = async (req, res) => {
  try {
    const content_id = parseInt(req.params.id);
    const { tags } = req.body; // array of tag names OR ids
    if (!Array.isArray(tags)) return res.status(400).json({ message: 'Provide tags array' });

    for (const t of tags) {
      if (typeof t === 'number') {
        // tag id
        await sql.query`IF NOT EXISTS (SELECT 1 FROM ContentTags WHERE content_id=${content_id} AND tag_id=${t})
                        INSERT INTO ContentTags (content_id, tag_id) VALUES (${content_id}, ${t})`;
      } else {
        // name: ensure tag exists
        const existing = await sql.query`SELECT tag_id FROM Tags WHERE name = ${t}`;
        let tagId;
        if (existing.recordset.length) tagId = existing.recordset[0].tag_id;
        else {
          const ins = await sql.query`INSERT INTO Tags (name) OUTPUT INSERTED.tag_id VALUES (${t})`;
          tagId = ins.recordset[0].tag_id;
        }
        await sql.query`IF NOT EXISTS (SELECT 1 FROM ContentTags WHERE content_id=${content_id} AND tag_id=${tagId})
                        INSERT INTO ContentTags (content_id, tag_id) VALUES (${content_id}, ${tagId})`;
      }
    }

    res.json({ message: 'Tags added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
