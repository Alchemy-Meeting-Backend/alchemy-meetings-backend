-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE if EXISTS github_users CASCADE;

CREATE TABLE github_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  cohort_id INT,
  role TEXT DEFAULT('pending')
  -- github TEXT
);

INSERT INTO github_users (username, email, cohort_id, role) 
VALUES
('Elliot Darkness', 'elliot@darkness.com', 1, 'TA');
