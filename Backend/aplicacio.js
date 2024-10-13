const express = require('express')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 26667;
let mySession = [];
let JSONQuiz = {};

//convertir el json a un objecte per treballar amb ell
fs.readFile('./sources/Preguntes.json', function (err, data) {
    if (err) { throw err; }
    JSONQuiz = JSON.parse(data);
    //console.log(JSONQuiz);
});

app.post("/getXPreguntes", (req, res) => {

    //creo la session si no exiteix, o la recupero si exiteix.
    var sessionId = getMySessionId(req.query["sessionId"]);

    //recupero la meva sessio de l'array de session 
    obj = mySession[sessionId];

    //Modifico la sessio si es necessari
    obj.sessionId = sessionId;

    //Agafo les dades
    if (obj.num == 0) {
		if (req.query.num) {
			obj.num = Math.min(req.query.num, JSONQuiz.preguntes.length);
			i = 0;
			numerosEscollits = [];
			while (i < obj.num) {
				index = Math.floor(Math.random() * JSONQuiz.preguntes.length);
				if (!numerosEscollits.includes(index)) {
					obj.quizs[i] = {id: 0, pregunta: "", respostes: [], imatge: ""};
                    obj.quizs[i].id = JSONQuiz.preguntes[index].id;
					obj.quizs[i].pregunta = JSONQuiz.preguntes[index].pregunta;
					for (const resposta of JSONQuiz.preguntes[index].respostes) {
						obj.quizs[i].respostes.push({ id: resposta.id, etiqueta: resposta.etiqueta });
					}
					obj.quizs[i].imatge = "./sources/Imatges/" + JSONQuiz.preguntes[index].imatge;
					i++;
					numerosEscollits.push(index);
				}
			}
		}
	}

    //torno a guarda la meva informació dintre de l'array de sesssion 
    //dintre de la meva (sessionId)
    mySession[sessionId] = obj;

    //Converteixo l'objecte en String i l'ensenyo
    json_obj = JSON.stringify(obj)

    res.send(json_obj);

});

app.post("/finalista", (req, res) => {

    //creo la session si no exiteix, o la recupero si exiteix.
    var sessionId = getMySessionId(req.query["sessionId"]);

    //recupero la meva sessio de l'array de session 
    obj = mySession[sessionId];

    //Modifico la sessio si es necessari
    obj.sessionId = sessionId;

    //agafo la query de respostes i el converteixo en array normal per guardar-lo al usuari
    if (obj.respostesUsuari.length === 0) {
        if (req.query.id) {
            obj.respostesUsuari = JSON.parse(req.query.id);
            console.log(obj.respostesUsuari);
        }
        //console.log(JSONQuiz);
        //comprovo si les respostes son correctes
        obj.resultats.total = obj.quizs.length;
        for (let i = 0; i < obj.respostesUsuari.length; i++) {
            const quiz = obj.quizs[i];
            const matchingQuestion = JSONQuiz.preguntes.find(pregunta => pregunta.pregunta === quiz.pregunta);
            if (matchingQuestion && obj.respostesUsuari[i] == matchingQuestion.resposta_correcta) {
                obj.resultats.success++;
            }
        }
        
    }

        //torno a guarda la meva informació dintre de l'array de sesssion 
        //dintre de la meva (sessionId)
        mySession[sessionId] = obj;

        //Ensenyo els resultats
        resultats = []
        resultats = obj.resultats
        
        escriureUnFitxerDiferent(resultats, obj.sessionId)
        json_obj = JSON.stringify(resultats)
        res.send(json_obj);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


function getMySessionId(sessionId) {
    if (!sessionId) {
        sessionId = uuidv4();
        let obj = {};
        obj.sessionId = sessionId;
        obj.num = 0;
        obj.quizs = [{}];
        obj.respostesUsuari = [];
        mySession[sessionId] = obj;
        obj.resultats = {
            success: 0,
            total: 0
        };
    }

    return sessionId;

}

const d = new Date();
const avui = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

function escriureUnFitxerDiferent(dadesAEscriure, nomFitxer) {
    const directori = `./partides/${avui}`;
    if (fs.existsSync(directori)) {
        dadesAEscriure = JSON.stringify(dadesAEscriure);
        const fitxerAEscriure = `${directori}/${nomFitxer}.json`;
        fs.writeFile(fitxerAEscriure, dadesAEscriure, function (err) {
            if (err) { throw err; }
            console.log("Fitxer escrit correctament");
        });
    } else {
        fs.mkdirSync(directori, { recursive: true });
        dadesAEscriure = JSON.stringify(dadesAEscriure);
        const fitxerAEscriure = `${directori}/${nomFitxer}.json`;
        fs.writeFile(fitxerAEscriure, dadesAEscriure, function (err) {
            if (err) { throw err; }
            console.log("Fitxer escrit correctament");
        });
    }
}