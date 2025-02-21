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
  title: "Quantum Flux Capacitor",
  description: "A crucial part for constructing time machine",
  category: "Hobby",
  price: 4200,
  imageUrls: [],
});

db.products.insertOne({
  title: "Light Sabre",
  description: "A legendary weapon of Jedi Knights",
  category: "Hobby",
  price: 6600,
  imageUrls: [],
});

db.products.insertOne({
  title: "Whip",
  description: "Favaorite tool of archologists/adventurers",
  category: "Hobby",
  price: 6900,
  imageUrls: [],
});

db.products.insertOne({
  title: "Smartphone",
  description: "A high-quality smartphone from Electronics category",
  category: "Electronics",
  price: 1299,
  imageUrls: [],
});
db.products.insertOne({
  title: "Laptop",
  description: "A high-quality laptop from Electronics category",
  category: "Electronics",
  price: 2499,
  imageUrls: [],
});
db.products.insertOne({
  title: "Smartwatch",
  description: "A high-quality smartwatch from Electronics category",
  category: "Electronics",
  price: 499,
  imageUrls: [],
});
db.products.insertOne({
  title: "Tablet",
  description: "A high-quality tablet from Electronics category",
  category: "Electronics",
  price: 899,
  imageUrls: [],
});
db.products.insertOne({
  title: "Wireless Headphones",
  description: "A high-quality wireless headphones from Electronics category",
  category: "Electronics",
  price: 299,
  imageUrls: [],
});
db.products.insertOne({
  title: "Cordless Drill",
  description: "A high-quality cordless drill from Tools category",
  category: "Tools",
  price: 159,
  imageUrls: [],
});
db.products.insertOne({
  title: "Hammer",
  description: "A high-quality hammer from Tools category",
  category: "Tools",
  price: 49,
  imageUrls: [],
});
db.products.insertOne({
  title: "Wrench Set",
  description: "A high-quality wrench set from Tools category",
  category: "Tools",
  price: 79,
  imageUrls: [],
});
db.products.insertOne({
  title: "Circular Saw",
  description: "A high-quality circular saw from Tools category",
  category: "Tools",
  price: 229,
  imageUrls: [],
});
db.products.insertOne({
  title: "Electric Screwdriver",
  description: "A high-quality electric screwdriver from Tools category",
  category: "Tools",
  price: 89,
  imageUrls: [],
});
db.products.insertOne({
  title: "LEGO Set",
  description: "A fun LEGO Set from Toys category",
  category: "Toys",
  price: 119,
  imageUrls: [],
});
db.products.insertOne({
  title: "RC Car",
  description: "A high-quality RC car from Toys category",
  category: "Toys",
  price: 189,
  imageUrls: [],
});
db.products.insertOne({
  title: "Board Game",
  description: "A classic board game from Toys category",
  category: "Toys",
  price: 49,
  imageUrls: [],
});
db.products.insertOne({
  title: "Action Figure",
  description: "A collectible action figure from Toys category",
  category: "Toys",
  price: 79,
  imageUrls: [],
});
db.products.insertOne({
  title: "Puzzle Box",
  description: "A challenging puzzle box from Toys category",
  category: "Toys",
  price: 39,
  imageUrls: [],
});
db.products.insertOne({
  title: "Sci-Fi Novel",
  description: "A gripping sci-fi novel from Books category",
  category: "Books",
  price: 29,
  imageUrls: [],
});
db.products.insertOne({
  title: "Mystery Thriller",
  description: "An exciting mystery thriller from Books category",
  category: "Books",
  price: 35,
  imageUrls: [],
});
db.products.insertOne({
  title: "Fantasy Epic",
  description: "An epic fantasy novel from Books category",
  category: "Books",
  price: 40,
  imageUrls: [],
});
db.products.insertOne({
  title: "Self-Help Guide",
  description: "A useful self-help guide from Books category",
  category: "Books",
  price: 25,
  imageUrls: [],
});
db.products.insertOne({
  title: "Biography",
  description: "An inspiring biography from Books category",
  category: "Books",
  price: 45,
  imageUrls: [],
});
db.products.insertOne({
  title: "Table Lamp",
  description: "A stylish table lamp from Home Decor category",
  category: "Home Decor",
  price: 89,
  imageUrls: [],
});
db.products.insertOne({
  title: "Wall Clock",
  description: "A decorative wall clock from Home Decor category",
  category: "Home Decor",
  price: 120,
  imageUrls: [],
});
db.products.insertOne({
  title: "Canvas Painting",
  description: "A beautiful canvas painting from Home Decor category",
  category: "Home Decor",
  price: 299,
  imageUrls: [],
});
db.products.insertOne({
  title: "Decorative Vase",
  description: "A stunning decorative vase from Home Decor category",
  category: "Home Decor",
  price: 99,
  imageUrls: [],
});
db.products.insertOne({
  title: "Throw Pillow",
  description: "A cozy throw pillow from Home Decor category",
  category: "Home Decor",
  price: 39,
  imageUrls: [],
});
