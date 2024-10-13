
/*<--------------| CRUD |---------------> */
const express = require('express')
const fs = require('fs')
const cors = require('cors');
const path = require('path');
const { spawn } = require("child_process");

const app = express();
const port = 26666;
let JSONQuiz = {};

app.use('/sources', express.static(path.join(__dirname, 'sources')))
app.use('/sources/Grafics', express.static(path.join(__dirname, 'sources/Grafics')));
app.use(cors());

fs.readFile('./sources/Preguntes.json', function (err, data) {
    if (err) { throw err; }
    JSONQuiz = JSON.parse(data);
});

app.get("/CRUD", (req, res) => {
    res.json(JSONQuiz);
});

app.get("/stats", (req, res) => {
    const pathScript = path.join(__dirname, "scriptsPython", "mitjanaEncerts.py");
    const pythonProcess = spawn("python3", [pathScript]);

    pythonProcess.on("close", (code) => {
        const graficsDir = path.join(__dirname, "sources", "Grafics");
        fs.readdir(graficsDir, (err, files) => {

            const pngFiles = files.filter(file => file.endsWith('.png'));

			console.log(pngFiles);

            res.json(pngFiles);
        });
    });
});


app.delete("/CRUD", (req, res) => {
    const idPreguntaEliminar = Number(req.query.idPregunta);
    JSONQuiz.preguntes = JSONQuiz.preguntes.filter(pregunta => pregunta.id !== idPreguntaEliminar);
    escriureUnFitxer('./sources/Preguntes.json', JSONQuiz);
    res.json(JSONQuiz);
});



app.post("/CRUD", (req, res) => {
	idNovaPregunta = JSONQuiz.preguntes[JSONQuiz.preguntes.length - 1].id + 1
	preguntaNova = {
		id: idNovaPregunta,
		pregunta: req.query.pregunta,
		respostes: [
			{
				id: 1,
				etiqueta: req.query.resposta1
			},
			{
				id: 2,
				etiqueta: req.query.resposta2
			},
			{
				id: 3,
				etiqueta: req.query.resposta3
			},
			{
				id: 4,
				etiqueta: req.query.resposta4
			}
		],
		resposta_correcta: Number(req.query.respostaCorrecta),
		imatge: `/sources/Imatges/pregunta_${idNovaPregunta}.jpg`
	};
	//afegirImatge(`/sources/Imatges/pregunta_${idNovaPregunta}`, req.query.imatge);
	JSONQuiz.preguntes.push(preguntaNova);
	escriureUnFitxer('./sources/Preguntes.json', JSONQuiz);
    res.json(JSONQuiz);
});

app.put("/CRUD", (req, res) => {
	const idPregunta = Number(req.query.idPregunta);
	for (const pregunta of JSONQuiz.preguntes) {
		if (pregunta.id == idPregunta) {
			pregunta.pregunta = req.query.pregunta;
			pregunta.respostes[0].etiqueta = req.query.resposta1;
			pregunta.respostes[1].etiqueta = req.query.resposta2;
			pregunta.respostes[2].etiqueta = req.query.resposta3;
			pregunta.respostes[3].etiqueta = req.query.resposta4;
			pregunta.resposta_correcta = Number(req.query.respostaCorrecta);
		}
	}
	escriureUnFitxer('./sources/Preguntes.json', JSONQuiz);
    res.json(JSONQuiz);
});

/* 
escriureUnFitxerDiferent(dades, dades.sessionId);
escriureUnFitxer("respostaUsuari.json", dades); 
*/

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

/*<--------------| Gestió de fitxers |---------------> */


function llegirUnFitxer(fitxerALlegir) {
	fs.readFile(fitxerALlegir, function (err, data) {
		if (err) { throw err };
		const dades = JSON.parse(data);
		console.log(dades)
	})
}

function afegirImatge(path, Imatge) {
	fs.writeFile(path, Imatge, function (err, data) {
		if (err) { throw err };
		console.log("imatge afegida");
	})
}

function escriureUnFitxer(fitxerAEscriure, dadesAEscriure) {
	dadesAEscriure = JSON.stringify(dadesAEscriure);
	fs.writeFile(fitxerAEscriure, dadesAEscriure, function (err, data) {
		if (err) { throw err };
		console.log("esborrat");
	})
}
