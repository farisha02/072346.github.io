let chart;

function fetchWeather() {
    const city = document.getElementById('city').value || 'Kuala Lumpur';
    // Get coordinates for a few Malaysian cities (expand if you like)
    const cityCoords = {
        'Kuala Lumpur': {lat: 3.139, lon: 101.6869},
        'Penang': {lat: 5.4141, lon: 100.3288},
        'Johor Bahru': {lat: 1.4927, lon: 103.7414},
        'Kota Kinabalu': {lat: 5.9804, lon: 116.0735}
    };
    const coords = cityCoords[city] || cityCoords['Kuala Lumpur'];
    // Open-Meteo API (7-day forecast)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            showWeatherInfo(data, city);
        });
}

function showWeatherInfo(data, city) {
    const weatherDiv = document.getElementById('weather-info');
    if (!data.daily) {
        weatherDiv.innerHTML = "<p class='text-red-500'>No data found for this city.</p>";
        return;
    }
    const days = data.daily.time;
    const tempMax = data.daily.temperature_2m_max;
    const tempMin = data.daily.temperature_2m_min;
    const precipitation = data.daily.precipitation_sum;
    let html = `<h3 class="font-bold mb-2">7-Day Forecast: ${city}</h3>
    <ul class="mb-4">`;
    for (let i = 0; i < days.length; i++) {
        html += `<li>${days[i]}: <b>${tempMax[i]}°C</b> / ${tempMin[i]}°C, Rain: ${precipitation[i]} mm</li>`;
    }
    html += '</ul>';
    weatherDiv.innerHTML = html;

    // Draw Chart
    if (chart) chart.destroy();
    const ctx = document.getElementById('weatherChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Max Temp (°C)',
                    data: tempMax,
                    borderColor: 'rgb(37,99,235)',
                    fill: false
                },
                {
                    label: 'Min Temp (°C)',
                    data: tempMin,
                    borderColor: 'rgb(96,165,250)',
                    fill: false
                },
                {
                    label: 'Rain (mm)',
                    data: precipitation,
                    borderColor: 'rgb(16,185,129)',
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {mode: 'index', intersect: false},
            stacked: false,
            plugins: {
                legend: {position: 'top'}
            },
            scales: {
                y: {beginAtZero: true, title: {display: true, text: 'Temp (°C)'}},
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {display: true, text: 'Rain (mm)'},
                    grid: {drawOnChartArea: false}
                }
            }
        }
    });
}

window.onload = fetchWeather;
