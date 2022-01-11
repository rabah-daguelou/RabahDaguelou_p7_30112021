
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const helmet=require('helmet');
require('dotenv').config();
const path=require('path');
const cors=require('cors');


app.use(helmet()); 
app.use(cors());

app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");
const commentsRoutes= require ("./routes/comments");
const likes_deslikesRoutes= require ("./routes/likes_deslikes");

app.use("/api/auth", usersRoutes);
app.use("/api", usersRoutes);
app.use("/api", postsRoutes);
app.use("/api", commentsRoutes);
app.use("/api", likes_deslikesRoutes)

app.use(express.static(path.join(__dirname,'images')));
//app.use('./images', express.static(path.join(__dirname,'images')));
//app.use('../frontend/images', express.static(path.join(__dirname,'../frontend/images')));

module.exports=app;