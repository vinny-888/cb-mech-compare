const totalMechs = 1380;
const base_url = 'https://m.cyberbrokers.com/eth/mech/';

let randomIndex1, randomIndex2;
let imageScores = {};
let selectNewMechsFirst = false;
let minVotes = 0;
let maxVotes = 0;
let brokenMechs = [836, 837, 821, 863, 1079, 1152];

window.onload = async function() {

    document.onkeydown = checkKey;

    await loadScores();
    newMechs();
};

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
        // left arrow
        increaseScoreLeft();
    }
    else if (e.keyCode == '39') {
        // right arrow
        increaseScoreRight();
    } else if (e.keyCode == '38') {
        // up
        newMechs();
    }

}

function displayRandomImages() {
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    const name1 = document.getElementById('name1');
    const name2 = document.getElementById('name2');
    
    // Get two distinct random indices
    do {
        if(selectNewMechsFirst && unscoredMechs.length > 0){
            let randomUnscoredMech = Math.floor(Math.random() * unscoredMechs.length)
            randomIndex1 = unscoredMechs[randomUnscoredMech];
        } else {
            randomIndex1 = Math.floor(Math.random() * totalMechs);
        }
        
        if(selectNewMechsFirst && unscoredMechs.length > 0){
            let randomUnscoredMech = Math.floor(Math.random() * unscoredMechs.length)
            randomIndex2 = unscoredMechs[randomUnscoredMech];
        } else {
            randomIndex2 = Math.floor(Math.random() * totalMechs);
        }
        
    } while (randomIndex1 === randomIndex2);
    
    // Set the source of the images to the URLs at the random indices
    image1.src = "https://m.cyberbrokers.com/eth/mech/"+randomIndex1 + "/files/nft_image.webp";
    image2.src = "https://m.cyberbrokers.com/eth/mech/"+randomIndex2 + "/files/nft_image.webp";

    name1.innerHTML = names[randomIndex1];
    name2.innerHTML = names[randomIndex2];
}

function newMechs(){
    displayRandomImages();
    displaySortedImages();
}

async function increaseScoreLeft() {
    await updateAndLoadScores(randomIndex1, randomIndex2 );
    newMechs();
}

async function increaseScoreRight() {
    await updateAndLoadScores(randomIndex2, randomIndex1);
    newMechs();
}

function displaySortedImages(){
    // Sort image data by score in descending order
    let orderedImages = getSortedKeys(imageScores);

    // Display the sorted images in the side panel
    const imageSortedList = document.getElementById('image-list');
    imageSortedList.innerHTML = '';

    let stats = {};
    orderedImages.forEach(index => {
        let score = imageScores[index];
        if(!stats[score.score]){
            stats[score.score] = 0;
        }
        stats[score.score]++;
    });

    Object.keys(stats).reverse().forEach((key)=>{
        let stat = stats[key];
        let imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <div>
            ${key}
            </div>
            <span class="image-score">${stat}</span>
        `;
        imageSortedList.appendChild(imageItem);
    });
    /*
    orderedImages.forEach(index => {
        let score = imageScores[index];
        let imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <div>
                <div class="name">${names[index]}</div>
                <div>
                    <a href="https://opensea.io/assets/ethereum/0xb286ac8eff9f44e2c377c6770cad5fc78bff9ed6/${parseInt(index)+1}" target="_blank">
                    <img src="${imageList[index]}" alt="Image" width="100">
                    </a>
                </div>
            </div>
            <span class="image-score">${score}</span>
        `;
        imageSortedList.appendChild(imageItem);
    });
    */
}

function getSortedKeys(obj) {
    var keys = Object.keys(obj);
    return keys.sort(function(a,b){return obj[b]-obj[a]});
}

async function updateScore(tokenId1, tokenId2){
    let url = 'https://mech-models.glitch.me/mech-score?id1='+tokenId1 + '&id2='+tokenId2;;
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

async function updateAndLoadScores(tokenId1, tokenId2){
    await updateScore(tokenId1, tokenId2);
    await loadScores();
}

let unscoredMechs = [];
function createUnscoredArr(scores){
    unscoredMechs = [];
    for(let i=1; i<=totalMechs; i++){
        // Exclude broken mechs
        if(brokenMechs.indexOf(i-1) == -1){
            unscoredMechs.push(i);
        }
    }
    scores.forEach((score)=>{
        var index = unscoredMechs.indexOf(parseInt(score.token_id));
        if (index !== -1 && (score.score < minVotes || score.score > maxVotes)) {
            unscoredMechs.splice(index, 1);
        }
    });
}

async function loadScores(){
    let scores = await getScores();
    imageScores = {};
    let total = 0;
    scores.forEach((score)=>{
        imageScores[score.token_id] = score;
        total += score.wins;
    })
    document.getElementById('total_votes').innerHTML = total + ' Total Battles!';
    document.getElementById('total_scores').innerHTML = scores.length + ' Mechs Battled!';
    if(selectNewMechsFirst){
        createUnscoredArr(scores);
    }
}

let imageList2 = [];
let nameList = [];
async function getImage(tokenId){
    let url = base_url + tokenId;
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData.image;
}
async function getName(tokenId){
    let url = base_url + tokenId;
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData.name;
}

async function getAllImages(){
    for(let i=1010; i<=totalMechs; i++){
        let url = await getImage(i);
        console.log(i, url);
        nameList.push(url);
    }
}

async function getAllNames(){
    for(let i=1010; i<=totalMechs; i++){
        let name = await getName(i);
        console.log(i, name);
        nameList.push(name);
    }
}

function openLeftImage(){
    let url = "https://opensea.io/assets/ethereum/0xb286ac8eff9f44e2c377c6770cad5fc78bff9ed6/"+(randomIndex1+1);
    window.open(url, '_blank');
}

function openRightImage(){
    let url = "https://opensea.io/assets/ethereum/0xb286ac8eff9f44e2c377c6770cad5fc78bff9ed6/"+(randomIndex2+1);
    window.open(url, '_blank');
}
