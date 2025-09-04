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
    result.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Condition: ${data.weather[0].main}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    setWeatherBackground(data.weather[0].main);
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    if (city) {
        fetch(`getWeather.php?city=${city}`)
            .then(res => res.json())
            .then(showWeather)
            .catch(err => console.error(err));
    }
});

document.getElementById('locBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            fetch(`getWeather.php?lat=${latitude}&lon=${longitude}`)
                .then(res => res.json())
                .then(showWeather)
                .catch(err => console.error(err));
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
