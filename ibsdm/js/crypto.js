let cchart;

function fetchCrypto() {
    const coin = document.getElementById('search').value || 'bitcoin';
    // CoinGecko: price + 7d sparkline
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}&sparkline=true`)
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            document.getElementById('crypto-info').innerHTML = "<p class='text-red-500'>No data found for this coin.</p>";
            if (cchart) cchart.destroy();
            return;
        }
        const d = data[0];
        document.getElementById('crypto-info').innerHTML = `
            <h3 class="font-bold mb-2">${d.name} (${d.symbol.toUpperCase()})</h3>
            <ul>
                <li>Current Price: <b>$${d.current_price}</b></li>
                <li>Market Cap: $${(d.market_cap/1e9).toFixed(2)} Billion</li>
                <li>24h Change: ${d.price_change_percentage_24h}%</li>
            </ul>
        `;
        const spark = d.sparkline_in_7d.price;
        const days = Array.from({length: spark.length}, (_, i) => `Day ${i+1}`);
        // Draw chart
        if (cchart) cchart.destroy();
        const ctx = document.getElementById('cryptoChart').getContext('2d');
        cchart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: '7d Price Trend (USD)',
                    data: spark,
                    borderColor: 'rgb(245,158,11)',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {legend: {position: 'top'}}
            }
        });
    });
}

window.onload = fetchCrypto;
