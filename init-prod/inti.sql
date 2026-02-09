CREATE TABLE IF NOT EXISTS mail (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    body TEXT NOT NULL
);



/*INSERT INTO mail (subject, body)
VALUES ('Alice', 'Hello.')
ON CONFLICT DO NOTHING;*/
