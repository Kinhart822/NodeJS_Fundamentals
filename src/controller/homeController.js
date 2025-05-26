import pool from '../configs/connectDB';

let getHomePage = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        const data = result.rows;

        // Render EJS và truyền data
        return res.render('index.ejs', {
            name: 'Eric & Hoi Dan IT',
            dataUser: data
        });

    } catch (error) {
        console.error("Error querying PostgreSQL", error);
        return res.status(500).send("Internal Server Error");
    }
};

let getDetailsPage = async (req, res) => {
    let userId = req.params.id;
    let user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    console.log("checking req params", user);
    return res.send(JSON.stringify(user.rows[0]));
}

let createNewUser = async (req, res) => {
    let { firstName, lastName, email, address } = req.body;

    // Insert user into PostgreSQL
    await pool.query(
        "INSERT INTO users(first_name, last_name, email, address) VALUES ($1, $2, $3, $4)",
        [firstName, lastName, email, address]
    );

    // Redirect to home page
    return res.redirect('/');
}

let deleteUser = async (req, res) => {
    let userId = req.body.userId;

    // Delete user from PostgreSQL
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    // Redirect to home page
    return res.redirect('/');
}

let getUpdatePage = async (req, res) => {
    let userId = req.params.id;
    try {
        let user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        if (user.rows.length > 0) {
            return res.render("updateUser.ejs", {
                user: user.rows[0]
            });
        } else {
            return res.status(404).send("User not found");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
};

let editUser = async (req, res) => {
    let { firstName, lastName, email, address, userId } = req.body;

    await pool.query(
        "UPDATE users SET first_name = $1, last_name = $2, email = $3, address = $4 WHERE id = $5",
        [firstName, lastName, email, address, userId]
    );

    return res.redirect('/');
};

module.exports = {
    getHomePage, getDetailsPage, createNewUser, deleteUser, getUpdatePage, editUser
};
