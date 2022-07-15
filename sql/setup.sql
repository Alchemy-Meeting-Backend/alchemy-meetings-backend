-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE if EXISTS github_users CASCADE;
DROP TABLE if EXISTS cohorts;

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


CREATE TABLE cohorts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO cohorts(name)
VALUES
('feb 2022'),
('jan 2022');

CREATE TABLE zoom_rooms (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_type TEXT NOT NULL,
  room_name TEXT NOT NULL,
  join_link TEXT
);

INSERT INTO zoom_rooms(room_type, room_name, join_link)
VALUES
('metal', 'Cobalt', 'http whatever'),
('classroom', 'Goodland', 'http whatever2');