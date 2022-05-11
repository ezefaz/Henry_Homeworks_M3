// const bodyParser = require("body-parser");
const express = require("express");
const res = require("express/lib/response");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

// TODO: your code to handle requests
const PATH = '/posts';
let id = 1;

// server.METHOD(URL, (req, resp, next) => {})

server.post(PATH, (req, res) => {
    const { author, title, contents } = req.body;
    if(!author || !title || !contents) {
        return res.status(STATUS_USER_ERROR).json({
            error: "No se recibieron los datos para hacer la solicitud"
        });
    }  else {
        const post = { author, title, contents, id: id++}
        posts.push(post);
        return res.status(200).json(post)
    }
})

server.post('/posts/author/:author', (req, res) => { 
    const { title, contents } = req.body;
    const { author } = req.params;
    if(!title || !author || !contents) {
        res.status(STATUS_USER_ERROR).json({
        error: "No se recibieron los datos para hacer la solicitud"
    });
} else {
    const post = { author, title, contents, id: id++}
    posts.push(post)
    res.status(200).json(post)
}
})

server.get(PATH, (req, res) => {
    const { term } = req.query;
    if(term) {
        let newArray = [];
        posts.forEach((post) => {
            if(post.title.includes(term) || post.contents.includes(term)) {
                newArray.push(post);
            }
        })
        res.status(200).json(newArray);
    } else {
        res.status(200).json(posts);
    }
})

server.get('/posts/:author', (req, res) => {
    const { author } = req.params;
    let newArray = posts.filter((post) => post.author === author)
    if(newArray.length > 0) 
    return res.status(200).json(newArray);
    else return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"})
})

server.get('/posts/:author/:title', (req, res) => {
    const { author, title } = req.params;
     let newArray = posts.filter((post) => {
         if(post.author === author && post.title === title){
            return post
         }
    })
    if(newArray.length > 0) {
        return res.status(200).json(newArray)
    } else {
        return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"})
    }
})

server.put(PATH, (req, res) => {
    const { id, title, contents } = req.body;
    if(!id || !title || !contents) {
        return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"})
    }
    let postFound = posts.find((post) => post.id === id) 
    if(postFound) {
        postFound.title = title;
        postFound.contents = contents;
        res.status(200).json(postFound);
    } else {
        res.status(STATUS_USER_ERROR).json({error: "El ID indicado no corresponde con el post existente"})
    }
})

server.delete(PATH, (req, res) => {
    const { id } = req.body;
    if(!id) {
        return res.status(STATUS_USER_ERROR).json({error: "El ID indicado no existe"})
    } 
    let postFound = posts.find((post) => post.id === id)
    if(!postFound) {
        return res.status(STATUS_USER_ERROR).json({error: "El ID indicado no existe"})
    } else {
        posts.forEach((post, index) => {
            if(post.id === id) {
                post.splice(index, 1)
            }
        })
        return res.status(200).json({ success: true })
    }
})

server.delete(PATH, (req, res) => {
    const { author } = req.body;
    if(!author) {
        return res.status(STATUS_USER_ERROR).json({error: "El autor indicado no existe"})
    } 
    let postFound = posts.find((post) => post.author === author)
    if(!postFound) {
        return res.status(STATUS_USER_ERROR).json({error: "El autor indicado no existe"})
    } else {
        let postArray = posts.filter((post) => post.author === author);
        posts.forEach((post, index) => {
            if(post.author === author) {
                post.splice(index, 1)
            }
        })
        res.status(200).json(postArray)
    }
})

module.exports = { posts, server };
