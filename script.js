const totalMechs = 909;
const base_url = 'https://m.cyberbrokers.com/eth/mech/';

let randomIndex1, randomIndex2;
let imageScores = {};

window.onload = async function() {

    document.onkeydown = checkKey;

    await loadScores();
    displayRandomImages();
    displaySortedImages();
};

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
    // left arrow
    increaseScoreLeft();
    }
    else if (e.keyCode == '39') {
    // right arrow
    increaseScoreRight();
    }

}

function displayRandomImages() {
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    
    // Get two distinct random indices
    do {
        randomIndex1 = Math.floor(Math.random() * totalMechs);
        randomIndex2 = Math.floor(Math.random() * totalMechs);
    } while (randomIndex1 === randomIndex2 || imageList[randomIndex1] == '' || imageList[randomIndex2] == '');
    
    // Set the source of the images to the URLs at the random indices
    image1.src = imageList[randomIndex1];
    image2.src = imageList[randomIndex2];
}

async function increaseScoreLeft() {
    await updateAndLoadScores(randomIndex1);
    displayRandomImages();
    displaySortedImages();
}

async function increaseScoreRight() {
    await updateAndLoadScores(randomIndex2);
    displayRandomImages();
    displaySortedImages();
}

function displaySortedImages(){
    // Sort image data by score in descending order
    let orderedImages = getSortedKeys(imageScores);

    // Display the sorted images in the side panel
    const imageSortedList = document.getElementById('image-list');
    imageSortedList.innerHTML = '';
    orderedImages.forEach(index => {
        let score = imageScores[index];
        let imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <a href="https://opensea.io/assets/ethereum/0xb286ac8eff9f44e2c377c6770cad5fc78bff9ed6/${parseInt(index)+1}" target="_blank">
            <img src="${imageList[index]}" alt="Image" width="100">
            </a>
            <span class="image-score">${score}</span>
            
        `;
        imageSortedList.appendChild(imageItem);
    });
}

function getSortedKeys(obj) {
    var keys = Object.keys(obj);
    return keys.sort(function(a,b){return obj[b]-obj[a]});
}

async function updateScore(tokenId){
    let url = 'https://mech-models.glitch.me/mech-score?id='+tokenId;
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}

async function getScores(){
    let url = 'https://mech-models.glitch.me/mech-scores';
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}

async function updateAndLoadScores(tokenId){
    await updateScore(tokenId);
    await loadScores();
}

async function loadScores(){
    let scores = await getScores();
    imageScores = {};
    scores.forEach((score)=>{
        imageScores[score.token_id] = score.score;
    })
}

let imageList2 = [];
async function getImage(tokenId){
    let url = base_url + tokenId;
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData.image;
}

async function getAllImages(){
    for(let i=838; i<totalMechs; i++){
        let url = await getImage(i);
        console.log(i, url);
        imageList2.push(url);
    }
}