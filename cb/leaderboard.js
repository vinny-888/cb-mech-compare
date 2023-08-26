const totalMechs = 10001;
const base_url = 'https://m.cyberbrokers.com/eth/mech/';

let pageSize = 100;
let loadedCount = 0;
let randomIndex1, randomIndex2;
let imageScores = {};
let sortOrder = 'most';

window.onload = async function() {
    await loadScores();
    // displaySortedImages();
    displayMechs();
};

function resort(){
  sortOrder = document.getElementById('sortorder').value;
  pageSize = 100;
  loadedCount = 0;
  displayMechs();
}

function getSortedKeys(obj) {
    var keys = Object.keys(obj);
    if(sortOrder == 'most'){
      return keys.sort(function(a,b){return obj[b]-obj[a]});
    } else {
      return keys.sort(function(a,b){return obj[a]-obj[b]});
    }
}

async function getScores(){
    let url = 'https://mech-models.glitch.me/cb-scores';
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}

async function loadScores(){
    let scores = await getScores();
    imageScores = {};
    let total = 0;
    scores.forEach((score)=>{
        imageScores[score.token_id] = score;
        total += score.wins;
    })
    document.getElementById('total_votes').innerHTML = total + ' Total Matches!';
    document.getElementById('total_scores').innerHTML = scores.length + ' CyberBrokers Battled!';
}

const createMechCard = (mech, res) => {
  if(!mech){
    return;
  }
    // Create the elements for the card
    const card = document.createElement("div");
    card.classList.add('card');
    
    const name = document.createElement("h2");
    // name.className = 'card-heading';

    const icon = document.createElement('a');
    icon.setAttribute('href', 'https://opensea.io/assets/ethereum/0x892848074ddea461a15f337250da3ce55580ca85/'+mech.token_id);
    icon.setAttribute('target', '_blank');
    icon.onclick = (e) => {e.stopPropagation();};
    const img = document.createElement('img');
    img.src = './opensea.png';
    img.className = 'card-heading-icon';
    icon.appendChild(img);

    const nameLabel = document.createElement('div');
    nameLabel.className = 'card-heading';
    nameLabel.textContent = mech.name;
    name.appendChild(nameLabel);
    name.appendChild(icon);


    const image = document.createElement("img");
    const attributes = document.createElement("div");
  
    // Set the content of the elements
    // name.textContent = mech.name;
    image.setAttribute('crossOrigin', "anonymous");
    image.src = 'https://ipfs.io/ipfs/QmcsrQJMKA9qC9GcEMgdjb9LPN99iDNAg8aQQJLJGpkHxk/'+mech.token_id+'.svg'

    // let speed = mech.attributes.find(attr => attr.trait_type === "Speed").value;
    // let endurance = mech.attributes.find(attr => attr.trait_type === "Endurance").value;
    // let power = mech.attributes.find(attr => attr.trait_type === "Power").value;

    // <p style="display: none;">${mech.clean_description}</p>
    let html = `
   
    <p style="display: none;"></p>
      <div class="stats">
    `;

    html += addSegment('Ranking', mech.score);
    html += addSegment('Wins', mech.wins);
    html += addSegment('Losses', mech.losses);

    html += '<div style="text-align: center;width: 100%;">'+imageScores[mech.token_id]+' Votes!</div>';

    html += '</div>';

    attributes.innerHTML = html;
  
    // Add the elements to the card
    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(attributes);
  
    // Add a click event listener to show the modal
    card.addEventListener("click", () => showModal(mech, currentRes));

      
  
    return card;
  };

  function loadMore(){
    pageSize += 100;
    displayMechs();
  }

  function displayMechs(){
    let container = document.querySelector("#mech-container"); 
    container.innerHTML = '';
    let orderedImages = getSortedKeys(imageScores);

    [].concat(orderedImages).splice(loadedCount,Math.min(orderedImages.length, pageSize)).forEach((tokenId)=>{
        let cb = parseInt(tokenId);
        if(cb){
          let card = createMechCard(imageScores[cb]);
          container.appendChild(card);
        }
    })
    
  }
  const addSegment = (title, value) => {
    let html = `<div class="bar-container" id="${title}">
      <span class="label">${title} (${value}):</span>
    </div>`;
    return html;
  }