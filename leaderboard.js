const totalMechs = 911;
const base_url = 'https://m.cyberbrokers.com/eth/mech/';

let randomIndex1, randomIndex2;
let imageScores = {};

window.onload = async function() {
    await loadScores();
    // displaySortedImages();
    displayMechs();
};

function getSortedKeys(obj) {
    var keys = Object.keys(obj);
    return keys.sort(function(a,b){return obj[b]-obj[a]});
}

async function getScores(){
    let url = 'https://mech-models.glitch.me/mech-scores';
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}

async function loadScores(){
    let scores = await getScores();
    imageScores = {};
    let total = 0;
    scores.forEach((score)=>{
        imageScores[score.token_id] = score.score;
        total += score.score;
    })
    document.getElementById('total_votes').innerHTML = total + ' Total Votes!';
    document.getElementById('total_scores').innerHTML = scores.length + ' Mechs Scored!';
}

// Fetch the JSON data from the API
const fetchMechs = async (token) => {
    const url = `https://m.cyberbrokers.com/eth/mech/${token}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
let mechs = [];
  const fetchAllMechs = async ()=>{
    for(let i= 964; i <= 1010; i++){
        let mech = await fetchMechs(i);
        console.log(i);
        mechs.push(mech);
    }
  }
const createMechCard = (mech, res) => {
    // Create the elements for the card
    const card = document.createElement("div");
    card.classList.add('card');
    
    const name = document.createElement("h2");
    // name.className = 'card-heading';

    const icon = document.createElement('a');
    icon.setAttribute('href', 'https://opensea.io/assets/ethereum/0xb286ac8eff9f44e2c377c6770cad5fc78bff9ed6/'+mech.tokenId);
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
    image.src = mech.image;

    let speed = mech.attributes.find(attr => attr.trait_type === "Speed").value;
    let endurance = mech.attributes.find(attr => attr.trait_type === "Endurance").value;
    let power = mech.attributes.find(attr => attr.trait_type === "Power").value;

    let html = `
      <p style="display: none;">${mech.clean_description}</p>
      <div class="stats">
    `;

    html += addSegment('Speed', speed);
    html += addSegment('Endurance', endurance);
    html += addSegment('Power', power);

    html += '<div style="text-align: center;width: 100%;">'+imageScores[mech.tokenId-1]+' Votes!</div>';

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

  function getMech(tokenId){
    return metadata.find((meta)=>meta.tokenId == tokenId);
  }

  function displayMechs(){
    let container = document.querySelector("#mech-container"); 
    
    let orderedImages = getSortedKeys(imageScores);

    orderedImages.forEach((tokenId)=>{
        let mech = getMech(parseInt(tokenId)+1);
        container.appendChild(createMechCard(mech));
    })
    
  }
  const addSegment = (title, value) => {
    const activeSegments = Math.round((value / 30) * 6);
    let html = `<div class="bar-container" id="${title}">
                    <span class="label">${title} (${value}):</span>
                    <div class="bar">`;
    for(let i=0; i<6; i++){
      let opacity = 0;
      if (i < activeSegments) {
        opacity = 1;
      }
      html += '<div class="segment" style="opacity: '+opacity+'"></div>';
    }
    html += `</div>
    </div>`;
    return html;
  }