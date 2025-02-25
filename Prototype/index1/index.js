document.addEventListener("DOMContentLoaded", function () {
    // Collapsible functionality
    const collapsibles = document.querySelectorAll(".collapsible h4");

    collapsibles.forEach(header => {
        header.addEventListener("click", function () {
            const content = this.nextElementSibling;
            // Toggle the display of the content
            content.style.display = content.style.display === "block" ? "none" : "block";
        });
    });

    // Fetch user's city using geolocation
    function getUserCity() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    console.log('Latitude:', lat, 'Longitude:', lon); // Debug coordinates

                    const apiKey = '87589f771c1989d32b313de8e263ef0b';
                    const url = `https://api.weatherstack.com/current?access_key=${apiKey}&query=${lat},${lon}`;

                    fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('API Response:', data); // Debug the API response
                            if (data.location && data.location.name) {
                                typeCityName(data.location.name);
                            } else {
                                console.error('Invalid API response structure');
                                typeCityName('Unknown City');
                            }
                        })
                        .catch(error => {
                            console.error('Fetch error:', error);
                            typeCityName('Unknown City');
                        });
                },
                function () {
                    console.error('Geolocation permission denied or unavailable.');
                    typeCityName('Unknown City');
                }
            );
        } else {
            console.error('Geolocation not supported.');
            typeCityName('Geolocation Not Supported');
        }
    }

    // Function to simulate typing the city name
    function typeCityName(cityName) {
        const cityHeading = document.getElementById('city-heading');
        if (cityHeading) {
            cityHeading.textContent = 'Explore Your City Seamlessly!';
        } else {
            console.warn('Element with id "city-heading" not found.');
        }


        const text = `${cityName}, Connected.`;
        let i = 0;

        cityHeading.textContent = ''; // Clear existing text

        function typeWriter() {
            if (i < text.length) {
                cityHeading.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 95);
            }
        }

        typeWriter();
    }

    // Invoke the getUserCity function to start the process
    getUserCity();
});
