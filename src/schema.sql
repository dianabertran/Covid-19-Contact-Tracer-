CREATE TABLE users(
  id INTEGER AUTOMATIC_INCREMENTATION,
  first_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  username TEXT NOT NULL,
  pw TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE visited_locations(
  id INTEGER AUTOMATIC_INCREMENTATION,
  username TEXT NOT NULL,
  visited_on TIMESTAMP NOT NULL,
  duration INT NOT NULL,
  location_x INT NOT NULL,
  location_y INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE infection_reports(
  id INTEGER AUTOMATIC_INCREMENTATION,
  username TEXT NOT NULL,
  infected_on TIMESTAMP NOT NULL,
  PRIMARY KEY (id)
);