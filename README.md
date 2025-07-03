# SQLite API Example

This example demonstrates how to use the Backworks SQLite plugin to create a REST API with database operations.

## Setup

1. Make sure Backworks is installed or clone the repository and run from this directory.
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

## API Endpoints

### Initialize Database

```
POST /api/init
```

Creates the necessary database schema with a users table.

### List Users

```
GET /api/users
```

Returns a list of all users.

### Create User

```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Creates a new user with the specified name and email.

### Get User by ID

```
GET /api/users/:id
```

Returns the user with the specified ID.

### Update User

```
PUT /api/users/:id
Content-Type: application/json

{
  "name": "John Smith", // Optional
  "email": "john.smith@example.com" // Optional
}
```

Updates the user with the specified ID with new information.

### Delete User

```
DELETE /api/users/:id
```

Deletes the user with the specified ID.

## How It Works

This example demonstrates several key features of the Backworks SQLite plugin:

1. **Plugin Configuration**: The SQLite plugin is configured in the blueprint file with a connection to a local SQLite database.
2. **SQL Operations**: The handlers demonstrate various SQL operations: CREATE TABLE, SELECT, INSERT, UPDATE, DELETE.
3. **Error Handling**: Each handler includes proper error handling for SQL errors and returns appropriate HTTP status codes.
4. **Parameter Binding**: The examples show secure parameter binding to prevent SQL injection.

## SQLite Plugin Usage

The SQLite plugin is accessed through the context object in each handler:

```javascript
const plugin = context.plugins.sqlite;

// Execute a query
const result = await plugin.execute({
  query: "SELECT * FROM users",
  params: [], // Parameters for query placeholders (?)
  connection_name: "main" // Connection name from configuration
});

// Check for success
if (result.success) {
  // Use result.rows for SELECT queries
  const users = result.rows;
  
  // For other operations, result.rows_affected might be relevant
} else {
  // Handle error with result.error
}
```

## Data Folder Structure

The SQLite database will be created in the `data/` folder when you first initialize the database. This folder is not included in the repository, so make sure to create it before starting the server:

```bash
mkdir -p data
```
