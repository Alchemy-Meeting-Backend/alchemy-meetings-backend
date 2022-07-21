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
    this.room_name = row.room_name;
  }


  static async getAll(cohort_id) {
    const { rows } = await pool.query(
      `SELECT 
    zoom_rooms.id, zoom_rooms.room_name,
    COALESCE (
      json_agg(to_jsonb(cohorts.name)) 
      FILTER (WHERE cohorts_zoom_rooms.id is not null), '[]'
  ) as cohorts
  FROM zoom_rooms
  LEFT JOIN cohorts_zoom_rooms on zoom_rooms.id = cohorts_zoom_rooms.room_id
  LEFT JOIN cohorts on cohorts.id = cohorts_zoom_rooms.cohort_id
  WHERE cohorts.id = $1
  GROUP BY zoom_rooms.id
`,
      [cohort_id]
    );
    return rows.map((row) => new Zoomroom(row));
  }
};

