let stationData = {};

// Fetch station data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetch('station.JSON')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            stationData = data;
        })
        .catch(error => console.error('Error loading station data:', error));
});

// Suggest stations based on input
function suggestStations(inputId) {
    const input = document.getElementById(inputId);
    const suggestionsDiv = document.getElementById(`${inputId}-suggestions`);
    const query = input.value.trim().toLowerCase();

    suggestionsDiv.innerHTML = ''; // Clear previous suggestions

    if (query) {
        const suggestions = Object.keys(stationData).filter(station =>
            station.toLowerCase().startsWith(query)
        );

        suggestions.forEach(station => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = station;
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.onclick = () => {
                input.value = station;
                suggestionsDiv.innerHTML = ''; // Clear suggestions
            };
            suggestionsDiv.appendChild(suggestionItem);
        });
    }
}

// Search buses between two stations
function searchBuses() {
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = ''; // Clear previous results

    if (!from || !to) {
        alert('Please enter both departure and destination stations!');
        return;
    }

    if (!stationData[from] || !stationData[to]) {
        resultsDiv.textContent = 'No data available for the entered stations.';
        return;
    }

    // Display available buses for both stations
    const fromBuses = stationData[from];
    const toBuses = stationData[to];
    const commonBuses = fromBuses.filter(bus => toBuses.includes(bus));

    if (commonBuses.length > 0) {
        const resultList = document.createElement('ul');
        resultList.innerHTML = '<h3>Available Buses:</h3>';
        commonBuses.forEach(bus => {
            const listItem = document.createElement('li');
            listItem.textContent = bus;
            resultList.appendChild(listItem);
        });
        resultsDiv.appendChild(resultList);
    } else {
        resultsDiv.textContent = 'No direct buses found between these stations.';
    }
}
