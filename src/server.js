import express from 'express';
import configViewEngine from './configs/viewEngine';
import initWebRoute from './route/web';
import initAPIRoute from './route/api';

// Load environment variables from .env file
require('dotenv').config()

// Import necessary modules
var morgan = require('morgan') // Logging middleware

const app = express()
const port = process.env.PORT || 3000
console.log(`Server is running on port ${port}`)

app.use(morgan('combined')) // Use morgan for logging HTTP requests
app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded bodies
app.use(express.json()) // Middleware to parse JSON bodies

// Set up view engine
configViewEngine(app)

// Initialize web routes
initWebRoute(app)

// Initialize API routes
initAPIRoute(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})