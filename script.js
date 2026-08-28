const NETA = true;
const THTA = true;

function openLink(link){
    openLink(link, new_tab);
}

function openLink(link, newtab){
    window.open(link, newtab ? '_blank' : '_self');
}

