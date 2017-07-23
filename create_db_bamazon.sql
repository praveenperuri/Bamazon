create database bamazon;

use bamazon;

create table products
(item_id int auto_increment not null,             -- (unique id for each product)
product_name varchar(100) not null,                  -- (Name of product)
department_name varchar(50) not null,
price decimal(6,2) not null,                           -- (cost to customer)
stock_quantity int not null,
PRIMARY KEY(item_id) )          -- (how much of the product is available in stores)

-- alter table bamazon.products modify price decimal(6,2) not null


use bamazon;

insert into products
(product_name, 
department_name, 
price,                           
stock_quantity)
VALUES       
('Macbook',
'Computers',
1499.99,
4)

select * from bamazon.products