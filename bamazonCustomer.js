var inquirer = require('inquirer');
var mysql = require('mysql');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "bamazon",
    password: "bcs",
    database: "bamazon"
});

var products = [];

function Product(id, name, deptName, price, stock) {
    this.id = id;
    this.name = name;
    this.deptName = deptName;
    this.price = price;
    this.stock = stock;
    this.checkInventory = function (unitsOrdered) {
        return parseInt(unitsOrdered) <= parseInt(this.stock);
    };
}

var chosenItem;

connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function showProducts() {
    var query = connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        for (i = 0; i < results.length; i++) {
            // products.push(
            //     new Product(results[i].item_id,
            //         results[i].product_name,
            //         results[i].department_name,
            //         results[i].price,
            //         results[i].stock_quantity)
            // );

            console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name + " | " + results[i].price + " | " + results[i].stock_quantity);
        }

        connection.end();
    });
}

// function which prompts the user for what action they should take
function start() {
    connection.query('SELECT * FROM products', function (err, results) {
        if (err) throw err;

        console.log("item_id | product_name | department_name | price | stock_quantity ");

        for (i = 0; i < results.length; i++) {
            products.push(
                new Product(results[i].item_id,
                    results[i].product_name,
                    results[i].department_name,
                    results[i].price,
                    results[i].stock_quantity)
            );
            // products.push({
            //     item_id: results[i].item_id,
            //     product_name: results[i].product_name,
            //     department_name: results[i].department_name,
            //     price: results[i].price,
            //     stock_quantity: results[i].stock_quantity
            // });

            console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name + " | " + results[i].price + " | " + results[i].stock_quantity);
        }

        inquirer
            .prompt([
                {
                    name: "sellItem",
                    type: "input",
                    message: "What is the item id you would like to buy?",
                    validate: function (input) {
                        for (var i = 0; i < products.length; i++) {
                            if (products[i].id === parseInt(input)) {
                                // get the information of the chosen item
                                chosenItem = new Product(products[i].id,
                                    products[i].name,
                                    products[i].deptName,
                                    products[i].price,
                                    products[i].stock);
                                return true;
                            }
                        }
                        return ('Cannot find a matching item for the id you entered !!');
                    }
                },
                {
                    name: "sellItemQuant",
                    type: "input",
                    message: "How many units of the item would you like to buy?",
                    validate: function (input) {
                        if (typeof parseInt(input) === 'number') {
                            if (!chosenItem.checkInventory(input)) {
                                return 'Insufficient Quantity !';
                            }
                        } else {
                            return 'You need to enter a number';
                        }
                        return true;
                    }
                }
            ])
            .then(function (answer) {
                var totalPrice = parseFloat(chosenItem.price) * parseInt(answer.sellItemQuant);
                console.log('Total Price of this purchase = $' + totalPrice);

                // bid was high enough, so update db, let the user know, and start over
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: parseInt(chosenItem.stock) - parseInt(answer.sellItemQuant)
                        },
                        {
                            item_id: chosenItem.id
                        }
                    ],
                    function (error) {
                        if (error) throw error;
                        console.log("Purchase Order was placed successfully. Inventory has been updated for " + chosenItem.name);
                        showProducts();
                    }
                );
            });
    });
}

