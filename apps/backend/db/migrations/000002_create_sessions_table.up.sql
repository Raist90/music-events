CREATE TABLE sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id uuid REFERENCES users (id),
    token varchar(255) UNIQUE NOT NULL,
    expires_at timestamptz NOT NULL
);

