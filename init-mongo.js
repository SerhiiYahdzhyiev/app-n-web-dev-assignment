db = new Mongo().getDB("ecom");

db.createCollection("users");
db.createCollection("products");

db.users.insertOne({
  firstName: "Initial",
  lastName: "Admin",
  email: "admin@mail.com",
  password: "$2b$14$6rUSRdClqoikA0uy3kY4oOHdOw406ZVX15EwxXgFh0bgylBnOCFO2",
  role: "ADMIN",
});

db.users.insertOne({
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@mail.com",
  password: "$2b$14$6rUSRdClqoikA0uy3kY4oOHdOw406ZVX15EwxXgFh0bgylBnOCFO2",
  role: "CUSTOMER",
});

db.products.insertOne({
  title: "Quantm Flux Capacitor",
  description: "A crucial part for constructing time machine",
  price: 4200,
  imageUrls: [
    "https://m.media-amazon.com/images/I/71cy3X1C6PL._AC_SL1500_.jpg",
  ],
});

db.products.insertOne({
  title: "Light Sabre",
  description: "A legendary weapon of Jedi Knights",
  price: 6600,
  imageUrls: [
    "https://www.sciencefriday.com/wp-content/uploads/2015/12/lightsaber6.jpg",
  ],
});

db.products.insertOne({
  title: "Whip",
  description: "Favaorite tool of archologists/adventurers",
  price: 6900,
  imageUrls: [
    "https://m.media-amazon.com/images/I/612ioBkqObL._AC_SL1000_.jpg",
  ],
});
