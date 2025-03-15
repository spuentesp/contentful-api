# Contentful API

This project is a NestJS-based API for synchronizing products from Contentful. It includes user authentication, product management, and reporting functionalities.

## Project Setup

### Install Dependencies

```bash
npm install
```

### Compile and Run the Project

```bash
npm run docker

```

### Run Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

### Docker Setup

To run the project using Docker, use the following command:

```bash
npm run docker
```

## Endpoints

### Authentication

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Login a user.

### Users

- **GET /users**: Get a list of users.
- **POST /users**: Create a new user.

### Products

- **GET /products**: Get a list of products.
- **POST /products**: Create a new product.
- **GET /products/:id**: Get a product by ID.
- **PATCH /products/:id**: Update a product by ID.
- **DELETE /products/:id**: Delete a product by ID.

### Reports

- **GET /reports/deleted-percentage**: Get percentage of deleted items.
- **GET /reports/active-percentage**: Get percentage of active items.
- **GET /reports/custom**: Get custom report.

### Contentful

- **POST /contentful/sync**: Trigger Contentful synchronization.

## Swagger Documentation

The API documentation is available via Swagger. To access it, start the application and navigate to:

```
http://localhost:3000/api/docs
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
CONTENTFUL_SPACE_ID=your_contentful_space_id
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token
CONTENTFUL_ENVIRONMENT=your_contentful_environment
CONTENTFUL_CONTENT_TYPE=your_contentful_content_type
JWT_SECRET=your_jwt_secret
```

## License

This project is [MIT licensed](LICENSE).