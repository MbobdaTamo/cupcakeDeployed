import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import history from 'connect-history-api-fallback'
/*import axios from'axios'
import fs from 'fs'*/
//---- codes snippets ---------------

// connect to mysql db
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
    console.log('bonjour'+origin)
    origine = origin
    if(allowedDomains.indexOf(origin) == -1) allowedDomains.push(origin)
    return callback(null,true)
},methods:["POST","OPTIONS"],credentials:true}
app.use(cors(cors1/*{methods:["POST","OPTIONS"],origin:"http://localhost:8080",credentials:true}*/))

const port = 80

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
