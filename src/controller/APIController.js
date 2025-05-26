import pool from "../configs/connectDB"

let getAllUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        const data = result.rows;

        // Return JSON response
        return res.status(200).json({
            message: "OK",
            data: data
        });
    } catch (error) {
        console.error("Error querying PostgreSQL", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

let createNewUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Request body is required"
            });
        }

        let { firstName, lastName, email, address } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !address) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        
        // Insert user into PostgreSQL
        const result = await pool.query(
            "INSERT INTO users(first_name, last_name, email, address) VALUES ($1, $2, $3, $4)",
            [firstName, lastName, email, address]
        );

        const newUser = result.rows[0];

        // Return JSON response
        return res.status(201).json({
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        console.error("Error inserting into PostgreSQL", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

let updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId || !req.body) {
            return res.status(400).json({
                message: "User ID and request body are required"
            });
        }

        let { firstName, lastName, email, address } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !address) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Update user in PostgreSQL
        await pool.query(
            "UPDATE users SET first_name = $1, last_name = $2, email = $3, address = $4 WHERE id = $5",
            [firstName, lastName, email, address, userId]
        );

        // Return JSON response
        return res.status(200).json({
            message: "User updated successfully"
        });
    } catch (error) {
        console.error("Error updating PostgreSQL", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

let deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        // Delete user from PostgreSQL
        await pool.query("DELETE FROM users WHERE id = $1", [userId]);

        // Return JSON response
        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting from PostgreSQL", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    getAllUsers, createNewUser, updateUser, deleteUser
}