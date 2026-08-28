let DOCUMENTBODY;
let DOCUMENTHEAD;
let createdBody;

document.addEventListener("DOMContentLoaded",() => main())

async function main(){
    createdBody = await (await fetch("/ex.txt")).text();

    DOCUMENTHEAD = await document.getElementsByTagName("head")[0];
    DOCUMENTBODY = await document.getElementById("main");

    createDoc(true,true);
}

async function createDoc(head, editor){
    DOCUMENTBODY.innerHTML = await generateBody(createdBody, editor);
    if (head) {
        DOCUMENTHEAD.innerHTML += await generateHeader(createdBody);
    }

}
window.createDoc=createDoc;
async function generateHeader(text){
    text.replaceAll("\r\n","").replaceAll("\n","").replaceAll("\r","")
    text = text.substring(0,text.indexOf("~")) + ":;";

    const googleFont = await lazyGet("%gf",text)
    const customStyle = await lazyGet("%cs",text)

    let output = "";

    if (googleFont) {
        output += `<style>
@import url('https://fonts.googleapis.com/css2?family=${googleFont}:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
    *{
        font-family: "${googleFont}", sans-serif;
        font-weight: 300;
        font-style: normal;
    }
</style>`;
    }

    if (customStyle) {
        output += `
        <style>
            ${customStyle
            .replaceAll("!fs","font-size")
            .replaceAll("!dp","display")
            .replaceAll("!fd","flex-direction")
            .replaceAll("!bg","background-")
            .replaceAll("!cl","color")
            .replaceAll("!bd","border-")
            .replaceAll("!rd","radius")
            .replaceAll("&fx","flex")
            .replaceAll("=",": ")
        }
        </style>`;
    }

    return output;
}

async function lazyGet(a, b){
    if (!b.includes(a)) {return false;}
    b = b.substring(b.indexOf(a)+a.length);
    return b.substring(0, b.indexOf(":;")).replaceAll("^s"," ").trim();
}

async function generateBody(text, editing){
    text = text.substring(text.indexOf("~")+1);
    let element = 0;
    let output = "";
    let pad = false;
    const dragndropattr = `<span class="inbetween #N"  ondrop="dropHandler(event)" ondragover="dragoverHandler(event)">+</span>`
    for(let i = 0; i < text.length; i++){
        const char = text.charAt(i);

        switch(char) {
            case "!":
                if (pad){
                output += "clickable\" onClick=\"";
                    pad = false;
                } else {
                    output += char;
                }
                break;
            case "[":
                output += `<span id="element_${element++}" class="all `
                pad = true;
                break;
            case "{":
                if (editing){
                output += dragndropattr.replace("#N",element)}
                output += `<div ${editing ? `onClick="edit(${element}); event.stopPropagation();"` : ""} id="element_${element++}" class="all `
                pad = true;
                break;
            case "|":
                output += `">`
                pad = false;
                break;
            case "}":
                output += `</div>`
                break;
            case "]":
                output += `</span>`
                break;
            default:
                output += char;
                if (pad){
                    output += " ";
                }
                break;
        }
    }

    return output;
}