import https from 'https'
import fs from 'fs'

import mysql from 'mysql-await'
import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import history from 'connect-history-api-fallback'
//---- codes snippets ---------------
import inscription from './inscription.js'
import publication from './publication.js'
import client from './client.js'


let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "cupcake"
})
//---------- express setting up --------------

const app = express()

app.use(history({
    rewrites: [
      {
        from: /^\/images\/.*$/,
        to: function(context) {
            return context.parsedUrl.path
        }
      }
    ]
 }))

app.use(cookieParser());
app.use(session({
    secret: "my fuckinggg secret sentences",
    resave: false,
    saveUninitialized: true,
    cookie: { secure:false, httpOnly:false,sameSite:'Lax',maxAge: 1000*60*10 }
}))
let allowedDomains = []
let origine = ''
let cors1 = {origin:function(origin,callback){
    //console.log('bonjour'+origin)
    origine = origin
    if(allowedDomains.indexOf(origin) == -1) allowedDomains.push(origin)
    return callback(null,true)
},methods:["POST","OPTIONS"],credentials:true}
app.use(cors(cors1/*{methods:["POST","OPTIONS"],origin:"http://localhost:8080",credentials:true}*/))

const port = 3004

// body parser to retrieve informations
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//--
app.use(    
    fileUpload({
        limits: {
            fileSize: 10000000, // Around 10MB
        },
        abortOnLimit: true,
    })
)
app.use(express.static('public'))

app.set('trust proxy', true)
app.post('/inscription.php', (req, res) => {
    inscription(req,res,con)
})
app.post('/publication.php', (req, res) => {
    publication(req,res,con)
})
app.post('/client.php', (req, res) => {
    client(req,res,con)
})

process.on('uncaughtException', err => {
    console.log(`Uncaught Exception: ${err.message}`)
    //process.exit(0)
})


let privateKey = fs.readFileSync( '/etc/letsencrypt/live/cupcake.sassayer.com/privkey.pem' )
let certificate = fs.readFileSync( '/etc/letsencrypt/live/cupcake.sassayer.com/fullchain.pem' )

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port);

