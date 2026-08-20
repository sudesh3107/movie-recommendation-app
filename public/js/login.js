const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await res.json();

    const message = document.getElementById("message");

    if (data.success) {

        message.style.color = "#00ff66";
        message.innerHTML = "Login Successful";

        setTimeout(() => {
            window.location = "/";
        }, 1200);

    } else {

        message.style.color = "red";
        message.innerHTML = data.message || "Login Failed";

    }

});