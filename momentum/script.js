//Images
const images = [
    'url("./assets/images/night/01.jpg")',
    'url("./assets/images/night/02.jpg")',
    'url("./assets/images/night/03.jpg")',
    'url("./assets/images/night/04.jpg")',
    'url("./assets/images/night/05.jpg")',
    'url("./assets/images/night/06.jpg")',
    'url("./assets/images/morning/01.jpg")',
    'url("./assets/images/morning/02.jpg")',
    'url("./assets/images/morning/03.jpg")',
    'url("./assets/images/morning/04.jpg")',
    'url("./assets/images/morning/05.jpg")',
    'url("./assets/images/morning/06.jpg")',
    'url("./assets/images/day/01.jpg")',
    'url("./assets/images/day/02.jpg")',
    'url("./assets/images/day/03.jpg")',
    'url("./assets/images/day/04.jpg")',
    'url("./assets/images/day/05.jpg")',
    'url("./assets/images/day/06.jpg")',
    'url("./assets/images/evening/01.jpg")',
    'url("./assets/images/evening/02.jpg")',
    'url("./assets/images/evening/03.jpg")',
    'url("./assets/images/evening/04.jpg")',
    'url("./assets/images/evening/05.jpg")',
    'url("./assets/images/evening/06.jpg")',
  ];

// DOM Elements
const time = document.querySelector(".time");
const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const focus = document.querySelector(".focus");
const changeImageButton = document.getElementById("changeImageButton");
const changeJokeButton = document.getElementById("changeJokeButton");
const jokeDiv = document.getElementById('jokeDiv');
const cityInput = document.getElementById('cityInput');
const wetherBlock = document.getElementById('wetherBlock');

// Options
const showAmPm = true;

// Show Time
function showTime() {
  const dayNames = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];

  const monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  let today = new Date();
  let hour = today.getHours();
  let min = today.getMinutes();
  let sec = today.getSeconds();

  let day = dayNames[today.getDay()];
  let date = today.getDate();
  let month = monthNames[today.getMonth()];

  // Output Time
  time.innerHTML = `
  ${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}
  </br>
  ${day}
  ${date}
  ${month}`;

  setTimeout(() => {
    showTime();
    setBgGreet(false);
  }, 1000);
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

// Set Background and Greeting
function setBgGreet(isManual) {
  const today = new Date();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();

  if (isManual) {
    const currentBg = document.body.style.backgroundImage;
    const indexOfCurrentBg = images.indexOf(currentBg);
    const nextBg = images[(indexOfCurrentBg + 1) % 24];
    document.body.style.backgroundImage = nextBg;
    return;
  }

  const isBgExust = document.body.style.backgroundImage;
  const isNewHourStarted = minutes % 60 === 0 && seconds % 60 === 0;
  if (!isBgExust || isNewHourStarted) {
    hour = today.getHours();
    document.body.style.backgroundImage = images[hour % 24];

    if (hour < 6) {
      // Night
      greeting.textContent = "Good Night, ";
      document.body.style.color = "white";
    } else if (hour < 12) {
      // Morning
      document.body.style.color = "black";
      greeting.textContent = "Good Morning, ";
    } else if (hour < 18) {
      // Afternoon
      greeting.textContent = "Good Afternoon, ";
      document.body.style.color = "black";
    } else {
      // Evening
      greeting.textContent = "Good Evening, ";
      document.body.style.color = "white";
    }
  }

}

// Get Name
function getName() {
  if (localStorage.getItem("name") === null) {
    name.textContent = "[Enter Name]";
  } else {
    name.textContent = localStorage.getItem("name");
  }
}

// Set Name
function setName(e) {
  if (e.type === "focus") {
    e.target.innerText = '';
  }

  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if (e.target.innerText === '') {
        e.target.innerText = localStorage.getItem("name") || "[Enter Name]";
      }

      localStorage.setItem("name", e.target.innerText);
      name.blur();
    }
  }

  if (e.type === "blur") {
    if (e.target.innerText === '') {
      e.target.innerText = localStorage.getItem("name");
    }
    localStorage.setItem("name", e.target.innerText);
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem("focus") === null) {
    focus.textContent = "[Enter Focus]";
  } else {
    focus.textContent = localStorage.getItem("focus");
  }
}

// Set Focus
function setFocus(e) {
  if (e.type === "focus") {
    e.target.innerText = '';
  }

  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if (e.target.innerText === '') {
        e.target.innerText = localStorage.getItem("focus") || "[Enter Focus]";
      }

      localStorage.setItem("focus", e.target.innerText);
      focus.blur();
    }
  }

  if (e.type === "blur") {
    if (e.target.innerText === '') {
      e.target.innerText = localStorage.getItem("focus");
    }
    localStorage.setItem("focus", e.target.innerText);
  }
}

function getCity() {
  if (localStorage.getItem("city") === null) {
    cityInput.value = "Минск";
  } else {
    cityInput.value = localStorage.getItem("city");
  }
}

async function onChangeCity({ target }) {
  if (!target.value) return;
  localStorage.setItem("city", target.value);
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${target.value}&lang=ru&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.main.temp, data.main.humidity, data.wind.speed, data.weather[0].icon);
    wetherBlock.innerHTML = `
    <img className="TemperatureIMG" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" />
    <p>Temperature: ${data.main.temp}</p>
    <p>Humidity: ${data.main.humidity}</p>
    <p>WindSpeed: ${data.wind.speed}</p>
    `;
  } catch (e) {
    wetherBlock.innerHTML = 'incorrect data';
    console.log(e);
  }
}

async function changeJoke() {
  const data = await fetch('https://geek-jokes.sameerkumar.website/api?format=json');
  const rawJoke = await data.json();
  const joke = rawJoke.joke;
  jokeDiv.innerText = joke;
}

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
name.addEventListener("focus", setName);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);
focus.addEventListener("focus", setFocus);
changeImageButton.addEventListener("click", () => setBgGreet(true));
changeJokeButton.addEventListener("click", changeJoke);
cityInput.addEventListener("change", onChangeCity);


// Run
showTime();
setBgGreet(false);
getName();
getFocus();
changeJoke();
getCity();
onChangeCity({ target: { value : cityInput.value } });
