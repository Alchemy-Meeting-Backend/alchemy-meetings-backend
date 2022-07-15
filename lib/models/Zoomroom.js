const pool = require('../utils/pool');

module.exports = class Zoomroom {
  id;
  room_type;
  room_name;
  join_link;

  constructor(row) {
    this.id = row.id;
    this.room_type = row.room_type;
    this.join_link = row.join_link;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * from zoom_rooms');
    return rows.map((row) => new Zoomroom(row));
  }
};
