//npm innit -y ,npm i express ,i socket.io, init -y ,i @faker-js/faker, i knex mysql/sqlite3, i ejs,express cookie-parser, express-session,connect-mongo 
const express=require('express')
const app= express()
const {createServer}= require('http')
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
const socketIo = require('socket.io')
const server=createServer(app)
const io =socketIo(server)
const { ContenedorArchivo } = require('./controller/contenedorArchivos')
const mongoStore=require("connect-mongo")
const expressSession=require("express-session")
app.set('views', './public')
app.set('view engine', 'ejs')



const apiClass= new ContenedorArchivo("productos")
const chat= new ContenedorArchivo("chats")

app.use(expressSession({
    store: mongoStore.create({mongoUrl:"mongodb://127.0.0.1:27017/sesiones"}),
    secret:"secreto",
    resave: true,
    saveUninitialized:true,
    cookie:{maxAge:10000},
    rolling:true,
}))

app.get('/login',async (req,res)=>{
    const produc=await apiClass.getAll()
    const prueba=1
    res.render('form.ejs',{prueba,produc})
})
app.post('/login',async (req,res)=>{
    const produc=await apiClass.getAll()
    const nombre=req.body.login
    const prueba=0
    res.cookie(nombre).send("ok")
    res.render('form.ejs',{prueba,produc})
  
})

app.get("/logout",(req,res)=>{
const cookieName=req.params.login
res.clearCookie(cookieName).send(`Adios${cookieName}`)
res.redirect("/login")
})


io.on('connection',async(client) => {
    const produc=await apiClass.getAll()//guardo todos los productos y mensajes en una variable
    const messages=await chat.getAll()
    console.log("cliente se conecto")
    client.emit("messages",messages)//emito al cliente los mensajes y productos
    client.emit("products",produc)
    
    //escucho el nuevo mensaje recibido del cliente, lo guardo en una variable con el resto de los mensajes y lo emito a todos
    client.on("newMessage",async(msg)=>{
        await chat.save(msg)
        const messages=await chat.getAll()
        io.sockets.emit("messageAdded",messages)
        console.log(msg)
    })
    //escucho el nuevo producto recibido del cliente, lo guardo en una variable con el resto de los productos y lo emito a todos
    client.on("newProduct",async(pro)=>{
        await apiClass.save(pro)
        const produc=await apiClass.getAll()
        io.sockets.emit("productAdded",produc)
    })
    
  
    
 });
 server.listen(8080,(req,res)=>{
    console.log("funciona")
})