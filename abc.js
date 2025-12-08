db.employees.aggregate([
  {
    $unwind: "$projects",
  },
]);
db.orders.delete({ $exists: { description: 1 } });
