class MyHome extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section>
        <h1>Native Web Component Portfolio</h1>
        <p>Let's gooo.</p>
      </section>
    `;
  }
}

customElements.define('my-home', MyHome);