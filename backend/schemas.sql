CREATE DATABASE assignment_db;
USE assignment_db;

CREATE TABLE component_2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    month VARCHAR(50),
    last_year INT,
    this_year INT
);

CREATE TABLE component_4 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME,
    web_sales INT,
    offline_sales INT
);

CREATE TABLE component_6 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(255),
    sold_amount INT,
    unit_price DECIMAL(10,2),
    revenue DECIMAL(15,2),
    rating FLOAT
);
