const api_Key = "028907affaded5fff925cf5c42c8a4ea";
window.addEventListener("load", () => {
  getWeatherByCityName("New Delhi");
  updateRecentCitiesDropdown();
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const cityValue = document.getElementById("cityInput");
  const cityInput = cityValue.value.trim();
  if (!cityInput) {
    alert("Please Enter a city name");
  } else {
    getWeatherByCityName(cityInput);
    addRecentCity(cityInput);
  }
});
document.getElementById("locationBtn").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeatherBylocation(latitude, longitude);
  });
});
document.getElementById("recentDropdown").addEventListener("change", () => {
  const cityInput = document.getElementById("recentDropdown").value;
  if (cityInput) {
    getWeatherByCityName(cityInput);
  }
});

async function getWeatherByCityName(cityInput) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${api_Key}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${api_Key}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();
    displayWeatherData(data);
    displayForecastData(forecastData);
  } catch (error) {
    console.log(error);
  }
}
async function getWeatherBylocation(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_Key}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${api_Key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();
    displayWeatherData(data);
    displayForecastData(forecastData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function displayWeatherData(data) {
  document.getElementById("cityName").innerText = data.name;
  document.getElementById(
    "cityIcon"
  ).innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt='${data.weather[0].description}' class='w-1/2 h-auto sm:w-1/4'>`;
  document.getElementById("weatherDesc").innerText =
    data.weather[0].description;
  document.getElementById(
    "windSpeed"
  ).innerHTML = `<i class="fa-solid fa-wind"></i> ${data.wind.speed} m/s`;
  document.getElementById(
    "temp"
  ).innerHTML = `<i class="fa-solid fa-temperature-quarter"></i> ${Math.round(
    data.main.temp - 273.15
  )} &#8451;`;
  document.getElementById(
    "humidity"
  ).innerHTML = `<i class="fa-solid fa-droplet"></i> ${data.main.humidity}%`;
}

function displayForecastData(forecastData) {
  const forecastContainer = document.getElementById("forecastCard");
  forecastContainer.innerHTML = "";

  const dailyForecasts = forecastData.list.filter((forecast) =>
    forecast.dt_txt.includes("12:00:00")
  );

  dailyForecasts.forEach((forecast) => {
    const forecastElement = document.createElement("div");
    forecastElement.classList.add(
      "mt-2",
      "flex",
      "h-auto",
      "w-full",
      "items-center",
      "justify-between",
      "rounded-lg",
      "border",
      "bg-white",
      "p-2"
    );

    const options = { month: "long", day: "numeric" };
    const formattedDate = new Date(forecast.dt * 1000).toLocaleDateString(
      undefined,
      options
    );

    forecastElement.innerHTML = `
        <div class="text-black">${formattedDate}</div>
        <div><img src="https://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png" alt='${
      forecast.weather[0].description
    }' class='w-auto md:w-1/2'></div>
        <div class="flex flex-col items-center">
        <p>Temp</p>
        <p class="text-orange-500">${Math.round(
          forecast.main.temp - 273.15
        )}&#8451;</p>
        </div>
        <div class="flex flex-col items-center">
        <p>Wind</p>
        <p class="text-blue-500">${forecast.wind.speed}m/s</p>
        </div>
        <div class="flex flex-col items-center">
        <p>Humidity</p>
        <p class="text-sky-500">${forecast.wind.speed}%</p>
        </div>`;
    forecastContainer.appendChild(forecastElement);
  });
}

function addRecentCity(cityInput) {
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (!recentCities.includes(cityInput)) {
    recentCities.push(cityInput);
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
  }
  updateRecentCitiesDropdown();
}

function updateRecentCitiesDropdown() {
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  const recentCitiesDropdown = document.getElementById("recentDropdown");
  recentCitiesDropdown.innerHTML = "";

  if (recentCities.length > 0) {
    recentCities.forEach((city) => {
      let option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      recentCitiesDropdown.appendChild(option);
    });
    recentCitiesDropdown.classList.remove("hidden");
  } else {
    recentCitiesDropdown.classList.add("hidden");
  }
}
updateRecentCitiesDropdown();
