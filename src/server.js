import express from 'express';
import configViewEngine from './configs/viewEngine';
import initWebRoute from './route/web';

// Load environment variables from .env file
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
console.log(`Server is running on port ${port}`)

// Set up view engine
configViewEngine(app)

// Initialize web routes
initWebRoute(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})