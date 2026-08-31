async function login(){
    const username = document.getElementById('username')
    const password = document.getElementById('password')

    const errortext = document.getElementById('errortext')

    errortext.innerText = ""

    if (username.value.length < 3) {
        errortext.innerText = "Username must be at least 3 characters"
        return;
    }
    if (password.value.length < 8) {
        errortext.innerText = "Password must be at least 8 characters"
        return;
    }

    document.getElementsByClassName("loginbutton")[0].innerHTML = "Loading..."

    let res = (await fetch("https://api.kolomkamer.nl", {
        method: "POST",
        body: "LOGIN____" + username.value + "____" + password.value,
    }));

    let data = (await res.text()).split("____");

    console.log(data)

    password.value = "";

    if (data[0].trim() === "ERROR") {
        switch (data[1].trim()) {
            case "password_short":
                errortext.innerText = "Password must be at least 8 characters"
                break;
            case "user_short":
                errortext.innerText = "Username must be at least 3 characters"
                break;
            case "invalid_account":
                errortext.innerText = "Username or password not found"
        }
        document.getElementsByClassName("loginbutton")[0].innerHTML = "Login"
        return;
    }

    if (data[0].trim() === "SUCCESS") {
        sessionStorage.setItem("sessionToken", data[1].trim());

    }
}