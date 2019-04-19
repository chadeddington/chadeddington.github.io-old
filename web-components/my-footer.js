// const style = document.createElement('style');
/** we could set our own custom styles */
// style.textContent = ` 
// .thing {
//   color: green
// }

const template = document.createElement('template')
template.innerHTML = `
  <footer>
  <div class="links">
    <div class="column">
    <h3 class="link">Main</h3>
    <div class="link"><a href="/index.html">Home</a></div>
    <div class="link"><a href="/cit261/index.html">CIT 261</a></div>
    <div class="link"><a href="/views/skills.html">Skills</a></div>
  </div>

    <div class="column">
      <h3 class="link">Games</h3>
      <div class="link"><a href="/projects/phaser/zelda">Zelda</a></div>
      <div class="link"><a href="/projects/phaser/phaser-dude/phaser-dude.html">Phaser Dude</a></div>
      <div class="link"><a href="/projects/snake.html">Snake</a></div>
    </div>

    <div class="column">
      <h3 class="link"><a href="/cit261/index.html">CIT 261</a></h3>
      <div class="link"><a href="/cit261/basic_fluency.html">Basic Fluency</a></div>
      <div class="link"><a href="/cit261/working_fluency.html">Working Fluency</a></div>
      <div class="link"><a href="/cit261/skilled_fluency.html">Skilled Fluency</a></div>
    </div>
    
    <div class="column">
      <h3 class="link">Misc</h3>
      <div class="link"><a href="https://chadeddington.github.io/sprites/">Sprite Animation</a></div>
      <div class="link"><a href="https://chadeddington.github.io/isometric/">Isometric View</a></div>
      <div class="link"><a href="/projects/web-audio">Using Web Audio</a></div>
    </div>
  </div>
  </footer>
`;

customElements.define('my-footer', class MyFooter extends HTMLElement {

  $(selector) {
    return this.shadowRoot && this.shadowRoot.querySelector(selector)
  }

  constructor() {
    super()
    // If we add shadowRoot styles won't bleed...
    // ...in this case, I want styles to bleed
    const root = this // this.attachShadow({mode: 'open'})
          root.appendChild(template.content.cloneNode(true))
          // root.appendChild(style);
  }

  connectedCallback() {
    // We could do stuff
  }
});