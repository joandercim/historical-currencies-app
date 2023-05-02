let curPer = 0;
const date = document.getElementById('date');
const amount = document.getElementById('amount');
const form = document.getElementById('form');
const currencyListFrom = document.getElementById('currency-pick-from');
const currencyListTo = document.getElementById('currency-pick-to');

async function getData(date, base) {
  const res = await fetch(`https://api.exchangerate.host/${date}?base=${base}`);
  const data = await res.json();
  return data;
}

async function generateCurrenciesFrom() {
  const data = await getData('2023-01-01');
  Object.keys(data.rates).forEach((rate) => {
    const optionTo = document.createElement('option');
    const optionFrom = document.createElement('option');
    optionFrom.id = `${rate}-from`;
    optionFrom.innerText = `${rate}`;
    currencyListFrom.appendChild(optionFrom);

  optionTo.id = `${rate}-to`;
  optionTo.innerText = `${rate}`;
  currencyListTo.appendChild(optionTo);
  });
}

// Av användaren inmatat datum
async function userInput(e) {
  let userDate = date.value;
  const base = currencyListFrom.value;
  
  e.preventDefault();

  const data = await getData(userDate, base);
  const userAmount = amount.value;
  const fromCurrency = currencyListTo.value;
  const reply = data.rates[fromCurrency];

  printResult(reply, userAmount, userDate, fromCurrency, base);
}

function printResult(reply, userAmount, userDate, fromCurrency, base) {
    const result = userAmount * reply;

    if (!document.querySelector('h2').classList.contains('visible')) {
      draw();
    }
    
    
    document.querySelector('h2').textContent = `${reply.toFixed(3)}`;
    document.querySelector('h2').classList.add('visible');
    document.querySelector('h2').style.opacity = '1';
    document.getElementById('circle').style.opacity = '1';
    document.getElementById('row-2').innerHTML = `${fromCurrency}`; 
    document.getElementById('row-1').innerHTML = `${userDate} <br>motsvarade 1 ${base}`; 



    document.getElementById('total').innerHTML  = `${userAmount} ${base} är lika med <br>
    <span class="bigger">${result.toFixed(2)}</span> <br>${fromCurrency}`; 

    document.querySelector('main').style.height = '600px';
    // document.querySelector('form').style.padding = '5px 20px';

    setTimeout(() => {
      showResponse();
    }, 200);
  }

// CANVAS
function draw(currentPercent) {
  const canvas = document.getElementById('circle');
  const ctx = canvas.getContext('2d');
  const radius = 120;
  const endPercent = 75;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = '7';
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.arc('130', '130', radius, 0, curPer * currentPercent, false);
  ctx.stroke();
  
  curPer++;

  if (curPer < endPercent) {
    requestAnimationFrame(function () {
      draw(curPer / 400);
    });
  }
}

function showResponse() {
  document.querySelector('.response').style.opacity = '1';
}


function init() {

}

init();

form.addEventListener('submit', userInput);
window.addEventListener('DOMContentLoaded', generateCurrenciesFrom);
// window.addEventListener('DOMContentLoaded', generateCurrenciesTo);

const dateToday = new Date();