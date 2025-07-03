/**
 * Get user by ID
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
    const { id } = req.params;
    
    const result = await plugin.execute({
      query: "SELECT * FROM users WHERE id = ?",
      params: [id],
      connection_name: "main"
    });

    if (!result.success) {
      context.log.error(`Query error: ${result.error}`);
      return {
        status: 500,
        body: { error: result.error || "Failed to get user" }
      };
    }

    if (result.rows.length === 0) {
      return {
        status: 404,
        body: { error: "User not found" }
      };
    }

    return {
      status: 200,
      body: { user: result.rows[0] }
    };
  } catch (error) {
    context.log.error(`Get user error: ${error.message}`);
    return {
      status: 500,
      body: { error: error.message }
    };
  }
};
