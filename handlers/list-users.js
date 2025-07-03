/**
 * List all users
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
    const result = await plugin.execute({
      query: "SELECT * FROM users",
      params: [],
      connection_name: "main"
    });

    if (!result.success) {
      context.log.error(`Query error: ${result.error}`);
      return {
        status: 500,
        body: { error: result.error || "Failed to query users" }
      };
    }

    return {
      status: 200,
      body: { users: result.rows }
    };
  } catch (error) {
    context.log.error(`Query error: ${error.message}`);
    return {
      status: 500,
      body: { error: error.message }
    };
  }
};
