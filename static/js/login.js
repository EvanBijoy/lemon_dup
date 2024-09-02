document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const formDataJson = Object.fromEntries(formData.entries());

        console.log(formDataJson["email"])
        localStorage.setItem("email", formDataJson["email"]);

        // Send the form data to the server
        fetch("/new_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataJson),
        })
            .then((response) => {
                if (!response.ok) 
                {
                    document.getElementById('popup').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('popup').style.display = 'none';
                    }, 1500);
                    throw new Error("Authentication failed");
                }
                return response.json();
            })
            .then((data) => {
                const token = data.token;

                localStorage.setItem("token", token);

                // Redirect to the workspace page after successful authentication
                authenticate("/workspace");
            })
            .catch((error) => {
                console.error(
                    "There was a problem with your fetch operation:",
                    error,
                );

                // Handle errors (e.g., display error message to user)
            });
    });

function authenticate(path) {
    var form = document.getElementById("auto-login");
    var tokenField = document.getElementById("token-field");

    const token = localStorage.getItem("token");

    if (token) {
        tokenField.value = token;
        form.submit();
    }
}