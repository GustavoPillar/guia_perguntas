const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

connection
    .authenticate()
    .then(() =>{
        console.log("Conexão feita com  banco de dados!");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, resp) => {
    Pergunta.findAll({raw: true, order: [
        ['id', 'DESC']
    ]}).then(perguntas => {
        resp.render("index", {
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req, resp) => {
    resp.render("perguntar");
});

app.post("/salvarpergunta", (req, resp) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        resp.redirect("/");
    });
});

app.get("/pergunta/:id", (req, resp) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if (pergunta != undefined){
            
            Resposta.findAll({
                where: {id_pergunta: id},
                order: [['id', 'DESC']]
            }).then(respostas => {
                resp.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }  else {            
            resp.redirect("/");
        }
    });    
});

app.post("/responder", (req, resp) =>{
    var corpo = req.body.corpo;
    var id_pergunta = req.body.id_pergunta;
    console.log(corpo);
    Resposta.create({
        corpo: corpo,
        id_pergunta: id_pergunta
    }).then(() => {
        resp.redirect("/pergunta/" + id_pergunta);
    });
});

app.listen(8080, () => {console.log("App rodando!");});
