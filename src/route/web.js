import express from 'express';
import homeController from '../controller/homeController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import appRoot from 'app-root-path';

let router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(appRoot.path, 'src/public/image/');
        fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Image filter to allow only specific image types
const imageFilter = function (req, file, cb) {
    const allowedExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|tiff|ico)$/i;
    if (!file.originalname.match(allowedExtensions)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Multer instances for single and multiple uploads
const uploadSingle = multer({ 
    storage: storage, 
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('profile_pic');
const uploadMultiple = multer({ 
    storage: storage, 
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per file
}).array('multiple_images', 10); // Limit to 10 files

// Multer error-handling middleware
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        let errorMessage;
        if (err.code === 'LIMIT_FILE_COUNT') {
            errorMessage = 'Too many files uploaded. Maximum allowed is 10 images.';
        } else if (err.code === 'LIMIT_FILE_SIZE') {
            errorMessage = 'File too large. Maximum size is 5MB per file.';
        } else {
            errorMessage = `Multer error: ${err.message}`;
        }
        return res.render('uploadFile.ejs', { error: errorMessage });
    }
    if (err.message === 'Only image files are allowed!') {
        return res.render('uploadFile.ejs', { error: err.message });
    }
    next(err); // Pass non-Multer errors to the default error handler
};

const initWebRoute = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/details/user/:id', homeController.getDetailsPage);
    router.post('/create-new-user', homeController.createNewUser);
    router.post('/delete-user', homeController.deleteUser);
    router.get('/edit-user/:id', homeController.getUpdatePage);
    router.post('/edit-user', homeController.editUser);
    router.get('/upload', homeController.getUploadFilePage);
    router.post('/upload-profile-pic', uploadSingle, homeController.handleUploadFile);
    router.post('/upload-multiple-images', uploadMultiple, homeController.handleMultipleUpload);

    router.get('/about', (req, res) => {
        res.send('Hello World from ERIC & HOI DAN IT');
    });

    // Apply Multer error handler
    app.use(multerErrorHandler);

    return app.use('/', router);
};

export default initWebRoute;