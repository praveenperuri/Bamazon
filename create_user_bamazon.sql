CREATE USER 'bamazon'@'localhost' IDENTIFIED BY 'bcs';

GRANT ALL PRIVILEGES ON * . * TO 'bamazon'@'localhost';

FLUSH PRIVILEGES;