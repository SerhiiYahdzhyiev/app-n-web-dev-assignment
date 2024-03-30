db = new Mongo().getDB("ecom");

db.createCollection("users");

db.users.insertOne({
  firstName: "Initial",
  lastName: "Admin",
  email: "admin@mail.com",
  password: "$2b$14$6rUSRdClqoikA0uy3kY4oOHdOw406ZVX15EwxXgFh0bgylBnOCFO2",
  role: "ADMIN",
});
