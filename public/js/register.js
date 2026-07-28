const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullname,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            message.style.color = "#00ff88";
            message.innerText = data.message;

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);

        } else {
            message.style.color = "red";
            message.innerText = data.message;
        }

    } catch (error) {
        message.style.color = "red";
        message.innerText = "Server Error!";
        console.error(error);
    }
});