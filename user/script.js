main()

async function main(){
    let sites = await getFilesOf(sessionStorage.getItem("username"));
    console.log(sites);
}