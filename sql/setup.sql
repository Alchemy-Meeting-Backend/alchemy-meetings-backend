-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE if EXISTS github_users CASCADE;
DROP TABLE if EXISTS cohorts CASCADE;
DROP TABLE if EXISTS zoom_rooms CASCADE;
DROP TABLE if EXISTS cohorts_zoom_rooms CASCADE;

CREATE TABLE cohorts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO cohorts(name)
VALUES
('pending approval'),
('staff'),
('alumni'),
('feb 2022'),
('jan 2022'),
('april 2022'),
('june 2022'),
('july 2022');

CREATE TABLE zoom_rooms (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_type TEXT NOT NULL,
  room_name TEXT NOT NULL,
  join_link TEXT,
  meeting_id BIGINT
);

INSERT INTO zoom_rooms(room_type, room_name, join_link, meeting_id)
VALUES
('metal', 'Cobalt', 'http whatever', 9040374817),
('classroom', 'Goodland', 'http whatever2', 9040374817),
('metal', 'Copper', 'http whatever', 9040374817),
('metal', 'Aluminum', 'http whatever', 9040374817),
('metal', 'Beryllium', 'http whatever', 9040374817),
('metal', 'Brass', 'http whatever', 9040374817),
('metal', 'Bronze', 'http whatever', 9040374817),
('metal', 'Chrome', 'http whatever', 9040374817),
('metal', 'Gold', 'http whatever', 9040374817),
('metal', 'Iron', 'http whatever', 9040374817),
('metal', 'Lithium', 'http whatever', 9040374817),
('metal', 'Mercury', 'http whatever', 9040374817),
('metal', 'Nickel', 'http whatever', 9040374817),
('metal', 'Osmium', 'http whatever', 9040374817),
('metal', 'Oxygen', 'http whatever', 9040374817),
('metal', 'Mythril', 'http whatever', 9040374817),
('metal', 'Silver', 'http whatever', 9040374817),
('metal', 'Titanium', 'http whatever', 9040374817),
('metal', 'Vibranium', 'http whatever', 9040374817),
('metal', 'Xenon', 'http whatever', 9040374817),
('metal', 'Zinc', 'http whatever', 9040374817),
('classroom', 'Atrium', 'http whatever2', 9040374817),
('classroom', 'Danis Room', 'http whatever2', 9040374817),
('classroom', 'Lecture', 'http whatever2', 9040374817),
('other', 'Career Development Room', 'http whatever2', 9040374817),
('other', 'Community Room', 'http whatever2', 9040374817),
('other', 'Open Work Room', 'http whatever2', 9040374817),
('other', 'Quiet Room', 'http whatever2', 9040374817),
('other', 'TA Room', 'http whatever2', 9040374817),
('other', 'TA Room 2', 'http whatever2', 9040374817),
('other', 'Alumni Room', 'http whatever2', 9040374817);


CREATE TABLE github_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  cohort_id BIGINT,
  role TEXT,
  -- github TEXT
  FOREIGN KEY(cohort_id) REFERENCES cohorts(id)
);

INSERT INTO github_users (username, email, cohort_id, role) 
VALUES
('Elliot Darkness', 'elliot@darkness.com', 2, 'TA'),
('Susan Brightness', 'susan@brightness.com', 1, 'Student'),
('Sarah Johnson', 'sarahjohnshon@gmail.com', 3, 'Alumni'),
('Frank Delgado', 'frankdelgado@gmail.com.com', 1, ' Student'),
('Rebecca Charleston', 'rebeccacharleston@gmail.com', 2, 'Instructor'),
('Christine Black', 'christineblack@gmail.com', 3, 'Alumni');

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
(3, 2),
(1, 4),
(2, 4),
(1, 8),
(2, 6),
(2, 7),
(3, 4),
(4, 8),
(5, 5),
(6, 5),
(7, 5),
(8, 7),
(9, 4),
(10, 4),
(11, 4),
(12, 8),
(13, 7),
(14, 7),
(15, 8),
(16, 8),
(17, 6),
(18, 6),
(19, 6),
(20, 6),
(21, 6),
(23, 8),
(24, 4),
(25, 2),
(25, 3),
(25, 4),
(25, 5),
(25, 6),
(25, 7),
(25, 8),
(26, 2),
(26, 3),
(26, 4),
(26, 5),
(26, 6),
(26, 7),
(26, 8),
(27, 2),
(27, 3),
(27, 4),
(27, 5),
(27, 6),
(27, 7),
(27, 8),
(28, 2),
(28, 4),
(28, 5),
(28, 6),
(28, 7),
(28, 8),
(29, 2),
(29, 4),
(29, 5),
(29, 6),
(29, 7),
(29, 8),
(29, 2),
(30, 2),
(30, 4),
(30, 5),
(30, 6),
(30, 7),
(30, 8),
(31, 2),
(31, 3),
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(11, 2),
(12, 2),
(13, 2),
(14, 2),
(15, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 2),
(21, 2),
(22, 2),
(23, 2),
(24, 2),
(25, 2),
(26, 2),
(27, 2),
(28, 2),
(29, 2),
(30, 2),
(31, 2),
(22, 2),
(23, 2),
(24, 2);


