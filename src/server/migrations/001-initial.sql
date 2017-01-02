-- Up

CREATE TABLE developer(
	id INTEGER NOT NULL,
	name TEXT NOT NULL,
	ceiling_amount REAL NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO developer(name, ceiling_amount) VALUES('Developer #1', 25.0);
INSERT INTO developer(name, ceiling_amount) VALUES('Developer #2', 50.0);
INSERT INTO developer(name, ceiling_amount) VALUES('Developer #3', 25.0);

CREATE TABLE contract(
	id INTEGER NOT NULL,
	developer_id INTEGER NOT NULL,
	amount REAL NOT NULL,
	start_date INTEGER NOT NULL,
	deadline INTEGER NOT NULL,
	acceptance_date INTEGER,
	PRIMARY KEY (id),
	FOREIGN KEY (developer_id)
		REFERENCES developer (id)
);


-- Down

DROP TABLE developer;
DROP TABLE contract;
