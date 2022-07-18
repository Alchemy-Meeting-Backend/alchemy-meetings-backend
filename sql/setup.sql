-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE if EXISTS github_users CASCADE;
DROP TABLE if EXISTS cohorts CASCADE;
DROP TABLE if EXISTS zoom_rooms CASCADE;
DROP TABLE if EXISTS cohorts_zoom_rooms CASCADE;

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
('pending approval'),
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
('classroom', 'Goodland', 'http whatever2'),
('metal', 'Copper', 'httpsss');

CREATE TABLE cohorts_zoom_rooms (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id BIGINT,
  cohort_id BIGINT,
  FOREIGN KEY(room_id) REFERENCES zoom_rooms(id),
  FOREIGN KEY(cohort_id) REFERENCES cohorts(id)
);

INSERT INTO cohorts_zoom_rooms(room_id, cohort_id)
VALUES
(1, 2),
(2, 2),
(3, 2);