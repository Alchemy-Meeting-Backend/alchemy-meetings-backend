const pool = require('../utils/pool');

module.exports = class Cohort {
  id;
  name;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * from cohorts');
    return rows.map((row) => new Cohort(row));
  }

  static async insert({ name }) {
    const { rows } = await pool.query(
      'INSERT INTO cohorts(name) VALUES ($1) RETURNING *',
      [name]
    );
    return new Cohort(rows[0]);
  }
};
