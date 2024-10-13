import Preguntes from './App.vue';
import Grafics from './App.vue';

export async function getPreguntes() {
  const response = await fetch(`http://dam.inspedralbes.cat:26666/CRUD`, { method: 'GET' });
  const data = await response.json();
  return data;
}


export async function esborrarPregunta(idPregunta) {
  const response = await fetch(`http://dam.inspedralbes.cat:26666/CRUD?idPregunta=${idPregunta}`, { method: 'DELETE' });
  const data = await response.json();
  if (data.preguntes) {
    Preguntes.preguntes = data.preguntes;
  }
  location.reload();
}

export async function afegirPregunta(textPregunta, resposta1, resposta2, resposta3, resposta4, respostaCorrecta) {
  const response = await fetch(`http://dam.inspedralbes.cat:26666/CRUD?pregunta=${textPregunta}&resposta1=${resposta1}&resposta2=${resposta2}&resposta3=${resposta3}&resposta4=${resposta4}&respostaCorrecta=${respostaCorrecta}`, { method: 'POST' });
  const data = await response.json();
  if (data.preguntes) {
    Preguntes.preguntes = data.preguntes;
  }
  location.reload();
}

export async function generarStatsFetch() {
  const response = await fetch(`http://dam.inspedralbes.cat:26666/stats`, { method: 'GET' });
  const pngFiles = await response.json();
  return pngFiles;
}

export async function editarPregunta(idPregunta, textPregunta, resposta1, resposta2, resposta3, resposta4, respostaCorrecta) {
  const response = await fetch(`http://dam.inspedralbes.cat:26666/CRUD?idPregunta=${idPregunta}&pregunta=${textPregunta}&resposta1=${resposta1}&resposta2=${resposta2}&resposta3=${resposta3}&resposta4=${resposta4}&respostaCorrecta=${respostaCorrecta}`, { method: 'PUT' });
  const data = await response.json();
  if (data.preguntes) {
    Preguntes.preguntes = data.preguntes;
  }
  location.reload();
}