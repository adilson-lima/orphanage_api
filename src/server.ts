import express from 'express'
import path from 'path'
import cors from 'cors'

import 'express-async-errors'

import './database/connection'
import routes from './routes'
import errorHandler from './errors/handler'


// import { createConnection } from "typeorm";


const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(errorHandler)

// Rota
// Recurso = usuário

// Query Params: http://localhost:3333/users?search=adilson
// Route Params: http://localhost:3333/users/1
// Body: http://localhost:3333/users/1

/*
app.post('/users/:id', (request, response) =>{
    
    console.log(request.query)
    console.log(request.params)
    console.log(request.body)


    // response.send('Hello World')
    response.json({ message: 'Hello World'})
})
*/



app.listen(3333)

