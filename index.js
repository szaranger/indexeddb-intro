'use strict';

var idbSupported = false;
var db;

document.addEventListener("DOMContentLoaded", function(){

  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

  if (!window.indexedDB) {
    console.info('Your browser does not support a stable version of IndexedDB.');
  } else {
    idbSupported = true;
    console.info('IndexedDB is supported');
  }

  if(idbSupported) {
    var openRequest = indexedDB.open('vehicles', 2);

    openRequest.onupgradeneeded = function(event) {
        var store = event.target.result;

        console.log("Upgrading IndexedDB");
        if(!store.objectStoreNames.contains("vehicles")) {
            store.createObjectStore("vehicles");
        }
    }

    openRequest.onsuccess = function(event) {
        console.log("Success!");

        var store = event.target.result;

        var vehicles = [
          { id: '01', make: 'BMW', brand: 'X5', doors: 5 },
          { id: '02', make: 'Audi', brand: 'A5', doors: 5 }
        ];

        vehicles.forEach(function(vehicle, index) {
          add(store, 'vehicles', vehicle, index);
        });
    }

    openRequest.onerror = function(event) {
        console.log("Error");
        console.dir(event);
    }
  }
}, false);

function add(store, name, entry, index) {
   var transaction = store.transaction([name], 'readwrite');
   var objectStore = transaction.objectStore(name);
   var request = objectStore.add(entry, index);

   request.onsuccess = function(event) {
      console.log('%s has been added to IndexedDB', name);
   };

   request.onerror = function(event) {
      console.log("Unable to add %s\r\nIt already exists in IndexedDB! ");
   }
}
