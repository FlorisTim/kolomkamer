
function dragstartHandler(ev) {
    ev.dataTransfer.setData("text", ev.target.children[1].id);

    const div = document.createElement("div");
    div.tagName = "div"
    div.innerHTML = ev.target.children[0].innerHTML;
    div.style.position = "absolute";
    div.classList.add("e");
    div.style.zIndex = "-10";
    document.body.appendChild(div);

    ev.dataTransfer.setDragImage(div,0,0);

    setTimeout(() => div.remove(), 0);
}

function dragoverHandler(ev) {
    ev.target.style.width = "";
    ev.preventDefault();
}

function dropHandler(ev) {
    const data = ev.dataTransfer.getData("text");
    const addition = document.getElementById(data).cloneNode(true);
    addition.id = "NEW_OBJECT"
    ev.target.appendChild(addition);
    deselect()
    reevaluate()
}

async function reevaluate() {
    if (document.getElementById("NEW_OBJECT") !== null) {
        const subject = await document.getElementById("NEW_OBJECT");
        const index = subject.parentElement.classList.item(1)
        const object = htmlToCompact(subject)
        console.log(object)
        createdBody = inject(object,index);

        await createDoc(false,true);
    }
}

async function deleteSelectedElement(){
    const subject = document.getElementsByClassName("selected")[0]
    deleteElement(parseInt(subject.id.substring(8))+1);
    await createDoc(false,true);
}

function deleteElement(id) {
    const start = createdBody.indexOf("~") + 1;

    let current = 0;

    for (let i = start; i < createdBody.length; i++) {
        if ("[{".includes(createdBody[i])) {
            current++;

            if (current === id) {
                const relativeIndex = i - start;

                const element = getFull(relativeIndex);

                createdBody =
                    createdBody.substring(0, i) +
                    createdBody.substring(i + element.length);

                return;
                deselect()
            }
        }
    }
}



function getElement(index,outputindex){
    let text = createdBody;
    text = text.substring(text.indexOf("~")+1);
    let element = 0;
    for(let i = 0; i < text.length; i++){
        if ("[{".includes(text[i])){
            element++;
            console.log(element + " " + index);
            if (element == index){
                const out = getFull(i)
                return out.substring(out.indexOf("|")+1, out.length-1) + (outputindex ? "::" + i : "");
            }
        }
    }
}

function getFull(stringindex){
    let text = createdBody;
    text = text.substring(text.indexOf("~")+1);
    let output = "";
    let depth = -1;
    for(let i = stringindex; i < text.length; i++){
        if ("[{".includes(text[i])){
            depth++;
        }
        if ("]}".includes(text[i])){
            depth--;
        }
        output += text[i];
        if (depth == -1){
            return output;
        }
    }
    return output;
}

function inject(node,index){
    let text = createdBody;
    text = text.substring(text.indexOf("~")+1);
    let element = 0;
    let output = "";
    for(let i = 0; i < text.length; i++){
       if ("[{".includes(text[i])){
            element++;
            console.log(element + " " + index);
            if (element-1 == index){
                output += node;
                console.log("correct");
            }
       }
       output += text[i];
    }
    console.log(output);
    return "~"+output;
}

//[] span
//{} div
//[classes | content]
//[classes !js | content]

function htmlToCompact(html) {
    let output = "";
    const type = html.tagName === "DIV"
    output += type ? "{" : "[";
    output += html.className.replaceAll(" ","");
    output += "|";
    output += html.innerHTML;
    output += type ? "}" : "]";
    return output;
}

const editchild = 2;

function deselect(){
    const editor = document.getElementById("objecteditor");
    const texteditor = editor.children[editchild]
    editor.style.visibility = "hidden";
    texteditor.style.visibility = "hidden";
    texteditor.style.position = "absolute";
    const s = document.getElementsByClassName('selected')
    for (let e of s) {
        e.classList.remove('selected');
    }
}

function edit(id){
    deselect();
    const editor = document.getElementById("objecteditor");
    const sel = document.getElementById("element_"+id);
    sel.classList.add('selected');
    const texteditor = editor.children[editchild]
    document.getElementById("CLONED_OBJECT").innerHTML = `${getElement(id+1,false)}`;
    document.getElementById("CLONED_OBJECT").className = sel.className.replaceAll("all","").replaceAll("selected","");
    document.getElementById("contents").innerHTML = sel.innerHTML;
    document.getElementById("contents").parentElement.open = true;
    texteditor.style.visibility = "visible";
    texteditor.style.position = "relative";
    if (sel.innerHTML.includes("ondragover=\"dragoverHandler(event)\">+</span>")){
        texteditor.style.visibility = "hidden";
        texteditor.style.position = "absolute";
    }
    // while (sel.innerHTML.includes("<span>")) {
    //
    // }
    editor.style.visibility = "visible";
}