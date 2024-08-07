const icon_width = 79,
      icon_height = 79,
      num_icons = 9,
      time_per_icon = 30,
      icon_map = ["banana", "seven", "cherry", "plum", "orange", "bell", "bar", "lemon", "melon"];

var inventory = [];
var index = 0;

var Rolling = false;
var ItemGivenSound = new Audio("/sounds/GiveItem.mp3");
var SpinningSound = new Audio("/sounds/SpinSound.mp3");
var ErrorSound = new Audio("/sounds/Error.mp3");

const DropDownTopPage = document.querySelector("#dropdown");

var RollButton = document.querySelector(".Roll");

var InventoryElement = document.querySelector('.inventory');

const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons) * 7
    const style = getComputedStyle(reel),
        backgroundPositionY = parseFloat(style["background-position-y"]),
        targetBackgroundPositionY = backgroundPositionY + delta * (icon_height),
        normTargetBackgroundPositionY = targetBackgroundPositionY%(num_icons * icon_height);
    
    return new Promise((resolve, reject) => {

        reel.style.transition = `background-position-y ${8 + delta * time_per_icon}ms`;
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;

        setTimeout(() => {
            reel.style.transition = 'none';
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
            SpinningSound.pause();
            SpinningSound.currentTime = 0;
            resolve(delta%num_icons);
        }, 8 + delta * time_per_icon);
    });
};

function AddToInventory(itemIndex) {
    var newItem = document.querySelector('.Item').cloneNode(true);
    console.log(newItem);
    ItemGivenSound.play()
   
    const style = getComputedStyle(newItem),
        backgroundPositionY = itemIndex*icon_height;
    
    newItem.style.backgroundPositionY = backgroundPositionY+'px';

    InventoryElement.appendChild(newItem)
}

function rollAll() {
    const reelsList = document.querySelectorAll('.slots > .reel');
    SpinningSound.currentTime = .1;
    SpinningSound.play()
    
    Promise
    .all([... reelsList].map((reel, i) => roll(reel, i)) )
    .then((delta) => { 
        index = (index += delta)%num_icons;
        console.log(icon_map[index]);
        inventory[inventory.length] = index;
        console.log(inventory);
        AddToInventory(index-3);
        Rolling = false;
    })
    
}

// RollButton.addEventListener("click", ()=>{
//     if (Rolling) { return }
//     Rolling = true;
//     rollAll();
// });

var Rotated = false;
var Rotating = false;

DropDownTopPage.addEventListener("click", ()=>{
    if (Rotating) { return }
    var img = DropDownTopPage.querySelector("img");
    Rotated = !Rotated;
    Rotating = true
    if (Rotated){
      img.style.transform = "rotate(180deg)";
    }
    else {
        img.style.transform = "rotate(360deg)";
        setTimeout(function() {img.style = "rotate:0deg"}, 1001);
    }
    setTimeout(function() {Rotating=false}, 1001);
    img.style.transition = "transform 1s";
})

const GamesButton = document.querySelector('#Games');

GamesButton.addEventListener("click", ()=>{
    location.replace('/Pages/Case.html');
});