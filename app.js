import PianoRoll from './pianoroll.js';

const pianoField = document.querySelector('.pianoRollContainer');
const mainPiano = document.querySelector('.mainPiano')

class PianoRollDisplay {
  constructor(csvURL) {
    this.csvURL = csvURL;
    this.data = null;
    this.selctedSVG = null;
    this.selectedIndex = 0;
  }

  async loadPianoRollData() {
    try {
      const response = await fetch('https://pianoroll.ai/random_notes');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  preparePianoRollCard(rollId) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('piano-roll-card');

    // Create and append other elements to the card container as needed
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    descriptionDiv.textContent = `This is a piano roll number ${rollId}`;
    cardDiv.appendChild(descriptionDiv);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('piano-roll-svg');
    svg.setAttribute('width', '80%');
    svg.setAttribute('height', '150');

    // Append the SVG to the card container
    cardDiv.appendChild(svg);

    // Adding functionality to zoom in and become the main element on the page
    cardDiv.addEventListener('click', () => {
      /* pianoField.classList.add('showCard');
      mainPiano.classList.add('active');
      mainPiano.innerHTML = ''; */

      if(this.selctedSVG){
        pianoField.insertBefore(this.selctedSVG, pianoField.children[this.selectedIndex]);
        pianoField.querySelectorAll('.piano-roll-svg').forEach(roll => {
          roll.classList.remove('mainPianoSVG')
          let chooseSpace = roll.querySelector('.chooseSpace');
          /* let cross = roll.parentNode.getElementById('crossRect') */
          if(chooseSpace) chooseSpace.remove();


        }) 
        pianoField.querySelectorAll('.piano-roll-card').forEach(card => {
          let cross = card.querySelector('.crossRect');
          if(cross) cross.remove();
        })
      }

      pianoField.classList.add('showCard');
      mainPiano.classList.add('active');
      mainPiano.innerHTML = '';
      svg.classList.add('mainPianoSVG')
      this.selctedSVG = cardDiv;
      this.selectedIndex = Array.from(pianoField.children).indexOf(this.selctedSVG)
      mainPiano.appendChild(cardDiv);
    })

    return { cardDiv, svg }
  }

  async generateSVGs() {
    if (!this.data) await this.loadPianoRollData();
    if (!this.data) return;
    
    const pianoRollContainer = document.querySelector('.pianoRollContainer');
    pianoRollContainer.innerHTML = '';
    for (let it = 0; it < 20; it++) {
      const start = it * 60;
      const end = start + 60;
      const partData = this.data.slice(start, end);

      const { cardDiv, svg } = this.preparePianoRollCard(it)

      pianoRollContainer.appendChild(cardDiv);
      const roll = new PianoRoll(svg, partData);
    }
  }
}

document.getElementById('loadCSV').addEventListener('click', async () => {
  const csvToSVG = new PianoRollDisplay();
  await csvToSVG.generateSVGs();
});
