const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  email;
  cohort_id;
  role;
  
  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.cohort_id = row.cohort_id;
    this.role = row.role;
  }

  static async insert({ username, email, cohort_id, role }) {
    if(!username) throw new Error('Get ye a username!!!');

    const { rows } = await pool.query(
      `
        INSERT INTO github_users (username, email, cohort_id, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *

        `,
      [username, email, cohort_id, role]
    );

    return new GithubUser(rows[0]);
  }
};
