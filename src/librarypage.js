// Redirect to login if not logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = './accountpage.html';
  }
  
let recorder, chunks = [];
  

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => chunks.push(e.data);
  
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const name = `recording-${Date.now()}`;
        storeAudio(name, url, 'recording');
        chunks = [];
        renderAudioLibrary();
        alert('Recording saved.');
    };
  
    document.getElementById('start-record').onclick = () => recorder.start();
    document.getElementById('stop-record').onclick = () => recorder.stop();
});
  

document.getElementById('upload-audio').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const audioData = reader.result;
        const name = `upload-${file.name}`;
        storeAudio(name, audioData, 'upload');
        renderAudioLibrary();
        alert('Audio uploaded.');
    };
    reader.readAsDataURL(file);
});
  

function saveAudioObject(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}
  
function storeAudio(name, url, type) {
    const audioObj = {
        name,
        url,
        type,
        addedAt: new Date().toISOString(),
        favorite: false
    };
    saveAudioObject(name, audioObj);
}
  

function renderAudioLibrary() {
    const container = document.getElementById('audio-library');
    container.innerHTML = '';
  
    const keys = Object.keys(localStorage).filter(k => {
        try {
            const data = JSON.parse(localStorage.getItem(k));
            return data && data.url && data.addedAt;
        } catch {
            return false;
        }
    });
  
    keys.sort((a, b) => {
        const aTime = new Date(JSON.parse(localStorage.getItem(a)).addedAt);
        const bTime = new Date(JSON.parse(localStorage.getItem(b)).addedAt);
        return bTime - aTime;
    });
    
    keys.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key));
        const wrapper = document.createElement('div');
        wrapper.className = 'audio-wrapper';
    
        const title = document.createElement('p');
        title.textContent = data.name;
    
        const audio = document.createElement('audio');
        audio.src = data.url;
        audio.controls = true;
    
        const favBtn = document.createElement('button');
        favBtn.className = "audio-buttons"
        favBtn.innerHTML = data.favorite ? "Liked" : "Like";
            favBtn.title = 'toggle like';
            favBtn.onclick = () => {
                data.favorite = !data.favorite;
                saveAudioObject(key, data);
                renderAudioLibrary();
            };
    
        const renameBtn = document.createElement('button');
        renameBtn.className = "audio-buttons"
        renameBtn.textContent = "Rename";
        renameBtn.title = 'Rename';
        renameBtn.onclick = () => {
            const newName = prompt('Enter new file name:', data.name);
            if (newName && newName.trim() !== '' && newName !== data.name) {
                const newKey = `${data.type}-${newName.trim()}`;
                data.name = newKey;
                localStorage.setItem(newKey, JSON.stringify(data));
                localStorage.removeItem(key);
                renderAudioLibrary();
            }
        };
    
        const deleteBtn = document.createElement('button');
        deleteBtn.className = "audio-buttons"
        deleteBtn.textContent = "Delete";
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = () => {
            if (confirm(`Delete "${data.name}"?`)) {
                localStorage.removeItem(key);
                renderAudioLibrary();
            }
        };
    
        const time = document.createElement('small');
        const date = new Date(data.addedAt);
        time.textContent = `Added: ${date.toLocaleString()}`;
    
        wrapper.appendChild(title);
        wrapper.appendChild(audio);
        wrapper.appendChild(favBtn);
        wrapper.appendChild(renameBtn);
        wrapper.appendChild(deleteBtn);
        wrapper.appendChild(time);
        container.appendChild(wrapper);
    });
}
  
document.getElementById('search-bar').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const wrappers = document.querySelectorAll('.audio-wrapper');
    wrappers.forEach(wrapper => {
        const title = wrapper.querySelector('p').textContent.toLowerCase();
        wrapper.style.display = title.includes(query) ? 'block' : 'none';
    });
});
  
document.addEventListener('DOMContentLoaded', () => {
    const greeting = document.getElementById('greeting');
    const user = localStorage.getItem('currentUser') || 'Guest';
    greeting.textContent = `Hi, ${user}!`;
    renderAudioLibrary();
});
  
localStorage.setItem('currentUser', username);