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

module.exports = {
    getHomePage
};
