const MYSQL = require("mysql");
const INQUIRER = require("inquirer");

let con = MYSQL.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",
  password: "tanakan13",
  database: "iAmazon"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + con.threadId + "\n");
  printProduct();
});


function printProduct() {
  con.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;

    for (let i = 0; i < results.length; i++) {
      console.log("\nID's product is: " + results[i].id);
      console.log("Product's name is: " + results[i].product_name);
      console.log("Department's name is: " + results[i].department_name);
      console.log("Price: " + results[i].price);
      console.log("Quantity: " + results[i].stock_quantity + "\n");
    }
    askQuestion();
  });


}

function askQuestion() {
  INQUIRER
    .prompt([{
        type: "input",
        name: "product",
        message: "Tell me ID of product you want to buy!"
      },
      {
        type: "input",
        name: "quantity",
        message: "How much/many do you want?"

      }
    ]).then(function (answer) {
      let id = parseInt(answer.product);
      con.query('SELECT id, stock_quantity, product_name, price, product_sales FROM products WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;

        if (results[0].stock_quantity > parseInt(answer.quantity)) {

          let totalMoney = parseInt(answer.quantity) * results[0].price + results[0].product_sales;
          let amountLeft = results[0].stock_quantity - parseInt(answer.quantity);
          con.query('UPDATE products SET stock_quantity = ?, product_sales = ? WHERE id = ?', [amountLeft, totalMoney, id], function (err, res) {
            if (error) throw err;

            console.log("The " + answer.quantity + " of " + results[0].product_name + " will cost " + results[0].price * answer.quantity);
            con.end();
          });
        } else {
          console.log("Insufficient quantity!");
        }
      });

    });

}