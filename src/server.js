import express from 'express';      
import configViewEngine from './configs/viewEngine';
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
console.log(`Server is running on port ${port}`)

configViewEngine(app)

app.get('/', (req, res) => {
  res.render('index.ejs', { name: 'Eric & Hoi Dan IT' })
})

app.get('/about', (req, res) => {
  res.send('Hello World from ERIC & HOI DAN IT')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})