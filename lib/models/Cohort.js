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
};
