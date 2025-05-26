import express from 'express';
import APIController from '../controller/APIController';  

let router = express.Router();

const initAPIRoute = (app) => {
    router.get('/users', APIController.getAllUsers);   // Get all users
    router.post('/create-user', APIController.createNewUser); // Create a new user
    router.put('/update-user/:id', APIController.updateUser); // Update user by ID
    router.delete('/delete-user/:id', APIController.deleteUser); // Delete user by ID

    return app.use('/api/v1', router);
}

export default initAPIRoute;