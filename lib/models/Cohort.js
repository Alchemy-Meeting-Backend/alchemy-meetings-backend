const pool = require('../utils/pool');

module.exports = class Cohort {
  id;
  name;
  rooms;
  

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.rooms = row.rooms ?? [];
  }

  static async getAll() {
    const { rows } = await pool.query(`SELECT 
    cohorts.name,  
    COALESCE (
      json_agg(to_jsonb(zoom_rooms.room_name)) 
      FILTER (WHERE cohorts_zoom_rooms.id is not null), '[]'
  ) as rooms
  FROM cohorts
  LEFT JOIN cohorts_zoom_rooms on cohorts.id = cohorts_zoom_rooms.cohort_id
  LEFT JOIN zoom_rooms on zoom_rooms.id = cohorts_zoom_rooms.room_id
  GROUP BY cohorts.id
  
`);
    return rows.map((row) => new Cohort(row));
  }

  static async insert({ name }) {
    const { rows } = await pool.query(
      'INSERT INTO cohorts(name) VALUES ($1) RETURNING *',
      [name]
    );
    return new Cohort(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * from cohorts WHERE id= $1', [
      id,
    ]);
    return new Cohort(rows[0]);
  }

  // static async getZooms() {
  //   const { rows } = await pool.query(
  //     `SELECT 
  //     cohorts.*, 
  //     COALESCE (
  //       json_agg(to_jsonb(cohorts_zoom_rooms)) 
  //       FILTER (WHERE cohorts_zoom_rooms.id is not null), '[]'
  //   ) as cohorts_zoom_rooms 
  //   FROM cohorts
  //   LEFT JOIN cohorts_zoom_rooms on cohorts.id = cohorts_zoom_rooms.cohort_id
  //   GROUP BY cohorts.id`);
  //   return rows.map((row) => new Cohort(row));
  // }


  static async updateById(id, attrs) {
    const cohorts = await Cohort.getById(id);
    if (!cohorts) return null;
    const { name } = { ...cohorts, ...attrs };
    const { rows } = await pool.query(
      'UPDATE cohorts SET name = ($2) WHERE id =($1) RETURNING *',
      [id, name]
    );
    return new Cohort(rows[0]);
  }
};
