const Board = document.getElementById('container');
const Start = document.getElementById('start');
const Deck  = document.getElementsByClassName('.card');

const Areas = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];

Start.addEventListener('click',propogate);

propogate = function () {
  let mixedAreas = Shuffler.shuff(Areas);
  for (i in Deck) {
    i.setAttribute('grid-area',mixedAreas.shift());
  }
};

const Shuffler = require('./shuff.js');
