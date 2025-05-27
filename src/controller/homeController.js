import pool from '../configs/connectDB';

let getHomePage = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        const data = result.rows;
        return res.render('index.ejs', {
            name: 'Eric & Hoi Dan IT',
            dataUser: data
        });
    } catch (error) {
        console.error('Error querying PostgreSQL', error);
        return res.status(500).send('Internal Server Error');
    }
};

let getDetailsPage = async (req, res) => {
    let userId = req.params.id;
    try {
        let user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length > 0) {
            return res.send(JSON.stringify(user.rows[0]));
        } else {
            return res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error querying PostgreSQL', error);
        return res.status(500).send('Internal Server Error');
    }
};

let createNewUser = async (req, res) => {
    let { firstName, lastName, email, address } = req.body;
    try {
        await pool.query(
            'INSERT INTO users(first_name, last_name, email, address) VALUES ($1, $2, $3, $4)',
            [firstName, lastName, email, address]
        );
        return res.redirect('/');
    } catch (error) {
        console.error('Error creating user', error);
        return res.status(500).send('Internal Server Error');
    }
};

let deleteUser = async (req, res) => {
    let userId = req.body.userId;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        return res.redirect('/');
    } catch (error) {
        console.error('Error deleting user', error);
        return res.status(500).send('Internal Server Error');
    }
};

let getUpdatePage = async (req, res) => {
    let userId = req.params.id;
    try {
        let user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length > 0) {
            return res.render('updateUser.ejs', {
                user: user.rows[0]
            });
        } else {
            return res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error querying PostgreSQL', error);
        return res.status(500).send('Internal Server Error');
    }
};

let editUser = async (req, res) => {
    let { firstName, lastName, email, address, userId } = req.body;
    try {
        await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, email = $3, address = $4 WHERE id = $5',
            [firstName, lastName, email, address, userId]
        );
        return res.redirect('/');
    } catch (error) {
        console.error('Error updating user', error);
        return res.status(500).send('Internal Server Error');
    }
};

let getUploadFilePage = async (req, res) => {
    return res.render('uploadFile.ejs', { error: null, images: null });
};

let handleUploadFile = async (req, res) => {
    if (req.fileValidationError) {
        return res.render('uploadFile.ejs', { error: req.fileValidationError, images: null });
    }
    if (!req.file) {
        return res.render('uploadFile.ejs', { error: 'Please select an image to upload', images: null });
    }
    return res.render('uploadFile.ejs', {
        error: null,
        images: [{ src: `/image/${req.file.filename}`, alt: 'Uploaded Image' }]
    });
};

let handleMultipleUpload = async (req, res) => {
    if (req.fileValidationError) {
        return res.render('uploadFile.ejs', { error: req.fileValidationError, images: null });
    }
    if (!req.files || req.files.length === 0) {
        return res.render('uploadFile.ejs', { error: 'Please select at least one image to upload', images: null });
    }
    const images = req.files.map(file => ({
        src: `/image/${file.filename}`,
        alt: `Uploaded Image ${file.originalname}`
    }));
    return res.render('uploadFile.ejs', { error: null, images });
};

export default {
    getHomePage,
    getDetailsPage,
    createNewUser,
    deleteUser,
    getUpdatePage,
    editUser,
    getUploadFilePage,
    handleUploadFile,
    handleMultipleUpload
};