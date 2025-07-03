/**
 * Initializes the database schema with users table
 */
module.exports = async function(req, context) {
  const plugin = context.plugins.sqlite;

  if (!plugin) {
    return {
      status: 500,
      body: { error: "SQLite plugin not available" }
    };
  }

  try {
    // Create users table
    const result = await plugin.execute({
      query: `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
      params: [],
      connection_name: "main"
    });

    if (!result.success) {
      context.log.error(`Database initialization error: ${result.error}`);
      return {
        status: 500,
        body: { error: result.error || "Failed to initialize database" }
      };
    }

    return {
      status: 200,
      body: { message: "Database initialized successfully" }
    };
  } catch (error) {
    context.log.error(`Database initialization error: ${error.message}`);
    return {
      status: 500,
      body: { error: error.message }
    };
  }
};
