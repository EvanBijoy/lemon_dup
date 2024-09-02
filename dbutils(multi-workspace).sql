CREATE DATABASE IF NOT EXISTS lemon;

USE lemon;

CREATE TABLE IF NOT EXISTS lemon_users (
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS lemon_user_workspace (
    mail VARCHAR(255) NOT NULL,
    workspace INT,
    images JSON,
    audios JSON
);

CREATE TABLE IF NOT EXISTS lemon_user_data (
    mail VARCHAR(255) NOT NULL,
    filetype VARCHAR(6) NOT NULL,
    filename VARCHAR(4096) NOT NULL,
    dimensions VARCHAR(255),
    extension VARCHAR(10),
    filesize INT,
    workspace INT
);
CREATE TABLE IF NOT EXISTS lemon_admins (
    password VARCHAR(255) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL
);
