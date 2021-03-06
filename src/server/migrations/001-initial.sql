-- Up

CREATE TABLE Settings (
    Language TEXT NOT NULL,
    YearFrom INTEGER NOT NULL,
    YearTo INTEGER NOT NULL
);

CREATE TABLE Developer (
    Id INTEGER NOT NULL,
    Name TEXT NOT NULL,
    CeilingAmount REAL NOT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE Contract (
    Id INTEGER NOT NULL,
    DeveloperId INTEGER NOT NULL,
    Amount REAL NOT NULL,
    StartDate INTEGER NOT NULL,
    Deadline INTEGER NOT NULL,
    AcceptanceDate INTEGER,
    PRIMARY KEY (Id),
    FOREIGN KEY (DeveloperId)
        REFERENCES Developer (Id)
        ON DELETE CASCADE
);


-- Down

DROP TABLE Settings;
DROP TABLE Developer;
DROP TABLE Contract;
