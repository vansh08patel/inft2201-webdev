CREATE TABLE IF NOT EXISTS demo_ping(
    id SERIAL PRIMARY KEY,
    MESSAGE text not null
);

INSERT INTO demo_ping (MESSAGE)value ('Postgres is up!');