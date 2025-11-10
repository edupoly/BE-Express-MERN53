db.employees.aggregate([
  {
    $unwind:"$projects"
  }
]);
