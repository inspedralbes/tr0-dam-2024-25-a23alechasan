<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getPreguntes, esborrarPregunta, afegirPregunta, editarPregunta, generarStatsFetch} from './communicationsManager'
import './estil.css'

let Preguntes = reactive({ preguntes: [] })
let Grafics = reactive([]); 
const noEditant = ref(true)
const idPreguntaEditar = ref(0)
const preguntaEditar = ref('')
const Resposta1Editar = ref('')
const Resposta2Editar = ref('')
const Resposta3Editar = ref('')
const Resposta4Editar = ref('')
const selectedEditar = ref('')

onMounted(async () => {
  const data = await getPreguntes();
  Preguntes.preguntes = data.preguntes;
})

function canviarPreguntaEditar(idPregunta) {
  idPreguntaEditar.value = idPregunta;
  noEditant.value = false;
  const preguntaActual = Preguntes.preguntes.find(p => p.id === idPregunta);
  if (preguntaActual) {
    preguntaEditar.value = preguntaActual.pregunta;
    Resposta1Editar.value = preguntaActual.respostes[0].etiqueta;
    Resposta2Editar.value = preguntaActual.respostes[1].etiqueta;
    Resposta3Editar.value = preguntaActual.respostes[2].etiqueta;
    Resposta4Editar.value = preguntaActual.respostes[3].etiqueta;
    selectedEditar.value = preguntaActual.resposta_correcta;
  }
}

async function generarStats(){
    const pngFiles = await generarStatsFetch();
    if (Array.isArray(pngFiles)) {
        Grafics.splice(0, Grafics.length, ...pngFiles);
    } else {
        console.error("No s'han rebut.");
    }
}
function enviarPreguntaEditar() {
  editarPregunta(
    idPreguntaEditar.value,
    preguntaEditar.value,
    Resposta1Editar.value,
    Resposta2Editar.value,
    Resposta3Editar.value,
    Resposta4Editar.value,
    selectedEditar.value
  );
  idPreguntaEditar.value = 0;
  noEditant.value = true;
  preguntaEditar.value = '';
  Resposta1Editar.value = '';
  Resposta2Editar.value = '';
  Resposta3Editar.value = '';
  Resposta4Editar.value = '';
  selectedEditar.value = '';
}

function tornar() {
  idPreguntaEditar.value = 0;
  noEditant.value = true;
}
</script>

<template>
  <span style="padding: 50px;">
    <h1 style="color: #28a745;">Benvingut al CRUD!</h1>
  </span>
  <span style="padding: 50px;">
    <button style="padding: 10px 20px; background-color: blue; color: #fff;border: none;border-radius: 5px;font-size: 16px;cursor: pointer; transition: background-color 0.3s ease;"
        @click="generarStats()">Stats</button>
  </span>
  <div v-if="noEditant" class="novaPregunta">
    <h1>Nova Pregunta</h1>
    <form @submit.prevent="crear">
      <label>Pregunta: </label>
      <input v-model="novaPregunta" placeholder="Pregunta">
      <br>
      <label>Resposta 1: </label>
      <input v-model="Resposta1" placeholder="Resposta 1">
      <br>
      <label>Resposta 2: </label>
      <input v-model="Resposta2" placeholder="Resposta 2">
      <br>
      <label>Resposta 3: </label>
      <input v-model="Resposta3" placeholder="Resposta 3">
      <br>
      <label>Resposta 4: </label>
      <input v-model="Resposta4" placeholder="Resposta 4">
      <br>
      <label>Resposta Correcta: </label>
      <select v-model="selected">
        <option disabled value="1">Indica la Resposta Correcta</option>
        <option value="1">Resposta 1</option>
        <option value="2">Resposta 2</option>
        <option value="3">Resposta 3</option>
        <option value="4">Resposta 4</option>
      </select>
      <br>
      <br>
      <button class="crear"
        @click="afegirPregunta(novaPregunta, Resposta1, Resposta2, Resposta3, Resposta4, selected)">Afegir
        Pregunta</button>
    </form>
  </div>
  <div v-if="noEditant" class="principal" v-for="(pregunta, index) in Preguntes.preguntes" :key="index">
    <h1>{{ pregunta.id }}. {{ pregunta.pregunta }}</h1>
    <ul>
      <li>{{ pregunta.respostes[0].etiqueta }}</li>
      <li>{{ pregunta.respostes[1].etiqueta }}</li>
      <li>{{ pregunta.respostes[2].etiqueta }}</li>
      <li>{{ pregunta.respostes[3].etiqueta }}</li>
    </ul>
    <img :src="`http://dam.inspedralbes.cat:26666${pregunta.imatge}`" alt="foto" />
    <br />
    <button class="esborrar" @click="esborrarPregunta(pregunta.id)">X</button>
    <button class="editar" @click="canviarPreguntaEditar(pregunta.id)">Editar</button>
  </div>
  <div v-else class="editarPregunta">
    <button class="tornar" @click="tornar">🠠</button>
    <h1>Editar Pregunta</h1>
    <form @submit.prevent="enviarPreguntaEditar">
      <label>Pregunta: </label>
      <input v-model="preguntaEditar" placeholder="Pregunta">
      <br>
      <label>Resposta 1: </label>
      <input v-model="Resposta1Editar" placeholder="Resposta 1">
      <br>
      <label>Resposta 2: </label>
      <input v-model="Resposta2Editar" placeholder="Resposta 2">
      <br>
      <label>Resposta 3: </label>
      <input v-model="Resposta3Editar" placeholder="Resposta 3">
      <br>
      <label>Resposta 4: </label>
      <input v-model="Resposta4Editar" placeholder="Resposta 4">
      <br>
      <label>Resposta Correcta: </label>
      <select v-model="selectedEditar">
        <option disabled value="1">Indica la Resposta Correcta</option>
        <option value="1">Resposta 1</option>
        <option value="2">Resposta 2</option>
        <option value="3">Resposta 3</option>
        <option value="4">Resposta 4</option>
      </select>
      <br>
      <br>
      <button class="editar" @click="enviarPreguntaEditar">Editar Pregunta</button>
    </form>
  </div>
  <div v-if="Grafics.length > 0">
    <div v-for="(grafic, index) in Grafics" :key="index">
        <img :src="`http://dam.inspedralbes.cat:26666/sources/Grafics/${grafic}`" alt="foto" />
    </div>
</div>
  <div v-else>
    <p>No s'han trobat gràfics</p>
  </div>
</template>