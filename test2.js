const { JSDOM } = require('jsdom');
const dom = new JSDOM(`<button id="btn" onclick="executeTrade()">Trade</button>`);
const btn = dom.window.document.getElementById('btn');
let fired = false;
btn.addEventListener('click', () => { fired = true; });
try {
  btn.click();
} catch (e) {
  console.log("Error caught:", e.message);
}
console.log("Was addEventListener fired?", fired);
