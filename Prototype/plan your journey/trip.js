let stationData = {};
let routesData = {};

// Load station and route data
async function loadData() {
    try {
        const stationResponse = await fetch('station.JSON');
        stationData = await stationResponse.json();

        const routesResponse = await fetch('reverse.json');
        routesData = await routesResponse.json();

        console.log("Data loaded successfully.");
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Suggest stations based on user input
function suggestStations(inputId) {
    const input = document.getElementById(inputId);
    const suggestionsDiv = document.getElementById(`${inputId}-suggestions`);
    const query = input.value.trim().toLowerCase();

    suggestionsDiv.innerHTML = ''; // Clear previous suggestions

    if (query) {
        const suggestions = Object.keys(stationData).filter(station =>
            station.toLowerCase().startsWith(query)
        );

        if (suggestions.length === 0) {
            const noSuggestion = document.createElement('div');
            noSuggestion.textContent = 'No matching stations found.';
            noSuggestion.classList.add('no-suggestion');
            suggestionsDiv.appendChild(noSuggestion);
        } else {
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
}

// Plan the journey and find routes
function planJourney() {
    const from = document.getElementById('from').value.trim().toLowerCase();
    const to = document.getElementById('to').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (!from || !to) {
        resultsDiv.innerHTML = '<p>Please enter both departure and destination stations!</p>';
        return;
    }

    if (!stationData[from] || !stationData[to]) {
        resultsDiv.innerHTML = '<p>Invalid station names. Please try again.</p>';
        return;
    }

    let foundRoutes = [];
    let directRouteFound = false;

    // Search for direct routes
    for (const routeKey in routesData) {
        const route = routesData[routeKey];
        const stopNames = route.stops.map(stop => stop.stopName.toLowerCase());

        const startIndex = stopNames.indexOf(from);
        const endIndex = stopNames.indexOf(to);

        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
            const stopsBetween = route.stops.slice(startIndex, endIndex + 1);
            foundRoutes.push({
                routeName: route.routeName,
                stops: stopsBetween,
                totalStops: stopsBetween.length,
                intermediate: null
            });
            directRouteFound = true;
            break;
        }
    }

    // Search for indirect routes if no direct route is found
    if (!directRouteFound) {
        let commonStops = {};

        for (const routeKey in routesData) {
            const route = routesData[routeKey];
            const stopNames = route.stops.map(stop => stop.stopName.toLowerCase());

            if (stopNames.includes(from)) {
                commonStops[routeKey] = {
                    routeName: route.routeName,
                    stops: stopNames
                };
            }

            if (stopNames.includes(to)) {
                for (const key in commonStops) {
                    const commonRouteStops = commonStops[key].stops;
                    const commonStop = commonRouteStops.find(stop => stopNames.includes(stop));

                    if (commonStop) {
                        const firstPartStops = routesData[key].stops.slice(
                            commonRouteStops.indexOf(from),
                            commonRouteStops.indexOf(commonStop) + 1
                        );
                        const secondPartStops = route.stops.slice(
                            stopNames.indexOf(commonStop),
                            stopNames.indexOf(to) + 1
                        );

                        foundRoutes.push({
                            routeName: `${commonStops[key].routeName} + ${route.routeName}`,
                            firstPart: firstPartStops,
                            secondPart: secondPartStops,
                            totalStops: firstPartStops.length + secondPartStops.length,
                            intermediate: {
                                station: commonStop,
                                fromRoute: commonStops[key].routeName,
                                toRoute: route.routeName
                            }
                        });
                    }
                }
            }
        }
    }

    displayRoutes(foundRoutes, resultsDiv, from, to);
}

// Display the found routes
function displayRoutes(routes, resultsDiv, from, to) {
    if (routes.length > 0) {
        routes.sort((a, b) => a.totalStops - b.totalStops);

        routes.forEach((route, index) => {
            const routeTitle = document.createElement('h3');
            routeTitle.textContent = `Route ${index + 1}: ${route.routeName}`;
            resultsDiv.appendChild(routeTitle);

            const stopCount = document.createElement('p');
            stopCount.textContent = `Total stops: ${route.totalStops}`;
            resultsDiv.appendChild(stopCount);

            // Show Details Button
            const showDetailsButton = document.createElement('button');
            showDetailsButton.textContent = 'Show Details';
            resultsDiv.appendChild(showDetailsButton);

            // Details container
            const detailsContainer = document.createElement('div');
            detailsContainer.style.display = 'none';
            showDetailsButton.onclick = () => {
                detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
                showDetailsButton.textContent = detailsContainer.style.display === 'none' ? 'Show Details' : 'Hide Details';
            };

            // Display route stops
            const stopsList = document.createElement('ul');
            if (route.stops) {
                route.stops.forEach(stop => {
                    const listItem = document.createElement('li');
                    listItem.textContent = stop.stopName;
                    stopsList.appendChild(listItem);
                });
            } else {
                route.firstPart.forEach(stop => {
                    const listItem = document.createElement('li');
                    listItem.textContent = stop.stopName;
                    stopsList.appendChild(listItem);
                });

                const intermediateStop = document.createElement('p');
                intermediateStop.textContent = `Change at ${route.intermediate.station}`;
                stopsList.appendChild(intermediateStop);

                route.secondPart.forEach(stop => {
                    const listItem = document.createElement('li');
                    listItem.textContent = stop.stopName;
                    stopsList.appendChild(listItem);
                });
            }
            detailsContainer.appendChild(stopsList);
            resultsDiv.appendChild(detailsContainer);
        });
    } else {
        resultsDiv.innerHTML = `<p>No routes found between ${from} and ${to}.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadData);
