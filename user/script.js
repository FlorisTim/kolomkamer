main()

async function main(){
    let sites = await getFilesOf(sessionStorage.getItem("username"));
    console.log(sites);

    if (sites.length > 0){
        const p = document.getElementById("projects")
        p.innerHTML = ""
        for (let site of sites){
            p.innerHTML += `
            <div class="row">
                <div class="max">${site}</div>
                <button class="max" onclick="window.location.href ='../viewer?p=${encodeURIComponent(site)}'">
                    View
                </button>
                <button class="max" onclick="window.location.href ='../editor?p=${encodeURIComponent(site)}'">
                    Edit
                </button>
            </div>
`;
        }
    }
}