# App and Web Development Module Assignment

This repository contains the code for the App and Web Development Module
Assignment, which is a simple fullstach E-commerce Web App. The provided
`docker-compose.yaml` file allows users to easily set up and run the entire
application stack using Docker Compose. More detailed review will be provided in
the submited report of this assignment.

## Getting Started

To get started with running the application, follow these instructions:

### Prerequisites

The following software needs to be installed on your machine:

- Node.js
- Docker
- Docker Compose

You can use this links for detailed installation instructions:

- [How to install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
- [Get Docker](https://docs.docker.com/get-docker/)
- [Install Docker Engine](https://docs.docker.com/engine/install/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/SerhiiYahdzhyiev/app-n-web-dev-assignment.git
   ```

2. Navigate into the project directory:

   ```bash
   cd app-n-web-dev-assignment
   ```

3. Optional configuration and customization

The configuration of the project buiild and run is done via `.env` file. You can
check `.env.example` in the root folder for details. The root also has default
`.env` and in case you do not want to customize the values from it you can just
skip to next step.

Most of the customizations do not require any aditional steps, but there are
some exceptions:

- `DB_NAME`

  In case you want to change that you'll need to make changes to the
  `init-mongo.js` file. In the line below change `ecom` to the value you want to
  name the database (`DB_NAME` in `.env`)

  ```js
  db = new Mongo().getDB("ecom");
  ```

- `INIT_ADMIN_PASSWORD`

  After changing this value in `.env` run: `node get-passwd.js`. It will print
  the hashed password to the console. Copy it and paste to the `init-mongo.js`:

  ```js
  db.users.insertOne({
    firstName: "Initial",
    lastName: "Admin",
    email: "admin@mail.com",
    password: <your_custom_hased_password>,
    role: "ADMIN",
  });
  ```

  `<your_custom_hased_password>` should be replaced with the value that you've
  got from `get-passwd.js`.

  By the way you could also change the email of the default admin user in
  `init-mongo.js`. But keep in mind that it should look like a valid email (in
  terms of format).

3. Build and start the Docker containers:

   ```bash
   docker-compose up -d --build
   ```

4. Once the containers are up and running, you can access the Angular SPA at
   `http://localhost:4200`.

   If you haven't customized your `.env` then you can enter the admin page with
   default credentials:

   ```
   admin@mail.com
   root
   ```

## License

This project is licensed under the [MIT License](LICENSE.md).
