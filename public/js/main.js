// house gardner work
// server side system to keep track of the wins and losses and a way to keep track of the money.
// The client can make bets and wins and loses

// 1. We will allow the user to choose a number from 1 to 10000. And a color, black or red. 
// 2.When the user clicks the button, it will randomize the colors and based on the which color they choose, they can win or lose.
// 3. This also includes a GREEN color that although a low chance, they will lose all their money. 

// 36 numbers between red and black. 18 for each. 1for the green area. So Math.random up to 37 numbers.

//make an admin sign up and login. and remove signup.
//Game will be the index page. 

let userBank = Number(document.querySelector('.moneyValue').innerText.replace('$', ''))
let casinoBank = Number(document.querySelector('.moneyValue').innerText.replace('$', '')) * -1
let wins = Number(document.querySelector('.winsValue').innerText)
let losses = Number(document.querySelector('.lossesValue').innerText)
// let results

document.querySelector('button').addEventListener('click', minBet)

let result = document.querySelector('h2 span')
let userWins = document.querySelector('.wins span')
let userLoss = document.querySelector('.losses span')
let UserRemaining = document.querySelector('h4 span')

function minBet() {
  const userBet = parseInt(document.querySelector('#userNumber').value)
  if (userBet <= 10) {
    document.querySelector('h2 span').innerText = 'Too little'
  }
  else {
    roulette(userBet)
    document.querySelector("h2 span").innerText = "";
  }
}

function roulette(userBet) {
  let randomGamble = Math.ceil(Math.random() * 2);
  const result = randomGamble === 1 ? 'black' : 'red'
  const userSelect = document.querySelector("select").value

  if (userSelect === result) {
    wins += 1
    casinoBank -= userBet
    userBank += userBet
    userWins.innerText = wins
    UserRemaining.innerText = `$${userBank}`;

    console.log("you win", wins, `Casino Loses $${(casinoBank)}`);
  } else {
    losses += 1;
    casinoBank += userBet;
    userBank -= userBet;
    userLoss.innerText = losses
    UserRemaining.innerText = `$${userBank}`

    console.log("you lose", losses, (`Casino Gains $${casinoBank}`));
  }

  fetch("/play", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wins: wins,
      losses: losses,
      casinoBank: casinoBank,
    }),
  })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
    })
}

// fetch("/feelings")
//   .then((response) => response.json())
//   .then((data) => {
//     // console.log(data);
//     if (data.length > 0) {
//       document.querySelector(".hideTable").style.display = "block";
//       document.querySelector("#tableWrapper").style.display = "block";
//       let moodTable = document.querySelector(".mood");
//       data.forEach((day) => {
//         // console.log(day);
//         let tableBody = document.querySelector(".tableBody");

//         let newRow = document.createElement("tr");
//         let date = document.createElement("td");
//         let mood = document.createElement("td");
//         let message = document.createElement("td");
//         date.innerText = day[2];
//         mood.innerText = day[0];
//         message.innerText = day[1];

//         newRow.appendChild(date);
//         // newRow.appendChild(genderAncestry)
//         newRow.appendChild(mood);
//         newRow.appendChild(message);
//         tableBody.appendChild(newRow);

//         // console.log(data)
//       });
//     } else {
//       document.querySelector(".hideTable").style.display = "none";
//       document.querySelector("#tableWrapper").style.display = "none";
//     }
//   })
//   .catch((err) => {
//     console.log(`error ${err}`);
//   });
