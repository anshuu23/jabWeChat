const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const staticRouter = require("./routes/staticRouter")
const userRouter = require("./routes/userRouter")
const mainRouter = require("./routes/mainRouter")
const roomRouter = require("./routes/roomRouter")
const {Server} = require("socket.io")
const http = require("http")
const { checkAuth , restrictTo } = require("./middlewares/auth")
const server = http.createServer(app)
const io = new Server(server);

app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.use(checkAuth)

//mongo db connection
mongoose.connect(process.env.MONGODBURL).then(()=>console.log("connected to mongodb"))


app.set("view engine" , "ejs")
app.set("views" , "views")

app.use("/user" , userRouter)
app.use("/main" , mainRouter)
app.use("/room",restrictTo(["standard"]), roomRouter)
app.use('/' , staticRouter)


io.on("connection" , (socket)=>{
    console.log("someone connected")
})

const PORT = process.env.PORT
server.listen( PORT , ()=>{
    console.log(`server is running on ${PORT}`)
})