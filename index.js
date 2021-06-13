//platform helper variables
    let qsa = "";
    var tileValues = [];
    var resumeFlag = false;
//double deal helper variables
    let click = 0;
    var lastCardIndex = 0;
//deck variables
    let suits = ['Hearts', 'Diamond', 'Club', 'Spades'];
    let values = ['Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Jack', 'Queen', 'King', 'Ace'];
    var deck = [];
    var card = [];
//score variables
    var cardsIdentified = 0;
    var cardsUncoveredScore = 0;
    var timeBonusScore = 520;
    var penaltyScore = 0;
    var totalScore = 0;
    var time = 0;
    var timer = 0;
//settings variables
    var difficulty = "";
    var difficultyMultiplier = 1;
    var resourceBonus = 0;
    var createBtnFlag = false;
    var player = "";
    var gameMode = "";
    var gameMode1 = "";
    var gameMode2 = "";
    var totalClicks = 0;
    var timeLimit = 0;
    var scoreLimit = 0;
    var gameLimits = {"click-limit_easy": 250,
                        "click-limit_medium": 200,
                        "click-limit_hard": 150,
                        "score-limit_easy": 900,
                        "score-limit_medium": 700,
                        "score-limit_hard": 500,
                        "time-limit_easy": 600,
                        "time-limit_medium": 450,
                        "time-limit_hard": 300};
    var totalPlayers = 2;
    var currentPlayer = 0;
    var currentPlayerDict = {0 : "player1Score",
                            1: "player2Score"};
    var player1Timer = 90;
    var player2Timer = 90;

//Helper Class
class Queue{
    constructor(){
        this.items = [];
    }

    enqueue(element){
        this.items.push(element);
    }

    dequeue(){
        if(this.isEmpty()){
            return "Underflow";
        }
        return this.items.shift();
    }

    front(){
        if(this.isEmpty()){
            return "No Elements";
        }
        return this.items[0];
    }

    isEmpty(){
        return this.items.length == 0;
    }

}

class Card{
    constructor(suit, value){
        this.suit = suit;
        this.value = value;
    }
}

class Deck{
    constructor(){
        this.deck = [];
    }

    createDeck(suits, values){
        for(let suit of suits){
            for(let value of values){
                this.deck.push(new Card(suit,value));
            }
        }
        return this.deck;
    }

    shuffle(){
       // for(let i = 0; i < 5; i++){
            let counter = this.deck.length, temp, i;
            while(counter){
                i = Math.floor(Math.random() * counter--);
                temp = this.deck[counter];
                this.deck[counter] = this.deck[i];
                this.deck[i] = temp;
            }
      //  }
        return this.deck;
    }

    deal(){
        var card = this.deck.pop();
        return card;
    }
}

window.onload = function(){
    var queue = new Queue();
    var valueQueue = new Queue();

    

    //card deal
    {
    deck = new Deck();
    deck.createDeck(suits, values);
    deck.shuffle();

    //assign images to card tiles
    for(let i = 0; i < 52; i++){
        qsa = (i+1).toString();
        var card = this.deck.deal();
        tileValues.push(card.value);
        //console.log(card.suit + card.value);
        id(qsa).src = "Cards\\" + card.suit + card.value + ".png";
    }

    }
   
    var playModal = id("playModal");
    var playSpan = document.getElementsByClassName("close")[0];

    playSpan.onclick = function(){
        playModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === playModal) {
            playModal.style.display = "none";
        }
    }

    var quitModal = id("quitModal");
    var quitSpan = document.getElementsByClassName("close")[1];

    quitSpan.onclick = function(){
        quitModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === quitModal) {
            quitModal.style.display = "none";
        }
    }

    //click event listener

    id("quit-yes").addEventListener("click",function(){
        window.location.reload();
    });

    id("quit-no").addEventListener("click",function(){
        quitModal.style.display = "none";
    });

    id("start-btn").addEventListener("click", function(){
        //startGame();
        //window.location.reload();
        if(resumeFlag === true){
            quitModal.style.display = "block";
        }
        else{
        hideSettings();
        clearAllRadios();

        var playerRadios = document.querySelectorAll('input[type=radio][name="player"]');
        playerRadios.forEach(radio => radio.addEventListener('change', () => playerSelection(radio.value)));

        var game_mode1_Radios = document.querySelectorAll('input[type=radio][name="variation1"]');
        game_mode1_Radios.forEach(radio => radio.addEventListener('change', () => gameMode1Selection(radio.value)));

        var game_mode2_Radios = document.querySelectorAll('input[type=radio][name="variation2"]');
        game_mode2_Radios.forEach(radio => radio.addEventListener('change', () => gameMode2Selection(radio.value)));

        var difficultyRadios = document.querySelectorAll('input[type=radio][name="diff"]');
        difficultyRadios.forEach(radio => radio.addEventListener('change', () => difficultySelection(radio.value)));

        playModal.style.display = "block";
        }
    });

    id("create-btn").addEventListener("click",function(){
        resumeFlag = true;
        document.getElementsByClassName("content")[0].style.display = "block";
        clearTimeout(timer);
        if(player === "single"){
            hideStats();
            showMainScore();
            gameMode = gameMode1;
            var game = gameMode + '_' + difficulty;
            var value = gameLimits[game];
            if(gameMode === "click-limit"){
                id("status").innerHTML = value;
                totalClicks = value;
            }
            else if(gameMode === "score-limit"){
                id("status").innerHTML = value;
                scoreLimit = value;
                startTimer();
            }
            else if(gameMode === "time-limit"){
                timeLimit = value;
                startTimer();
            }
            else if(gameMode === "no-limit"){
                visibleDifficulty(true);
            }
        }
        else{
            gameMode = gameMode2;
            hideMainScore();
            showStats();
            if(gameMode === "high-score"){
                startTimer();
                id("player1Score").textContent = timeConversion(player1Timer);
                id("player2Score").textContent = timeConversion(player2Timer);
                if((currentPlayer % 2) === 0){
                    id("player2").classList.remove("bold");
                    id("player1").classList.add("bold");
                }
                else if((currentPlayer % 2) === 1){
                    id("player1").classList.remove("bold");
                    id("player2").classList.add("bold");
                }
            }
            else if(gameMode === "pairs"){
                id("player1Score").value = 0;
                id("player2Score").value = 0;
                if((currentPlayer % 2) === 0){
                    id("player2").classList.remove("bold");
                    id("player1").classList.add("bold");
                }
                else if((currentPlayer % 2) === 1){
                    id("player1").classList.remove("bold");
                    id("player2").classList.add("bold");
                }
            }
        }
        playModal.style.display = "none";
        clearAllRadios();
        id("create-btn").disabled = true;
    });

    id("restart-btn").addEventListener("click", function(){
        //startGame();
        window.location.reload();
    });

    id("restart2-btn").addEventListener("click", function(){
        //startGame();
        window.location.reload();
    });

    //modal functionalities
    {
    var winModal = id("winModal");
    var winSpan = document.getElementsByClassName("close")[2];

    var player1winModal = id("player1winModal");
    
    //close event listener
    winSpan.onclick = function(){
        winModal.style.display = "none";
    };

    // when user cliks elsewhere, close modal
    window.onclick = function(event) {
        if (event.target == winModal) {
            winModal.style.display = "none";
        }
    }
    }

    //add click event for all cards
    for(let i = 0; i < 52; i++){
        qsa = "card" + (i+1).toString(); // get card id by number, e.g. card1, card2...
        card[i] = document.getElementById(qsa); // each index will hold card tile
        card[i].addEventListener( 'click', function() {
            card[i].classList.add("noClick");
            card[i].classList.toggle('is-flipped'); // flip the card
            click = click + 1; // note number of clicks
            //view cards in pair
            if(click % 2 === 0){
                //if two cards are open at a time validate and take action
                //validate if both cards are of same number

                //if cards are same number, hide both the cards
                if(tileValues[i] === valueQueue.front()){
                    queue.dequeue();
                    cardsIdentified = cardsIdentified + 2;
                    cardsUncoveredScore = cardsUncoveredScore + 20;
                    totalScore = cardsUncoveredScore + penaltyScore;

                    if(gameMode === "pairs"){
                        updateScore();
                    }
                    else if(gameMode === "high-score"){
                        if(currentPlayer === 0){
                            player1Timer = player1Timer + 10;
                        }
                        else{
                            player2Timer = player2Timer + 10;
                        }
                    }
                    if(cardsIdentified === 52){
                        //stop timer
                        clearTimeout(timer);

                        if(player === "single")
                        {
                            showScore();
                            // open win Modal 
                            winModal.style.display = "block";
                        }
                        else{
                            showScore();
                            player1winModal.style.display = "block";
                        }
                    }
                }
                else{
                    changeTurn();
                    //else flip them back as before
                    setTimeout(() =>{
                        card[queue.front()].classList.remove("noClick");
                        card[i].classList.remove("noClick");
                        card[i].classList.toggle('is-flipped');
                        card[queue.front()].classList.toggle('is-flipped');
                        penaltyScore = penaltyScore - 1;
                        totalScore = cardsUncoveredScore + penaltyScore;
                        queue.dequeue();
                    },1000);
                }
                valueQueue.dequeue();
            }
            else{
                valueQueue.enqueue(tileValues[i]);
                queue.enqueue(i);
            }
            totalClicks = totalClicks - 1;
            if(gameMode === "click-limit"){
                updateStatus(totalClicks);
            }
        });
    }
}

function changeTurn(){
    currentPlayer = (currentPlayer + 1) % totalPlayers;
    if(currentPlayer === 0){
        id("player2").classList.remove("bold");
        id("player1").classList.add("bold");
    }
    else if(currentPlayer === 1){
        id("player1").classList.remove("bold");
        id("player2").classList.add("bold");
    }
    //id(currentPlayerDict[currentPlayer]).classList;
}

function updateScore(){
    if(gameMode === "pairs"){
        id(currentPlayerDict[currentPlayer]).value = id(currentPlayerDict[currentPlayer]).value + 1;
        id(currentPlayerDict[currentPlayer]).textContent = id(currentPlayerDict[currentPlayer]).value;
    }
    else if(gameMode === "high-score"){
        if(currentPlayer === 0){
            id(currentPlayerDict[currentPlayer]).textContent = timeConversion(player1Timer);
        }
        else if(currentPlayer === 1){
            id(currentPlayerDict[currentPlayer]).textContent = timeConversion(player2Timer);
        }
    }
}

function updateStatus(value){
    if(value === 0){
        if(!alert('You Lost!!! Please Play Again')){window.location.reload();}
    }
    id("status").innerHTML = value;
    resourceBonus = value;
}

function showStats(){
    var elements = document.getElementsByClassName("sectionLeft");
    var elements1 = document.getElementsByClassName("sectionRight")
    for(var i = 0; i < elements.length; i++){
        elements[i].style.display = "block";
        elements1[i].style.display = "block";
    }
}

function showMainScore(){
    var elements = document.getElementsByClassName("scoreStyle");
    for(var i = 0; i < elements.length; i++){
        elements[i].style.display = "block";
    }
}

function hideMainScore(){
    var elements = document.getElementsByClassName("scoreStyle");
    for(var i = 0; i < elements.length; i++){
        elements[i].style.display = "none";
    }
}

function hideStats(){
    var elements = document.getElementsByClassName("sectionLeft");
    var elements1 = document.getElementsByClassName("sectionRight")
    for(var i = 0; i < elements.length; i++){
        elements[i].style.display = "none";
        elements1[i].style.display = "none";
    }
}

function showScore(){
    //load score in modal
    if(player === "single"){
        id("uncoveredCards").innerHTML = cardsUncoveredScore;
        id("resourceBonus").innerHTML = resourceBonus;
        id("multiplier").innerHTML = difficultyMultiplier;
        id("totalScore").innerHTML = cardsUncoveredScore + (resourceBonus * difficultyMultiplier);
    }
    else if(player === "multiplayer"){
        var player1TotalScore;
        var player2TotalScore;
        var playerName;
        if(gameMode === "pairs"){
            player1TotalScore = id("player1Score").value;
            player2TotalScore= id("player2Score").value;
        }
        else if(gameMode === "high-score"){
            player1TotalScore =  player1Timer;
            player2TotalScore =  player2Timer;
        }
        id("player1TotalScore").innerHTML = player1TotalScore;
        id("player2TotalScore").innerHTML = player2TotalScore;
        id("playerName").innerHTML = (player1TotalScore >= player2TotalScore) ? "Player1" : "player2";
    }
}

function hideSettings(){
    id("game-mode1").style.display = "none"
    id("game-mode2").style.display = "none"
    id("difficulty").style.display = "none"
}

function playerSelection(value){
    clearAllRadios();
    hideSettings();
    enableCreateButton(false);
    if(value === "single-player")
    {
        id("singlePlayer").checked = true;
        id("game-mode2").style.display = "none"
        id("game-mode1").style.display = "block";
        player = "single";
    }
    else{
        id("twoPlayers").checked = true;
        id("game-mode1").style.display = "none";
        id("game-mode2").style.display = "block";
        enableCreateButton(false);
        player = "multiplayer";
    }
}

function gameMode1Selection(value){
    if(value === "click-limit"){
        visibleDifficulty(true);
    }
    else if(value === "score-limit"){
        visibleDifficulty(true);
    }
    else if(value === "time-limit"){
        visibleDifficulty(true);
    }
    else if(value === "no-limit"){
        visibleDifficulty(true);
    }
    gameMode1 = value;
}

function gameMode2Selection(value){
    if(value === "high-score"){
        visibleDifficulty(false);
    }
    else if(value === "pairs"){
        visibleDifficulty(false);
    }
    enableCreateButton(true);
    player = "multiplayer";
    gameMode2 = value;
}

function difficultySelection(value){
    if(value === "easy"){
        difficulty = "easy";
        difficultyMultiplier = 1;
    }
    else if(value === "medium"){
        difficulty = "medium";
        difficultyMultiplier = 2;
    }
    else{
        difficulty = "hard";
        difficultyMultiplier = 3;
    }
    singlePlayerSettingsFlag = true;
    player = "single";
    enableCreateButton(true);
}

function visibleDifficulty(value){
    if(value){
        id("difficulty").style.display = "block";
    }
    else{
        id("difficulty").style.display = "none";
    }
}

function enableCreateButton(value){
    if(value){
        id("create-btn").disabled = false;
    }
    else{
        id("create-btn").disabled = true;
    }
}

//timer helper functions
function startTimer(){
    time = 0;
    var value;
    //id("timer").textContent = timeConversion(time);
    timer = setInterval(function(){
        //id("timer").textContent = timeConversion(time);
        if(gameMode === "time-limit"){
            if(timeLimit-time === 0){
                if(!alert('You Lost!!! Please Play Again')){window.location.reload();}
            }
            value = timeConversion(timeLimit-time);
            updateStatus(value);
            resourceBonus = timeLimit-time;
            time++;
        }
        else if(gameMode === "score-limit"){
            value = scoreLimit - click - time;
            if(value === 0){
                if(!alert('You Lost!!! Please Play Again')){window.location.reload();}
            }
            updateStatus(value);
            resourceBonus = value;
            time++;
        }
        else if(gameMode === "high-score")
        {
            if(currentPlayer === 0){
                player1Timer = player1Timer - 1;
                
                updateScore();
            }
            else if(currentPlayer === 1){
                player2Timer = player2Timer - 1;
                updateScore();
            }
            if(player1Timer === 0 || player2Timer === 0){
                clearTimeout(timer);
                showScore();
                player1winModal.style.display = "block";
            }
        }
    },1000);
}

function timeConversion(time){
    let minutes = Math.floor(time/60);
    if(minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if(seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function clearAllRadios() {
    var radList = document.getElementsByName('player');
    for (var i = 0; i < radList.length; i++) {
        if(radList[i].checked) document.getElementById(radList[i].id).checked = false;
      }
    radList = document.getElementsByName('variation1');
    for (var i = 0; i < radList.length; i++) {
        if(radList[i].checked) document.getElementById(radList[i].id).checked = false;
      }
    radList = document.getElementsByName('variation2');
    for (var i = 0; i < radList.length; i++) {
        if(radList[i].checked) document.getElementById(radList[i].id).checked = false;
      }
    radList = document.getElementsByName('diff');
    for (var i = 0; i < radList.length; i++) {
        if(radList[i].checked) document.getElementById(radList[i].id).checked = false;
      }
  }

function id(id){
    return document.getElementById(id);
}