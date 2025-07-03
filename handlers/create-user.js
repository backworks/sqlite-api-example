/**
 * Create a new user
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
    const { name, email } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return {
        status: 400,
        body: { error: "Name and email are required" }
      };
    }

    const result = await plugin.execute({
      query: "INSERT INTO users (name, email) VALUES (?, ?)",
      params: [name, email],
      connection_name: "main"
    });

    if (!result.success) {
      context.log.error(`Insert error: ${result.error}`);
      
      // Check for duplicate email
      if (result.error && result.error.includes("UNIQUE constraint failed: users.email")) {
        return {
          status: 409,
          body: { error: "Email already exists" }
        };
      }
      
      return {
        status: 500,
        body: { error: result.error || "Failed to create user" }
      };
    }

    // Get the ID of the inserted user
    const userResult = await plugin.execute({
      query: "SELECT * FROM users WHERE email = ? LIMIT 1",
      params: [email],
      connection_name: "main"
    });

    if (!userResult.success || userResult.rows.length === 0) {
      return {
        status: 201,
        body: { message: "User created successfully", user: { name, email } }
      };
    }

    return {
      status: 201,
      body: { message: "User created successfully", user: userResult.rows[0] }
    };
  } catch (error) {
    context.log.error(`Create user error: ${error.message}`);
    return {
      status: 500,
      body: { error: error.message }
    };
  }
};
