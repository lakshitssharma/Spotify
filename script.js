console.log('lets write javascript');

function getRandomColor() {
    // Generate a random hex color
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function applyRandomGradient() {
    let randomColor = getRandomColor(); // Get a random color
    let gradient = `linear-gradient(to bottom,
        ${randomColor} 10%,  /* Start with random color */
        ${randomColor}BF 25%,  /* Lighter shade (hex + BF for opacity) */
        ${randomColor}80 40%,  /* Even lighter */
        #121212 50%,  /* Blend into dark theme */
        #181818 80%,
        #1F1F1F 90%,
        #1F1F1F 100%)`;

    document.querySelector(".right").style.background = gradient;
}

// Apply the gradient when the page loads
window.onload = applyRandomGradient;




const username = "lakshitssharma110910"; // GitHub username
const repo = "music-player";             // Your repo name
const branch = "main";                   // Repo branch (likely 'main')
let currFolder = "docs/Shubh";
let Songs = [];

async function getSongs(folder) {
    currFolder = folder;
    const apiURL = `https://api.github.com/repos/${username}/${repo}/contents/${folder}`;
    const response = await fetch(apiURL);
    const data = await response.json();

    Songs = data
        .filter(file => file.name.endsWith(".mp3") || file.name.endsWith(".wav"))
        .map(file => file.name);

    const songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (const song of Songs) {
        songUL.innerHTML += `
            <li> 
                <img src="music.svg" style="width: 30px;" alt="">
                <div class="infosong">
                    <div class="songname">${song.replace(".mp3", "").replace(".wav", "")}</div>
                    <div class="artistname">Lakshit</div>
                </div>
                <div class="playnow">
                    <img src="player.svg" style="width: 24px;" alt="">
                </div>
            </li>`;
    }

    document.querySelectorAll(".songlist li").forEach(e => {
        e.addEventListener("click", () => {
            const songName = e.querySelector(".songname").textContent.trim();
            const matched = Songs.find(s => s.startsWith(songName));
            playMusic(matched);
        });
    });

    return Songs;
}

const playMusic = (track, pause = false) => {
    const rawURL = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${currFolder}/${track}`;
    currentSong.src = rawURL;

    if (!pause) {
        currentSong.play();
        playy.src = "pause.svg";
    }

    document.querySelector(".songPic").innerHTML = `<img src="music.svg" style="width: 34px;" alt="">` + track.slice(0, -4);
    document.querySelector(".info").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
    const albumsAPI = `https://api.github.com/repos/${username}/${repo}/contents/docs`;
    const response = await fetch(albumsAPI);
    const folders = await response.json();

    const cardContainer = document.querySelector(".cardContainer");
    for (const folder of folders) {
        if (folder.type === "dir") {
            try {
                const infoURL = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/docs/${folder.name}/info.json`;
                const res = await fetch(infoURL);
                const info = await res.json();

                cardContainer.innerHTML += `
                    <div data-folder="docs/${folder.name}" class="card trans border">
                        <div class="play">
                            <svg viewBox="-0.5 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                <polygon points="371 3605 371 3613 378 3609"></polygon>
                            </svg>
                        </div>
                        <img src="https://raw.githubusercontent.com/${username}/${repo}/${branch}/docs/${folder.name}/cover.jpeg" alt="">
                        <h2>${info.title}</h2>
                        <p>${info.description}</p>
                    </div>`;
            } catch (e) {
                console.error(`Skipping folder ${folder.name}:`, e);
            }
        }
    }

    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async item => {
            const folder = item.currentTarget.dataset.folder;
            Songs = await getSongs(folder);
            playMusic(Songs[0]);
        });
    });
}

async function main() {
    await getSongs("docs/Shubh");
    playMusic(Songs[0], true);
    displayAlbums();


   

    // Play event listener 
    playy.addEventListener("click", () => {
        if (currentSong.paused) { 
            currentSong.play(); 
            playy.src="pause.svg";
        }
        else {
            currentSong.pause();
            playy.src="player.svg";
        }
    })

    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {  // Check if the spacebar is pressed
            event.preventDefault(); // Prevent page scrolling
            
            let playButton = document.querySelector("#playy"); // Change selector to match your play button
            if (currentSong.paused) {
                currentSong.play();
                playButton.src = "pause.svg";
            } else {
                currentSong.pause();
                playButton.src = "player.svg";
            }
        }
    });
    

    // Listen for time update
    currentSong.addEventListener("timeupdate", () => {
        let progress = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".circle").style.left = progress + "%";
        
        // Update background to reflect current progress
        document.querySelector(".seekbar").style.background = 
            `linear-gradient(to right, white ${progress}%, #4D4D4D ${progress}%)`;
    
        // Update time text
        document.querySelector(".info").innerHTML = 
            `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
    });
    

    // Add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".hamburger").style.visibility = "hidden";
});

// Add an event listener for close button
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".hamburger").style.visibility = "visible";
});

// Detect clicks on navbar only if sidebar is open
if (window.matchMedia("(max-width: 850px)").matches) {
    document.addEventListener("click", (event) => {
        let leftPanel = document.querySelector(".left");
        let navbar = document.querySelector(".navbar");
        let right = document.querySelector(".right");

        if ((getComputedStyle(leftPanel).left === "0px" && navbar.contains(event.target)) ||
            (getComputedStyle(leftPanel).left === "0px" && right.contains(event.target))) {
            leftPanel.style.left = "-100%";
            document.querySelector(".hamburger").style.visibility = "visible";
        }
    });
}

// Add an event listener to previous and next
prevv.addEventListener("click", async () => {
    console.log("Previous clicked");

    let currentFilename = decodeURIComponent(currentSong.src.split("/").pop());
    let index = Songs.indexOf(currentFilename);

    if (index === 0) {  // If first song, go to last song
        index = Songs.length;
    }

    await currentSong.pause();  // Ensure the song is paused before switching
    playMusic(Songs[index - 1]);  // Play the previous song
});

// Add an event listener to next
nextt.addEventListener("click", async () => {
    console.log("Next clicked");

    let currentFilename = decodeURIComponent(currentSong.src.split("/").pop());
    let index = Songs.indexOf(currentFilename);

    if (index === Songs.length - 1) {  // If last song, go to first song
        index = -1;
    }

    await currentSong.pause();  // Ensure the song is paused before switching
    playMusic(Songs[index + 1]);  // Play the next song
});

// VOLUME

let volumeIcon = document.querySelector(".volume img");
let volumeSlider = document.querySelector(".volume input");

// Set initial volume
currentSong.volume = 1;  // Default volume (50%)
volumeSlider.value = currentSong.volume * 100;

// Update volume when slider changes
volumeSlider.addEventListener("input", () => {
    currentSong.volume = volumeSlider.value / 100;
    updateVolumeIcon();
});

// Mute/Unmute when clicking the volume icon
volumeIcon.addEventListener("click", () => {
    if (currentSong.volume > 0) {
        currentSong.volume = 0;
        volumeSlider.value = 0;
    } else {
        currentSong.volume = 0.5;
        volumeSlider.value = 50;
    }
    updateVolumeIcon();
});

// Function to update volume icon
function updateVolumeIcon() {
    if (currentSong.volume === 0) {
        volumeIcon.src = "mute.svg";
    } else if (currentSong.volume < 0.5) {
        volumeIcon.src = "low-volume.svg";
    } else {
        volumeIcon.src = "volume.svg";
    }
}






}

main();