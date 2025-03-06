import db from "../config/db.js";

// GET Data for a given table
export const getComponentData = async (req, res, tableName) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM ${tableName}`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

