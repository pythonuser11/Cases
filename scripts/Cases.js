const CasesToOpenButtons = document.querySelector(".CasesToOpen");
const Case1 = CasesToOpenButtons.querySelector(".Open1");
const Case2 = CasesToOpenButtons.querySelector(".Open2");
const Case3 = CasesToOpenButtons.querySelector(".Open3");

const Slot = document.querySelector(".Slot");
const SlotContainer = document.querySelector(".Case");
const r = document.querySelector(".reward");
const rC = document.querySelector(".RewardsView");
SlotContainer.appendChild(Slot);
rC.appendChild(r);

var Rolling = false;
var ItemGivenSound = new Audio("/sounds/GiveItem.mp3");
var SpinningSound = new Audio("/sounds/SpinSound.mp3");
var ErrorSound = new Audio("/sounds/Error.mp3");

var indexes = [0];
var positions = [0, 0, 0];

var CasesOpening = 1;

var balance = 100;

const icon_width = 79,
      icon_height = 79,
      num_icons = 9,
      time_per_icon = 40;
      icon_map = ["banana", "seven", "cherry", "plum", "orange", "bell", "bar", "lemon", "melon"],
      rewards =  [10,       200,      30,      20,     20,        40,     50,    20,      50];
      og_price = 50;

var price = 50;

function TurnCaseOn(index) {
    while (SlotContainer.childElementCount > 0) {
        SlotContainer.firstChild.remove();
        rC.firstChild.remove();
    }
    for (i=1;i<=CasesOpening;i++) {
        var newslot = Slot.cloneNode(true);
        SlotContainer.appendChild(newslot);
        var newr = Slot.cloneNode(true);
        rC.appendChild(newr);
        indexes[i-1] = 0
    }
    for (i=1;i<=index;i++) {
        CasesToOpenButtons.querySelector(".Open"+i).style = "background-color: rgba(255, 255, 0, .9); color:black;";
    }
    price = og_price * index;
    SlotContainer.style.height = 145*index+'px';
    rC.style.height = 145*index+'px';
}

function TurnCaseOff(index) {
    for (i=index;i>=1;i--) {
        CasesToOpenButtons.querySelector(".Open"+i).style = "background-color: grey";
    }
}

TurnCaseOn(1);

Case1.addEventListener("click", ()=>{
    if (CasesOpening == 1 || Rolling) { return }
    CasesOpening = 1;
    indexes = [0]
    TurnCaseOff(3);
    TurnCaseOn(1);
})

Case2.addEventListener("click", ()=>{
    if (CasesOpening == 2 || Rolling) { return }
    CasesOpening = 2;
    indexes = [0,0]
    TurnCaseOff(3);
    TurnCaseOn(2);
})

Case3.addEventListener("click", ()=>{
    if (CasesOpening == 3 || Rolling) { return }
    CasesOpening = 3;
    indexes = [0,0,0]
    TurnCaseOff(3);
    TurnCaseOn(3);
})

const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons) * 7
    const style = getComputedStyle(reel),
        backgroundPositionY = parseFloat(style["background-position-y"]),
        targetBackgroundPositionY = backgroundPositionY + delta * (icon_height),
        normTargetBackgroundPositionY = targetBackgroundPositionY%(num_icons * icon_height);
    
    return new Promise((resolve, reject) => {

        reel.style.transition = `background-position-y ${delta * time_per_icon}ms`;
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;

        setTimeout(() => {
            reel.style.transition = 'none';
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
            ItemGivenSound.play();
            SpinningSound.pause();
            SpinningSound.currentTime = 0;
            resolve(delta%num_icons);
        }, 8 + delta * time_per_icon);
    });
};

function rollAll() {
    var reelsList = document.querySelectorAll('.Slot');
    SpinningSound.currentTime = .1;
    SpinningSound.play()
    
    Promise
    .all([... reelsList].map((reel, i) => roll(reel, i)) )
    .then((deltas) => { 
        deltas.forEach((delta, i) => indexes[i] = (indexes[i] += delta)%num_icons);
        indexes.map((index) => {
            console.log(icon_map.at(index-2));
            console.log(rewards.at(index-2));
            balance += rewards.at(index-2);
            document.querySelector(".amount").innerHTML = "$"+balance

        })
        Rolling = false;
    })
}

function Errorf(typeoferror) {
    if (typeoferror == "Low Balance") {
        ErrorSound.play();
        document.querySelector(".amount").style.color = "red";
        setTimeout(function() {
            document.querySelector(".amount").style.color = "rgb(24, 255, 24)";
        }, 1000
        )
    }
}

const RollButton = document.querySelector(".spin");

RollButton.addEventListener("click", ()=>{
    if (Rolling || balance < price) { Errorf("Low Balance"); return }
    Rolling = true;
    balance -= price;
    document.querySelector(".amount").innerHTML = "$"+balance
    console.log(balance);
    rollAll();
});

const HomeButton = document.querySelector("#Home");

HomeButton.addEventListener("click", ()=>{
    location.replace("/Home.html");
})