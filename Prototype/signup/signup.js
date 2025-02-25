document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve input values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Validate inputs
    if (!name) {
        alert('Please enter your name.');
        return;
    }

    if (!email) {
        alert('Please enter your email.');
        return;
    } else if (!isEmailValid(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!password) {
        alert('Please enter your password.');
        return;
    } else if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // Send data to Google Apps Script Web App via POST
    const targetUrl = 'https://script.google.com/macros/s/AKfycbysWBRpO5P-XnwqBMctPMSAlO3XEhykU2aHajLW3kyp31txf35-2dctin81U1MwtjOd/exec';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORS proxy URL

    try {
        const response = await fetch(proxyUrl + targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'signup', // Include action for server-side logic
                name: name,
                email: email,
                password: password, // Hash before sending in production
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
            alert(data.message || 'Signup successful!');
            showSuccessMessage();
            setTimeout(() => {
                window.location.href = '../signin/signin1.html';
            }, 100);
        } else {
            alert(data.message || 'Something went wrong.');
        }
    } catch (error) {
        console.error('Error during request:', error);
        alert('There was an error processing your request.');
    }
});

// Function to validate email format
function isEmailValid(email) {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// Function to display success message
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.innerHTML = '<i class="fa fa-check-circle"></i> Sign-up successful!';
    document.querySelector('main.auth-container').appendChild(successMessage);
    successMessage.style.display = 'block';

    // Remove success message after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
        successMessage.remove();
    }, 3000);
}

// Real-time validation
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Update input field styles based on validation
function validateInput(inputElement, isValid) {
    if (isValid) {
        inputElement.classList.remove('invalid');
    } else {
        inputElement.classList.add('invalid');
    }
}

// Real-time input validation
nameInput.addEventListener('input', () => validateInput(nameInput, nameInput.value.trim() !== ''));
emailInput.addEventListener('input', () => validateInput(emailInput, isEmailValid(emailInput.value.trim())));
passwordInput.addEventListener('input', () => validateInput(passwordInput, passwordInput.value.trim().length >= 6));
confirmPasswordInput.addEventListener('input', () =>
    validateInput(confirmPasswordInput, confirmPasswordInput.value.trim() === passwordInput.value.trim())
);
