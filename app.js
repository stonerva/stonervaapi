import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import fetchRoutes from './routes/userRoutes/userRoute.js'
import productRoutes from './routes/userRoutes/productRoutes.js'
import adminRoutes from './routes/adminRoutes/adminRoutes.js'
// import fetchquesRoutes from './src/routes/question.routes.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))


//Routes///
app.use("/api/v1",fetchRoutes)
app.use("/api/v1/product",productRoutes)
app.use("/api/v1/admin",adminRoutes)


export default app