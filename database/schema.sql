IF NOT EXISTS (
    SELECT name 
    FROM sys.databases 
    WHERE name = N'NespakLMS'
)
BEGIN
    CREATE DATABASE NespakLMS;
END
Go

use NespakLMS

Go

CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'viewer')) NOT NULL,
    is_verified BIT DEFAULT 0, -- 0 = not verified, 1 = verified
    created_at DATETIME DEFAULT GETDATE()
);

Go


CREATE TABLE PendingVerifications (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    code VARCHAR(10),
    created_at DATETIME DEFAULT GETDATE()
);

Go

CREATE TABLE Sections (
    section_id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL UNIQUE
);

-- initial 4 sections
INSERT INTO Sections (name) VALUES
('Trainings & Development'),
('Nespak Representation'),
('Nespak Preferences'),
('Project-Related Documents');

CREATE TABLE Content (
    content_id INT PRIMARY KEY IDENTITY(1,1),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(MAX),
    speaker_name VARCHAR(100),
    video_url VARCHAR(MAX),
    slide_url VARCHAR(MAX),
    section_id INT NOT NULL,
	level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    uploaded_by INT NOT NULL,
    uploaded_at DATETIME DEFAULT GETDATE(),
	is_deleted BIT DEFAULT 0,
    FOREIGN KEY (section_id) REFERENCES Sections(section_id),
    FOREIGN KEY (uploaded_by) REFERENCES Users(user_id)
);



CREATE TABLE Tags (
    tag_id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE ContentTags (
    content_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (content_id, tag_id),
    FOREIGN KEY (content_id) REFERENCES Content(content_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);


CREATE TABLE Views (
    view_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    viewed_at DATETIME DEFAULT GETDATE(),
    progress INT CHECK (progress BETWEEN 0 AND 100) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (content_id) REFERENCES Content(content_id)
);

Go

CREATE TABLE Requests (
    request_id INT PRIMARY KEY IDENTITY(1,1),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    category VARCHAR(500) NOT NULL, 
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'granted', 'rejected')),
    requested_at DATETIME DEFAULT GETDATE()
);

Go

CREATE INDEX idx_content_title ON Content(title);
CREATE INDEX idx_content_speaker ON Content(speaker_name);
CREATE INDEX idx_tags_name ON Tags(name);
CREATE INDEX idx_views_user ON Views(user_id);
CREATE INDEX idx_content_is_deleted ON Content(is_deleted);

Go