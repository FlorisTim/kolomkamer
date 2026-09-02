// i am very much aware of the weirdness happening here, i used a post request to get, weird stuff i know.
//i will rework this when people actually decide to use this website

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
                errortext.innerText = "Username or password incorrect or not found"
        }
        document.getElementsByClassName("loginbutton")[0].innerHTML = "Login"
        return;
    }

    if (data[0].trim() === "SUCCESS") {
        sessionStorage.setItem("username", username.value);
        sessionStorage.setItem("sessionToken", data[1].trim());
        window.location.href = `../user?u=${encodeURIComponent(username.value)}&edit=1`;
    }
}

async function signup(){
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
        body: "SIGNUP____" + username.value + "____" + password.value,
    }));

    let data = (await res.text()).split("____");

    if (data[0].trim() === "ERROR") {
        switch (data[1].trim()) {
            case "password_short":
                errortext.innerText = "Password must be at least 8 characters"
                break;
            case "user_short":
                errortext.innerText = "Username must be at least 3 characters"
                break;
            case "in_use":
                errortext.innerText = "Username already in use"
        }
        document.getElementsByClassName("loginbutton")[0].innerHTML = "Sign up"
        return;
    }

    if (data[0].trim() === "SUCCESS") {
        await login()
    }
}

async function getFilesOf(user){
    let a = await fetch("https://api.kolomkamer.nl", {
        method: "POST",
        body: "LIST_FILES____" + user,
    }).then((response) => response.text());
    let output
    try {
        output = JSON.parse(a.split("____")[1].replaceAll("'", "\""));
    } catch (e){
        console.log(a)
        output = [];
    }
    return output;
}


async function getOwnersOf(file){
    let a = await fetch("https://api.kolomkamer.nl", {
        method: "POST",
        body: "LIST_USERS____" + file,
    }).then((response) => response.text());
    let output
    try {
        output = JSON.parse(a.split("____")[1].replaceAll("'", "\""));
    } catch (e){
        console.log(a)
        output = [];
    }
    return output;
}


async function createFile(file){
    document.getElementById("crclmn").innerText = "Working..."
    let a = await fetch("https://api.kolomkamer.nl", {
        method: "POST",
        body:
            "CREATE____" +
            sessionStorage.getItem("username") + "____" +
            sessionStorage.getItem("sessionToken") + "____" +
            file,
    }).then((response) => response.text());
    let res = a.split("____")
    sessionStorage.setItem("sessionToken", res[1].trim());

    if (res[0].trim() === "ERROR") {
        document.getElementById("crclmn").innerText = "Create Column"
        document.getElementById('errortext').innerText = "Column name already in use or illegal characters"
        return "file_already_exists"
    }
    window.location.reload();
}

async function giveFile(file, user){
    let a = await fetch("https://api.kolomkamer.nl", {
        method: "POST",
        body:
            "GRANT____" +
            sessionStorage.getItem("username") + "____" +
            sessionStorage.getItem("sessionToken") + "____" +
            user + "____" +
            file,
    }).then((response) => response.text());
    let res = a.split("____")
    if (res[0].trim() === "ERROR") {
        return res[1]
    }
    sessionStorage.setItem("sessionToken", res[1].trim());
}

async function takeFile(file, user){
    let a = await fetch("https://api.kolomkamer.nl", {
        method: "POST",
        body:
            "REVOKE____" +
            sessionStorage.getItem("username") + "____" +
            sessionStorage.getItem("sessionToken") + "____" +
            user + "____" +
            file,
    }).then((response) => response.text());
    let res = a.split("____")
    if (res[0].trim() === "ERROR") {
        return res[1]
    }
    sessionStorage.setItem("sessionToken", res[1].trim());
}

async function updateFile(file, data){
    const currentData = data.trim();

    for (let i = 0; i < currentData.length; i+= 750) {
        await dumbUpdate(file, currentData.substring(i, Math.min(i + 750, currentData.length)));
    }
}

async function dumbUpdate(file, data, index){
    let a = await fetch("https://api.kolomkamer.nl", {
        method: "POST",
        body:
            "UPDATE____" +
            sessionStorage.getItem("username") + "____" +
            sessionStorage.getItem("sessionToken") + "____" +
            file + "____" +
            index + "____" +
            data.replaceAll("____", "$PROTOCOLSEPARATOR$")
    }).then((response) => response.text());
    let res = a.split("____")
    if (res[0].trim() === "ERROR") {
        return res[1]
    }
    sessionStorage.setItem("sessionToken", res[1].trim());
}

async function get(file){
    let a = await fetch("https://api.kolomkamer.nl", {
        method: "POST",
        body:
            "GET____" +
            file
    }).then((response) => response.text());
    return a.replaceAll("$PROTOCOLSEPARATOR$","____");
}