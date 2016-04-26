/**
 * Created by master on 16/04/2016.
 */

var miapp = angular.module("pec02_p7", []);

miapp.controller('MainController', ['$http', function($http) {
    //Buena practica: utilizamos self en lugar de this
    var self = this;

    //Iniciamos las variables para el contenido y caracteristicas de las preguntas
    //al cargar el json se les estableceran los valores reales
    self.listado = null;
    self.preguntaActual = 0;
    self.numPreguntas = -1;
    self.respuestas = null;
    self.textoPreguntaActual = "";
    self.respuestaSeleccionada = "";
    self.terminado = false;
    self.empezado = false;
    self.acertadas = 0;
    self.puntuacion = 0;
    self.archivoPreguntas="";

    //****************************************
    //Carga el archivo y hace que comience el test
    //****************************************
    self.cargarArchivo = function() {
        //Cargamos el json
        $http.get('data/' + self.archivoPreguntas).then(function (response) {
            //Obtenemos los elementos contenidos en la raiz del json
            self.listado = response.data.preguntas;
            self.numPreguntas = self.listado.length;
            self.empezado = true;
            //Comenzamos el cuestionario
            self.comenzar();

        }, function (errResponse) {
            //Si falla la carga del json, se avisa en un alert
            alert('No se han podido cargar los datos');
        });
    };

    
    //****************************************
    //Muestra la pregunta cuyo numero recibe como parametro
    //****************************************
    self.mostrarPregunta = function(numpregunta){
        //Comprobamos que el numero de pregunta este dentro de los limites
        if(self.numPreguntas>0 && numpregunta<self.numPreguntas) {
            //Ponemos el enunciado de la pregunta
            self.textoPreguntaActual=self.listado[numpregunta].enunciado;
            //Cogemos la respuesta seleccionada del array de respuestas. Esto se aplicara cuando
            //volvamos atras en el cuestionario, de forma que quede marcada la pregunta que se habia
            //seleccionado en su momneto
            self.respuestaSeleccionada=self.respuestas[numpregunta];

            //Para depuracion
            //console.log(self.listado[numpregunta].enunciado);
        }
    };


    //****************************************
    //Muestra la siguiente pregunta del cuestionario cuando se presiona el boton siguiente
    //****************************************
    self.siguientePregunta = function(){
        //Para depuracion
        //console.log("respuesta seleccionada: "+self.respuestaSeleccionada);
        //console.log("Comprobación: "+ angular.isUndefined(self.respuestaSeleccionada) || self.respuestaSeleccionada === null);

        //Comprobamos que no sea la ultima pregunta
        if(self.preguntaActual < self.numPreguntas-1){
            //Almacenamos la respuesta en el array
            self.respuestas[self.preguntaActual]=self.respuestaSeleccionada;
            //Mostramos la pregunta siguiente
            self.mostrarPregunta(++self.preguntaActual);
        }
    };


    //****************************************
    //Muestra la pregunta anterior del cuestionario cuando se pulsa el boton anterior
    //****************************************
    self.anteriorPregunta = function(){
        //Comprobamos que no sea la primera pregunta
        if(self.preguntaActual > 0){
            //Almacenamos la respuesta seleccionada. El usuario podra cambiar las respuestas tambien
            //cuando navegue hacia atras
            self.respuestas[self.preguntaActual]=self.respuestaSeleccionada;
            //Mostramos la pregunta anterior
            self.mostrarPregunta(--self.preguntaActual);
        }
    };

    //****************************************
    //Devuelve verdadero si no se ha seleccionado ninguna respuesta
    //****************************************
    self.noHayRespuesta = function(){
        return angular.isUndefined(self.respuestaSeleccionada) || self.respuestaSeleccionada === null;
    };


    //****************************************
    //Devuelve verdadero si es la ultima pregunta
    //****************************************
    self.ultimaPregunta = function(){
        return self.preguntaActual == self.numPreguntas - 1;
    };


    //****************************************
    //Almacena los resultados al terminar el cuestionar
    //****************************************
    self.terminar = function(){
        //Almacenamos la respuesta de la ultima pregunta
        self.respuestas[self.preguntaActual]=self.respuestaSeleccionada;
        //Recorremos el array de respuestas y sumamos las acertadas
        for (var i=0; i<self.numPreguntas; i++) {
            if(self.respuestas[i] == self.listado[i].respuesta){
                self.acertadas++;
            }
        }
        //Obtenemos la puntuacion, redondeando a 2 decimales
        self.puntuacion=Math.round(((10/self.numPreguntas)*self.acertadas) * 100) / 100;
        //Marcamos que el test ha terminado
        self.terminado = true;
    };


    //****************************************
    //Prepara el test para comenzar cuando se carga el archivo
    //****************************************
    self.comenzar = function(){
        //Establecemos todas las variables necesarias con el valor inicial
        self.puntuacion = 0;
        self.acertadas = 0;
        self.preguntaActual = 0;
        //Iniciamos el array de respuestas
        self.respuestas = new Array(self.numPreguntas);
        //Mostramos la primera pregunta
        self.mostrarPregunta(self.preguntaActual);
    };


    //****************************************
    //Prepara el test para comenzar de nuevo cuando se pulsa el boton de volver a empezar
    //****************************************
    self.reiniciar = function(){
        self.terminado = false;
        self.empezado = false;
    };


    //****************************************
    //Devuelve veradero cuando deben mostrarse las preguntas
    //****************************************
    self.muestraPregunta = function(){
      return !self.terminado && self.empezado;
    };

}]);

