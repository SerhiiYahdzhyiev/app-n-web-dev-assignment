const appDb = db.getSiblingDB("ecom");

if (!appDb.getUser("ecom")) {
  appDb.createUser({
    user: "ecom",
    pwd: "ecomsecret",
    roles: [{ role: "readWrite", db: "ecom" }],
  });
}

appDb.users.createIndex({ email: 1 }, { unique: true });
appDb.orders.createIndex({ userId: 1, status: 1 });
appDb.orders.createIndex({ status: 1 });

const users = [
  {
    firstName: "Initial",
    lastName: "Admin",
    email: "admin@mail.com",
    password: "$2b$14$6rUSRdClqoikA0uy3kY4oOHdOw406ZVX15EwxXgFh0bgylBnOCFO2",
    role: "ADMIN",
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@mail.com",
    password: "$2b$14$6rUSRdClqoikA0uy3kY4oOHdOw406ZVX15EwxXgFh0bgylBnOCFO2",
    role: "CUSTOMER",
  },
];

appDb.users.bulkWrite(
  users.map((user) => ({
    updateOne: {
      filter: { email: user.email },
      update: { $setOnInsert: user },
      upsert: true,
    },
  })),
);

const products = [
  { title: "Quantum Flux Capacitor", description: "A crucial component for constructing a time machine", category: "Hobby", price: 4200, imageUrls: [] },
  { title: "Light Saber", description: "A legendary weapon of the Jedi Knights", category: "Hobby", price: 6600, imageUrls: [] },
  { title: "Whip", description: "A favorite tool of archaeologists and adventurers", category: "Hobby", price: 6900, imageUrls: [] },
  { title: "Smartphone", description: "A high-quality smartphone", category: "Electronics", price: 1299, imageUrls: [] },
  { title: "Laptop", description: "A high-quality laptop", category: "Electronics", price: 2499, imageUrls: [] },
  { title: "Smartwatch", description: "A high-quality smartwatch", category: "Electronics", price: 499, imageUrls: [] },
  { title: "Tablet", description: "A high-quality tablet", category: "Electronics", price: 899, imageUrls: [] },
  { title: "Wireless Headphones", description: "High-quality wireless headphones", category: "Electronics", price: 299, imageUrls: [] },
  { title: "Cordless Drill", description: "A high-quality cordless drill", category: "Tools", price: 159, imageUrls: [] },
  { title: "Hammer", description: "A durable claw hammer", category: "Tools", price: 49, imageUrls: [] },
  { title: "Wrench Set", description: "A versatile wrench set", category: "Tools", price: 79, imageUrls: [] },
  { title: "Circular Saw", description: "A high-quality circular saw", category: "Tools", price: 229, imageUrls: [] },
  { title: "Electric Screwdriver", description: "A compact electric screwdriver", category: "Tools", price: 89, imageUrls: [] },
  { title: "LEGO Set", description: "A fun LEGO set", category: "Toys", price: 119, imageUrls: [] },
  { title: "RC Car", description: "A high-quality remote-control car", category: "Toys", price: 189, imageUrls: [] },
  { title: "Board Game", description: "A classic board game", category: "Toys", price: 49, imageUrls: [] },
  { title: "Action Figure", description: "A collectible action figure", category: "Toys", price: 79, imageUrls: [] },
  { title: "Puzzle Box", description: "A challenging puzzle box", category: "Toys", price: 39, imageUrls: [] },
  { title: "Sci-Fi Novel", description: "A gripping science-fiction novel", category: "Books", price: 29, imageUrls: [] },
  { title: "Mystery Thriller", description: "An exciting mystery thriller", category: "Books", price: 35, imageUrls: [] },
  { title: "Fantasy Epic", description: "An epic fantasy novel", category: "Books", price: 40, imageUrls: [] },
  { title: "Self-Help Guide", description: "A useful self-help guide", category: "Books", price: 25, imageUrls: [] },
  { title: "Biography", description: "An inspiring biography", category: "Books", price: 45, imageUrls: [] },
  { title: "Table Lamp", description: "A stylish table lamp", category: "Home Decor", price: 89, imageUrls: [] },
  { title: "Wall Clock", description: "A decorative wall clock", category: "Home Decor", price: 120, imageUrls: [] },
  { title: "Canvas Painting", description: "A beautiful canvas painting", category: "Home Decor", price: 299, imageUrls: [] },
  { title: "Decorative Vase", description: "A stunning decorative vase", category: "Home Decor", price: 99, imageUrls: [] },
  { title: "Throw Pillow", description: "A cozy throw pillow", category: "Home Decor", price: 39, imageUrls: [] },
];

appDb.products.bulkWrite(
  products.map((product) => ({
    updateOne: {
      filter: { title: product.title },
      update: { $setOnInsert: product },
      upsert: true,
    },
  })),
);
