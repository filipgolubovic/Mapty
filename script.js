'use strict';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'Jun',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;

//////Classes//////

//Workout Class
class Workout {
  date = new Date();
  id = new Date().getTime().toString(36);
  constructor(coords, distance, duration) {
    this.coords = coords; //cordinates[lat,lng]
    this.distance = distance; //in km
    this.duration = duration; // in min
  }
}
///Running Class
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calculatePace();
  }

  calculatePace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
//Cycling Class
class Cycling extends Workout {
  constructor(coords, distance, duration, cadence, elevationGain) {
    super(coords, distance, duration, cadence);
    this.elevationGain = elevationGain;
  }
  calculateSpeed() {
    const durationInHours = this.duration / 60;
    this.speed = this.distance / durationInHours;
    return this.speed;
  }
}

const run1 = new Running([88, -25], 5.2, 28, 189);
const cycle1 = new Cycling([88, -25], 27, 95, 523, 12);
console.log(run1, cycle1);

////////////////////////////////////////////////
////// APPLICATION ARCHITECTURE ////////////////
class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleEvlevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Ne mozemo pronaci Vasu lokaciju!');
        }
      );
    }
  }

  _loadMap(position) {
    //leaflet
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const cordinates = [latitude, longitude];
    this.#map = L.map('map').setView(cordinates, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleEvlevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    const { lat, lng } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();
