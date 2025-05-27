// weather.js
let chart;

function fetchWeather() {
  const city = document.getElementById('cityInput').value || 'Kuala Lumpur'; // Default to 'Kuala Lumpur'
  const apiKey = '1a62f75cc0e791db5be345a41bb2c283'; // API Key for OpenWeather
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      showWeatherInfo(data, city);
    })
    .catch(() => {
      document.getElementById('weatherResult').innerHTML = "<p class='text-red-500'>Error fetching data.</p>";
      if (chart) chart.destroy();
    });
}

function showWeatherInfo(data, city) {
  const weatherDiv = document.getElementById('weatherResult');
  if (!data.daily) {
    weatherDiv.innerHTML = "<p class='text-red-500'>No data found for this city.</p>";
    if (chart) chart.destroy();
    return;
  }

  const days = data.daily.time;
  const tempMax = data.daily.temperature_2m_max;
  const tempMin = data.daily.temperature_2m_min;
  const precipitation = data.daily.precipitation_sum;

  let html = `<h3 class="font-bold mb-2">7-Day Forecast: ${city}</h3><ul class="mb-4">`;
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
          fill: false,
          tension: 0.4
        },
        {
          label: 'Min Temp (°C)',
          data: tempMin,
          borderColor: 'rgb(96,165,250)',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Rain (mm)',
          data: precipitation,
          borderColor: 'rgb(16,185,129)',
          fill: false,
          yAxisID: 'y1',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      stacked: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Temp (°C)' } },
        y1: {
          beginAtZero: true,
          position: 'right',
          title: { display: true, text: 'Rain (mm)' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

// Load default weather on page load
window.onload = fetchWeather;
