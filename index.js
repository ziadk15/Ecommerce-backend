import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})
import express from 'express';
import cors from 'cors'
import bootstrap from './src/index.router.js'

const app = express()

// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// app.use(cors(corsOptions))

const port = +process.env.PORT
bootstrap(app,express)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))