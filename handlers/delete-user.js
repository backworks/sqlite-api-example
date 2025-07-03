/**
 * Delete user by ID
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
    
    // First check if the user exists
    const checkResult = await plugin.execute({
      query: "SELECT * FROM users WHERE id = ?",
      params: [id],
      connection_name: "main"
    });

    if (!checkResult.success || checkResult.rows.length === 0) {
      return {
        status: 404,
        body: { error: "User not found" }
      };
    }

    const result = await plugin.execute({
      query: "DELETE FROM users WHERE id = ?",
      params: [id],
      connection_name: "main"
    });

    if (!result.success) {
      context.log.error(`Delete error: ${result.error}`);
      return {
        status: 500,
        body: { error: result.error || "Failed to delete user" }
      };
    }

    return {
      status: 200,
      body: { message: "User deleted successfully" }
    };
  } catch (error) {
    context.log.error(`Delete user error: ${error.message}`);
    return {
      status: 500,
      body: { error: error.message }
    };
  }
};
