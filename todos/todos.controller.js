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
module.exports = { getTodos };
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
