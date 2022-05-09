'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

// el executor viene a representar el function (resolve, reject)
// Acá se define la primer instancia de la promesa.
function $Promise(executor) {

if(typeof executor !== 'function') throw new TypeError('executor function')

// si no es una funcion tiene que tirar un error, ya que lo especifica el test.
// la promesa inicialmente va a tener un valor de pending

this._state = 'pending';
this._handlerGroups = [];

executor(this._internalResolve.bind(this), this._internalReject.bind(this)) // se puede bindear o hacer con funcion flecha

}

$Promise.prototype._internalResolve = function (value) {
   if(this._state === 'pending') { //establecemos esto para que solo se realice el cambio si esta en pending, ya que en otro estado no se puede.
    this._state = 'fullfiled'
    this._value = value
    this._callHandlers();
   }
}

$Promise.prototype._internalReject = function (value) {
  if(this._state === 'pending') { 
    this._state = 'rejected'
    this._value = value
    this._callHandlers()
  }
}

$Promise.prototype.then = function (successCb, errorCb) {
  if(typeof successCb !== 'function') successCb = false;
  if(typeof errorCb !== 'function') errorCb = false;
  const downstreamPromise = new Promise(function() {})
    this._handlerGroups.push({successCb, errorCb, downstreamPromise})
    if(this._state !== 'pending') this._callHandlers()
    return downstreamPromise;
}

$Promise.prototype._callHandlers = function () {
    while(this._handlerGroups > 0) {
        let current = this._handlerGroups.shift();
        if(this._state === 'fulfilled') {
          if(!current.successCb) {
            current.downstreamPromise._internalResolve(this._value)
          } else {
            try {
              const result = current.successCb(this._value) 
              if(result instanceof $Promise) {
                result.then(value => current.downstreamPromise._internalResolve(value), 
                err => current.downstreamPromise._internalReject(err));
              } else {
                current.downstreamPromise._internalResolve(result);
              }
            } catch(e) {
            current.downstreamPromise._internalReject(e);
          }
        }
          //  current.successCb && current.successCb(this._value);
        } else if (this._state === 'rejected') {
          if(!current.errorCb) {
            current.downstreamPromise._internalReject(this._value)
          } else {
            try {
              const result = current.errorCb(this._value);
              if(result instanceof $Promise) {
                result.then(value => current.downstreamPromise._internalResolve(value), 
                err => current.downstreamPromise._internalReject(err));
              } else {
                current.downstreamPromise._internalResolve(result)
              }
            } catch(e) {
              current.downstreamPromise._internalReject(e)
            } 
          }
           current.errorCb && current.errorcb(this._value)
        }
    }
}



module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/