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
    self.preguntaActual = -1;
    self.numPreguntas = -1;
    self.respuestas = null;
    self.textoPreguntaActual = "";
    self.respuestaSeleccionada = "";
    self.terminado = false;
    self.acertadas = 0;
    self.puntuacion = 0;

    //Cargamos el json
    $http.get('listado.json').then(function (response) {
        //Obtenemos los elementos contenidos en la raiz del json, llamada listado
        self.listado = response.data;
        self.numPreguntas = self.listado.length;
        //self.preguntaActual = 0;
        //
        ////Iniciamos el array de respuestas
        //self.respuestas = new Array(self.numPreguntas);
        //
        ////Mostramos la primera pregunta
        //self.mostrarPregunta(self.preguntaActual);

        self.recomenzar();

        ////Recorremos los elementos del listado
        //for (var elemento in self.listado) {
        //    //Para cada elemento del listado añadimos un dt para el titulo y un dd para el detalle
        //    var obj = self.listado[elemento];
        //    $("#lista").append("<dt class='text-success'>"+ obj.titulo+"</dt>", "");
        //    $("#lista").append("<dd class='text-info'>"+ obj.detalle+"</dd>", "");
        //}


    }, function (errResponse) {
        //Si falla la carga del json, se avisa en un alert
        alert('No se han podido cargar los datos');
    });

    self.mostrarPregunta = function(numpregunta){
        if(self.numPreguntas>0 && numpregunta<self.numPreguntas) {
            self.textoPreguntaActual=self.listado[numpregunta].pregunta;
            self.respuestaSeleccionada=self.respuestas[numpregunta];
            console.log(self.listado[numpregunta].pregunta);
        }
    };

    self.siguientePregunta = function(){
        console.log("respuesta seleccionada: "+self.respuestaSeleccionada);
        console.log("Comprobación: "+ angular.isUndefined(self.respuestaSeleccionada) || self.respuestaSeleccionada === null);
        if(self.preguntaActual < self.numPreguntas-1){
            self.respuestas[self.preguntaActual]=self.respuestaSeleccionada;
            self.mostrarPregunta(++self.preguntaActual);
        }
    };

    self.anteriorPregunta = function(){
        if(self.preguntaActual > 0){
            self.respuestas[self.preguntaActual]=self.respuestaSeleccionada;
            self.mostrarPregunta(--self.preguntaActual);
        }
    };

    self.noHayRespuesta = function(){
        return angular.isUndefined(self.respuestaSeleccionada) || self.respuestaSeleccionada === null;
    };

    self.ultimaPregunta = function(){
        return self.preguntaActual == self.numPreguntas - 1;
    };

    self.terminar = function(){
        self.respuestas[self.preguntaActual]=self.respuestaSeleccionada;
        for (var i=0; i<self.numPreguntas; i++) {
            if(self.respuestas[i] == self.listado[i].respuesta){
                self.acertadas++;
            }
        }
        self.puntuacion=Math.round(((10/self.numPreguntas)*self.acertadas) * 100) / 100;
        self.terminado = true;
    };

    self.recomenzar = function(){
        self.terminado = false;
        self.puntuacion = 0;
        self.acertadas = 0;
        self.preguntaActual = 0;

        //Iniciamos el array de respuestas
        self.respuestas = new Array(self.numPreguntas);

        //Mostramos la primera pregunta
        self.mostrarPregunta(self.preguntaActual);
    }



}]);

