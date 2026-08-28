const NETA = true;
const THTA = false;

function openLink(link){
    openLink(link, NETA);
}

function openLink(link, newtab){
    window.open(link, newtab ? '_blank' : '_self');
}

