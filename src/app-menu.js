const link = document.createElement('a');
link.href = "#";
link.title = "Spotify"

const image = document.createElement('img');
image.src = "data:image/png;base64,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"
image.alt = "Open Modal";
image.style.cursor = "pointer";

link.appendChild(image);

document.getElementById('app-menu').appendChild(link);

const modal = document.getElementById('modal');
const modalIframe = document.getElementById('modal-iframe');
const closeBtn = document.getElementById('close-btn');

link.addEventListener('click', function(e) {
    e.preventDefault();
    modalIframe.src = "https://www.google.com/spotify.com"; 
    modal.style.display = "block";
});

closeBtn.addEventListener('click', function() {
    modal.style.display = "none";
    modalIframe.src = ""; 
});

window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = "none";
        modalIframe.src = "";
    }
});

