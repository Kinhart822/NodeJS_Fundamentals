import express from 'express';
import homeController from '../controller/homeController';

let router = express.Router();

const initWebRoute = (app) => {
    router.get('/', homeController.getHomePage);
    router.get("/details/user/:id", homeController.getDetailsPage);
    router.post("/create-new-user", homeController.createNewUser);
    router.post("/delete-user", homeController.deleteUser);
    router.get("/edit-user/:id", homeController.getUpdatePage); 
    router.post("/edit-user", homeController.editUser);         

    router.get('/about', (req, res) => {
        res.send('Hello World from ERIC & HOI DAN IT')
    })

    return app.use('/', router);
}

export default initWebRoute;