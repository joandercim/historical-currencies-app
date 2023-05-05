let curPer = 0;
const alertBar = document.querySelector('.alert'); 
const date = document.getElementById('date');
const amount = document.getElementById('amount');
const form = document.getElementById('form');
const currencyListFrom = document.getElementById('currency-pick-from');
const currencyListTo = document.getElementById('currency-pick-to');
const swapBtn = document.querySelector('.fa-right-left');

async function getData(date, base) {
  const res = await fetch(`https://api.exchangerate.host/${date}?base=${base}`);
  const data = await res.json();
  return data;
}

// Create list options from API
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
  e.preventDefault();
  let userDate = date.value;

  if (checkInput()) {
    if (checkDate(userDate)) {
  const base = currencyListFrom.value;
  const fromCurrency = currencyListTo.value;  
  
  const data = await getData(userDate, base);
  const userAmount = amount.value;
  const reply = data.rates[fromCurrency];


  printResult(reply, userAmount, userDate, fromCurrency, base);
} else {
  showAlert('date');
}
  } else {
    showAlert('Du har inte fyllt i alla fält');
  }

}

function printResult(reply, userAmount, userDate, fromCurrency, base) {
    const result = userAmount * reply;

    if (!document.querySelector('h2').classList.contains('visible')) {
      draw();
    }
    
    
      document.querySelector('h2').textContent = `${reply.toFixed(3).replace('.', ',')}`;
      document.querySelector('h2').classList.add('visible');
      document.querySelector('h2').style.opacity = '1';
      document.getElementById('circle').style.opacity = '1';
      document.getElementById('row-2').innerHTML = `${fromCurrency}`; 
      document.getElementById('row-1').innerHTML = `${userDate} <br>motsvarade 1 ${base}`; 



    document.getElementById('total').innerHTML  = `${userAmount} ${base} är lika med <br>
    <span class="bigger">${result.toFixed(2).replace('.', ',')}</span><br>${fromCurrency}`; 

    document.querySelector('main').style.height = '610px';

    setTimeout(() => {
      showResponse();
    }, 200);
  }

function checkInput() {
  const base = currencyListFrom.value;
  const fromCurrency = currencyListTo.value;  
  
  if (currencyListFrom.value !== 'value' && fromCurrency !== 'value') {
    return true;
  } else {
    return false;
  }
}


function checkDate(givenDate) {
  const d = new Date();
  let day = d.getDay().toString();
  let month = (d.getMonth() + 1).toString();
  let year = d.getFullYear().toString();

  if (month.length < 2) {
    month = '0' + month;
  }

  if (day.length < 2) {
    day = '0' + day;
  }

  const dateArr = [year, month, day,];

  const currentDate = dateArr.join('-');

  if (currentDate > givenDate || currentDate === givenDate) {
    return true;
  } else {
    return false;
  }
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

function swapCurrencies() {
  if (currencyListTo.value && currencyListFrom.value) {
    const submitBtn = document.getElementById('submit');
    let fromToSwap = currencyListFrom.value;
    let toToSwap = currencyListTo.value;

    currencyListFrom.value = toToSwap;
    currencyListTo.value = fromToSwap;

    submitBtn.click();
  }
}

function hideAlert() {
  alertBar.style.opacity = '0';
}

function showAlert(message) {
  alertBar.style.opacity = '1';

  let errorMsg;

  if (message === 'date') {  
    errorMsg = 'Datum måste vara dagens datum eller tidigare';
    document.getElementById('alert-text').innerText = errorMsg;
  } else {
    errorMsg = 'Vänligen fyll i fälten "från" och "till"';
    document.getElementById('alert-text').innerText = errorMsg;
  }

  setTimeout(() => {
    alertBar.style.opacity = '0';
  }, 4000);
}

swapBtn.addEventListener('click', swapCurrencies);
form.addEventListener('submit', userInput);
window.addEventListener('DOMContentLoaded', generateCurrenciesFrom);
document.querySelector('.fa-xmark').addEventListener('click', hideAlert);