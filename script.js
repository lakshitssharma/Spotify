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




let currentSong = new Audio()
let Songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder = "Shubh") {
    currFolder = folder; // ✅ ensure it's updated for playMusic()

    let res = await fetch("songs.json");
    let data = await res.json();

    if (!data.hasOwnProperty(folder)) {
        console.error(`Folder '${folder}' not found in songs.json`);
        return [];
    }

    let folderData = data[folder];
    let metadata = folderData[0];
    let songPaths = folderData.slice(1).filter(f => f.endsWith(".mp3") || f.endsWith(".wav"));

    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (const songPath of songPaths) {
        let fileName = songPath.split("/").pop(); // eg: One Love.wav
        let songName = fileName.replace(".mp3", "").replace(".wav", "");

        songUL.innerHTML += `
        <li> 
            <img src="music.svg" style="width: 30px;" alt="">
            <div class="infosong">
                <div class="songname">${songName}</div>
                <div class="artistname">Lakshit</div>
            </div>
            <div class="playnow">
                <img src="player.svg" style="width: 24px;" alt="">
            </div>
        </li>`;
    }

    // Add click handlers
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((li, i) => {
        li.addEventListener("click", () => {
            let fullPath = songPaths[i]; // already complete path
            console.log(`Playing: ${fullPath}`);
            playMusic(fullPath); // You must define this function
        });
    });

    return songPaths;
}




const playMusic = (track, pause = false) => {
    currentSong.src = `/${track}`;
    
    if (!pause) {
        currentSong.play();
        playy.src = "pause.svg";
    }

    // Extract the filename without path and extension
    let songName = track.split("/").pop().replace(".wav", "").replace(".mp3", "");

    document.querySelector(".songPic").innerHTML = `<img src="music.svg" style="width: 34px;" alt=""> ${songName}`;
    document.querySelector(".info").innerHTML = "00:00 / 00:00";
};


async function displayAlbums() {
    let a = await fetch("songs.json");
let data = await a.json(); // No need for DOMParser here

let cardContainer = document.querySelector(".cardContainer");

// Loop through each folder in the JSON
for (let folder in data) {
    let info = data[folder][0]; // First element contains the title and description

    cardContainer.innerHTML += `
    <div data-folder="${folder}" class="card trans border ">
        <div class="play"> 
            <svg viewBox="-0.5 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <title>play [#1001]</title>
                    <desc>Created with Sketch.</desc>
                    <defs> </defs>
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Dribbble-Light-Preview" transform="translate(-427.000000, -3765.000000)"
                            fill="#000000">
                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                <polygon id="play-[#1001]" points="371 3605 371 3613 378 3609">
                                </polygon>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
        <img src="/Songs/${folder}/Cover.jpeg" alt="">
        <h2>${info.title}</h2>
        <p>${info.description}</p>
    </div>`;
}

// Load the playlist whenever card is clicked 
Array.from(document.getElementsByClassName("card")).forEach(e=>{
e.addEventListener("click",async item=>{
    Songs = await getSongs(item.currentTarget.dataset.folder);
    playMusic(Songs[0])
    
})
})
    } 


async function main() {


    let Songs= await getSongs();
    // console.log(Songs);

    playMusic(Songs[0],true)

    // Display all the albums on the page
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
    document.querySelector(".left").style.left = "-150%";
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
            leftPanel.style.left = "-150%";
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