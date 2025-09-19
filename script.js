const apiKey = "20cc253959113279e8ad79ec90820797"// ← Yahan apna OpenWeatherMap API key daalein

function setWeatherBackground(weather) {
    const body = document.getElementById('weather-body');
    let backgroundImage = '';

    switch (weather.toLowerCase()) {
        case 'clear':
            backgroundImage = 'url(images/sunny.jpg)';
            break;
        case 'clouds':
            backgroundImage = 'url(images/cloudy.jpg)';
            break;
        case 'rain':
        case 'drizzle':
            backgroundImage = 'url(images/rainy.jpg)';
            break;
        case 'snow':
            backgroundImage = 'url(images/snow.jpg)';
            break;
        case 'thunderstorm':
            backgroundImage = 'url(images/thunderstorm.jpg)';
            break;
        default:
            backgroundImage = 'url(images/default.jpg)';
            break;
    }

    body.style.backgroundImage = backgroundImage;
}

function showWeather(data) {
    const result = document.getElementById('result');
    if (data.cod !== 200) {
        result.innerHTML = `<p>City not found or API error!</p>`;
        return;
    }

    result.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Condition: ${data.weather[0].main}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    setWeatherBackground(data.weather[0].main);
}

// Search by city
document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    if (city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
            .then(res => res.json())
            .then(showWeather)
            .catch(err => console.error(err));
    }
});

// Search by geolocation
document.getElementById('locBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
                .then(res => res.json())
                .then(showWeather)
                .catch(err => console.error(err));
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});


