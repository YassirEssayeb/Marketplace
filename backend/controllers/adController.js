const pool = require('../config/db');

exports.getAds = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, location, search, sort, page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['a.status = ?'];
    let params = ['active'];
    if (category) { where.push('a.category_id = ?'); params.push(category); }
    if (minPrice) { where.push('a.price >= ?'); params.push(minPrice); }
    if (maxPrice) { where.push('a.price <= ?'); params.push(maxPrice); }
    if (location) { where.push('a.location LIKE ?'); params.push(`%${location}%`); }
    if (search) { where.push('(a.title LIKE ? OR a.description LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    const whereClause = where.join(' AND ');
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM ads a WHERE ${whereClause}`, params);
    let orderBy = 'a.created_at DESC';
    if (sort === 'date_asc') orderBy = 'a.created_at ASC';
    else if (sort === 'price_asc') orderBy = 'a.price ASC';
    else if (sort === 'price_desc') orderBy = 'a.price DESC';
    const [rows] = await pool.query(
      `SELECT a.*, u.name as user_name, u.city as user_city, c.name as category_name
       FROM ads a JOIN users u ON a.user_id = u.id LEFT JOIN categories c ON a.category_id = c.id
       WHERE ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    res.json({
      ads: rows.map(r => ({ ...r, images: r.images ? JSON.parse(r.images) : [] })),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getAd = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT a.*, u.name as user_name, u.city as user_city, u.phone as user_phone, c.name as category_name FROM ads a JOIN users u ON a.user_id = u.id LEFT JOIN categories c ON a.category_id = c.id WHERE a.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Annonce introuvable' });
    const ad = { ...rows[0], images: rows[0].images ? JSON.parse(rows[0].images) : [] };
    res.json(ad);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createAd = async (req, res) => {
  try {
    const { title, description, price, category_id, location, images } = req.body;
    if (!title) return res.status(400).json({ error: 'Le titre est requis' });
    const [result] = await pool.query(
      'INSERT INTO ads (user_id, title, description, price, category_id, location, images) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description || null, price || null, category_id || null, location || null, images ? JSON.stringify(images) : null]
    );
    const [ad] = await pool.query('SELECT * FROM ads WHERE id = ?', [result.insertId]);
    res.status(201).json({ ...ad[0], images: ad[0].images ? JSON.parse(ad[0].images) : [] });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const [ads] = await pool.query('SELECT * FROM ads WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (ads.length === 0) return res.status(404).json({ error: 'Annonce introuvable ou non autorisée' });
    const { title, description, price, category_id, location, images, status } = req.body;
    await pool.query(
      'UPDATE ads SET title = ?, description = ?, price = ?, category_id = ?, location = ?, images = ?, status = ? WHERE id = ?',
      [
        title || ads[0].title,
        description !== undefined ? description : ads[0].description,
        price !== undefined ? price : ads[0].price,
        category_id !== undefined ? category_id : ads[0].category_id,
        location !== undefined ? location : ads[0].location,
        images !== undefined ? JSON.stringify(images) : ads[0].images,
        status || ads[0].status,
        req.params.id
      ]
    );
    const [updated] = await pool.query('SELECT * FROM ads WHERE id = ?', [req.params.id]);
    res.json({ ...updated[0], images: updated[0].images ? JSON.parse(updated[0].images) : [] });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM ads WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Annonce introuvable ou non autorisée' });
    res.json({ message: 'Annonce supprimée' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getMyAds = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT a.*, c.name as category_name FROM ads a LEFT JOIN categories c ON a.category_id = c.id WHERE a.user_id = ? ORDER BY a.created_at DESC',
      [req.user.id]
    );
    res.json(rows.map(r => ({ ...r, images: r.images ? JSON.parse(r.images) : [] })));
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.reportAd = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: 'Motif requis' });
    await pool.query('INSERT INTO reports (ad_id, reporter_id, reason) VALUES (?, ?, ?)', [req.params.id, req.user.id, reason]);
    res.status(201).json({ message: 'Annonce signalée' });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
