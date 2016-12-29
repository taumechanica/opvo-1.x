-- Up

CREATE TABLE something(smth TEXT NOT NULL);

INSERT INTO something(smth) VALUES('Smth. #1');
INSERT INTO something(smth) VALUES('Smth. #2');
INSERT INTO something(smth) VALUES('Smth. #3');


-- Down

DROP TABLE something;
