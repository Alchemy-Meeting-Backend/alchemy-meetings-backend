const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  email;
  cohort_id;
  role;
  //random comment
  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.cohort_id = row.cohort_id;
    this.role = row.role;
  }

  static async insert({ username, email }) {
    if (!username) throw new Error('Get ye a username!!!');

    const { rows } = await pool.query(
      `
        INSERT INTO github_users (username, email)
        VALUES ($1, $2)
        RETURNING *

        `,
      [username, email]
    );

    return new GithubUser(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM github_users
        WHERE username = $1
        `,
      [username]
    );

    if (!rows[0]) return null;

    return new GithubUser(rows[0]);
  }

  toJSON() {
    return { ...this };
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM github_users;');
    return rows.map((row) => new GithubUser(row));
  }

  static async getUsersByCohortId(cohort_id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM github_users
      WHERE cohort_id = $1
      `,
      [cohort_id]
    );
    return rows.map((row) => new GithubUser(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM github_users
        WHERE id = $1
        `,
      [id]
    );
    return new GithubUser(rows[0]);
  }

  static async update(id, { cohort_id, role }) {
    const { rows } = await pool.query(
      `
        UPDATE github_users
        SET cohort_id = $1, role = $2
        WHERE id = $3
        RETURNING *
        `,
      [cohort_id, role, id]
    );
    return new GithubUser(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
        DELETE FROM github_users
        WHERE id = $1
        RETURNING *
        `,
      [id]
    );
    return new GithubUser(rows[0]);
  }
};
