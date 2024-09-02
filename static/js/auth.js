function checkLoggedIn() {
    const token = localStorage.getItem("token");

    if (token) {
        authenticate("/workspace");
    }
}

function authenticate(path) {
    var form = document.getElementById("auto-login");
    var tokenField = document.getElementById("token-field");

    const token = localStorage.getItem("token");

    if (token) {
        tokenField.value = token;
        form.submit();
    }
}

// Call the function when the page loads

window.onload = checkLoggedIn;
