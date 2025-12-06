var fs = require("fs");

function getTodos(req, res) {
  fs.readFile("./todos.txt", function (err, data) {
    if (err) {
      res.send("Error vachind");
    } else {
      res.send(data.toString());
      //   res.json(data.toString());
    }
  });
}
function getTodosByUserName(req, res) {
  fs.readFile("./todos.txt", function (err, data) {
    if (err) {
      res.send("Error vachind");
    } else {
      var todos = JSON.parse(data.toString());
      userTodos = todos.filter((todo) => {
        return todo.username == req.params.username;
      });
      res.send(JSON.stringify(userTodos));
      //   res.json(data.toString());
    }
  });
}

function addTodo(req, res) {
  var data = fs.readFileSync("./todos.txt");

  var todos = JSON.parse(data.toString());
  todos.push(req.body);

  fs.writeFile("./todos.txt", JSON.stringify(todos), (err, data) => {
    if (err) {
      res.send("Cant add new todo");
    } else {
      res.send("Add New Todo Success");
    }
  });
}

module.exports = { getTodos, getTodosByUserName, addTodo };
/* 
  Database management
  - DBMS(Database Management System(software))((mysql/Oracle/postgres/SQLServer)/(mongodb/Cassendra))
  - DBMS softwares are two types(RDBMS/NoSQL)
  -- Databases
  --- RDBMS
  ---- tables
  ----- row(columns)
  --- NoSQL
  ---- collection (array of document(array of objects))
  ----- documents(object literal)
*/
