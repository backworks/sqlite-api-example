/**
 * Update user by ID
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
    const { name, email } = req.body;
    
    // Validate at least one field to update
    if (!name && !email) {
      return {
        status: 400,
        body: { error: "At least one field (name or email) must be provided for update" }
      };
    }

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

    const currentUser = checkResult.rows[0];
    
    // Build update query dynamically based on provided fields
    let query = "UPDATE users SET ";
    const updateFields = [];
    const updateValues = [];
    
    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    
    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    
    query += updateFields.join(", ");
    query += " WHERE id = ?";
    updateValues.push(id);

    const result = await plugin.execute({
      query,
      params: updateValues,
      connection_name: "main"
    });

    if (!result.success) {
      context.log.error(`Update error: ${result.error}`);
      
      // Check for duplicate email
      if (result.error && result.error.includes("UNIQUE constraint failed: users.email")) {
        return {
          status: 409,
          body: { error: "Email already exists" }
        };
      }
      
      return {
        status: 500,
        body: { error: result.error || "Failed to update user" }
      };
    }

    // Prepare updated user object
    const updatedUser = {
      ...currentUser,
      name: name || currentUser.name,
      email: email || currentUser.email
    };

    return {
      status: 200,
      body: { 
        message: "User updated successfully", 
        user: updatedUser
      }
    };
  } catch (error) {
    context.log.error(`Update user error: ${error.message}`);
    return {
      status: 500,
      body: { error: error.message }
    };
  }
};
