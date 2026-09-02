main()

async function main(){
    let sites = await getFilesOf(sessionStorage.getItem("username"));
    console.log(sites);

    if (sites.length > 0){
        const p = document.getElementById("projects")
        p.innerHTML = ""
        for (let site of sites){
            p.innerHTML += `
            <button onclick="loadPrev('${site}')">${site}</button>
            </div>
`;
        }
    }
}

function loadPrev(site){
    const p = document.getElementById("thumbnail")

    p.innerHTML = site
}