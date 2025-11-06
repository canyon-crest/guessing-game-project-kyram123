// time
const date = document.getElementById('date');
const currentTime = document.getElementById('currentTime');
const wins = document.getElementById('wins');
const avgScore = document.getElementById('avgScore');
date.textContent = time();
currentTime.textContent = now();

// ★ ADDED (style): basic body styling (no centering)
document.body.style.backgroundColor = "#f0f8ff"; // light blue
document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.color = "#333";

// global variables/constants
let score, answer, level, evaluation;
const scoreArr = [];
const timeArr = []; // store all game times
let fastestTime = null; //  track fastest game time
let startTime, timerInterval; // for timing live updates
let totalWins = 0; // track total wins

// ★ ADDED: arrays to store scores for each difficulty
const easyScores = [];
const mediumScores = [];
const hardScores = [];

// Grab buttons
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);

// ===== Slider Level Handling =====
const levelSlider = document.getElementById("levelSlider");
const levelName = document.getElementById("levelName");

function updateLevel() {
    switch(levelSlider.value) {
        case "1":
            level = 3;
            levelName.textContent = "Easy";
            break;
        case "2":
            level = 10;
            levelName.textContent = "Medium";
            break;
        case "3":
            level = 100;
            levelName.textContent = "Hard";
            break;
    }
}

// Initialize level
updateLevel();
levelSlider.addEventListener("input", updateLevel);

// ===== DATE AND CLOCK FUNCTIONS =====
function time(){
    let d = new Date();
    let dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let dateNum = d.getDate();

    if (dateNum ==1 || dateNum ==21 || dateNum ==31) dateNum += "st";
    else if (dateNum ==2 || dateNum ==22) dateNum += "nd";
    else if (dateNum ==3 || dateNum ==23) dateNum += "rd";
    else dateNum += "th";

    let monthName = monthArr[d.getMonth()] + ' ';
    let year = d.getFullYear();
    return monthName + dateNum + ', ' + year;
}

function now(){
    let a = new Date();
    let hour = a.getHours();
    let mins = a.getMinutes();
    let secs = a.getSeconds();
    let amPm = hour >= 12 ? "p.m." : "a.m.";

    if (hour > 12) hour -= 12;
    if (hour == 0) hour = 12;
    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;
    return hour + ":" + mins + ":" + secs + " " + amPm;
}
setInterval(() => { currentTime.textContent = now(); }, 1000);

// ===== GAME FUNCTIONS =====
function play(){
    playBtn.disabled = true; 
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUpBtn.disabled = false;
    hintBtn.disabled = false;

    if (names.value == ''){
        msg.textContent = "Please enter your name to start playing!";
        msg.style.color = "red";
        playBtn.disabled = false;
        guessBtn.disabled = true;
        guess.disabled = true;
        giveUpBtn.disabled = true;
        hintBtn.disabled = true;
        return;
    }

    names.value = names.value.charAt(0).toUpperCase() + names.value.substring(1).toLowerCase();

    updateLevel(); // Ensure correct level

    answer = Math.floor(Math.random() * level) + 1;
    msg.textContent = "Guess a number 1-" + level;
    msg.style.color = "black";
    guess.placeholder = answer;
    score = 0;

    startTime = new Date().getTime();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let nowTime = new Date().getTime();
        let elapsed = ((nowTime - startTime) / 1000).toFixed(2);
        document.getElementById("gameClock").textContent = "Elapsed time: " + elapsed + " seconds";
    }, 100);
}

function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "INVALID " + names.value + ", guess a number!";
        msg.style.color = "red";
        return;
    }
    score++;
    let temperature = "";
    let diff = Math.abs(userGuess - answer);
    if (level == 3){
        if (diff >=2){ temperature = "cold"; }
        else if (diff ==1){ temperature = "warm"; }
        else{ temperature = "hot"; }
    }
    else if (level == 10){
        if (diff >=5){ temperature = "cold"; }
        else if (diff >=2){ temperature = "warm"; }
        else{ temperature = "hot"; }
    }
    else if (level == 100){
        if (diff >=20){ temperature = "cold"; }
        else if (diff >=10){ temperature = "warm"; }
        else{ temperature = "hot"; }
    }

    if(userGuess > answer){
        msg.textContent = "Too high "+ names.value + ", guess again! Your answer is " + temperature + ".";
        msg.style.color = "orange";
    }
    else if(userGuess < answer){
        msg.textContent = "Too low " + names.value + ", guess again! Your answer is " + temperature + ".";
        msg.style.color = "blue";
    }
    else{
        clearInterval(timerInterval);
        let stopTime = new Date().getTime();
        let timeTaken = ((stopTime - startTime) / 1000).toFixed(2);
        document.getElementById("gameClock").textContent = "Time taken: " + timeTaken + " seconds";

        timeArr.push(Number(timeTaken));
        let numericTime = Number(timeTaken);
        if (fastestTime === null || numericTime < fastestTime) fastestTime = numericTime;
        updateTimeStats();

        if (level == 3){
            if (score ==1){ evaluation = "good"; }
            else if (score == 2){ evaluation = "ok"; }
            else{ evaluation = "bad"; }
        }
        else if (level == 10){
            if (score <=2){ evaluation = "good"; }
            else if (score <=4){ evaluation = "ok"; }
            else{ evaluation = "bad"; }
        }
        else if (level == 100){
            if (score <=3){ evaluation = "good"; }
            else if (score <=7){ evaluation = "ok"; }
            else{ evaluation = "bad"; }
        }

        msg.textContent = "Correct " + names.value + "! It took " + score +
            " tries and " + timeTaken + " seconds. Your score was evaluated as " + evaluation + ".";
        msg.style.color = "green";

        guessBtn.disabled = true;
        giveUpBtn.disabled = true;
        hintBtn.disabled = true;

        totalWins++;
        wins.textContent = "Total wins: " + totalWins;

        playBtn.disabled = false;

        updateScore();
    }
}

function reset(){
    guess.value = "";
    guess.placeholder = "";
    document.getElementById("gameClock").textContent = "Elapsed time: 0.00 seconds";
}

function updateScore(){
    scoreArr.push(score);
    let sum = 0;
    scoreArr.sort((a, b) => a - b);
    const lb = document.getElementsByName("leaderboard");

    for(let i=0; i<scoreArr.length; i++){
        sum += scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    let avg = sum / scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
    avgScore.style.color = "darkblue";
    avgScore.style.fontWeight = "bold";

    updateLevelLeaderboard(level, score);
}

function giveUp(){
    clearInterval(timerInterval);
    let stopTime = new Date().getTime();
    let timeTaken = ((stopTime - startTime) / 1000).toFixed(2);
    document.getElementById("gameClock").textContent = "You gave up after " + timeTaken + " seconds.";
    msg.textContent = names.value + ", the answer was " + answer + ". Better luck next time!";
    msg.style.color = "gray";

    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    hintBtn.disabled = true;

    playBtn.disabled = false;

    timeArr.push(Number(timeTaken));
    let numericTime = Number(timeTaken);
    if (fastestTime === null || numericTime < fastestTime) {
        fastestTime = numericTime;
    }
    updateTimeStats();

    score = Number(level);
    updateScore();
}

function updateTimeStats(){
    let sum = 0;
    for (let t of timeArr){ sum += t; }
    let avgTime = (sum / timeArr.length).toFixed(2);

    const stats = document.getElementById("timeStats");
    stats.textContent = "Fastest Time: " + fastestTime + "s | Average Time: " + avgTime + "s";
    stats.style.color = "purple";
    stats.style.fontWeight = "bold";
}

function updateLevelLeaderboard(level, score){
    let arr, listName;
    if (level == 3){ arr = easyScores; listName = "easyBoard"; }
    else if (level == 10){ arr = mediumScores; listName = "mediumBoard"; }
    else if (level == 100){ arr = hardScores; listName = "hardBoard"; }

    arr.push(score);
    arr.sort((a, b) => a - b);
    const lbItems = document.getElementsByName(listName);
    for(let i=0; i<lbItems.length; i++){
        if (i < arr.length){ 
            lbItems[i].textContent = arr[i];
            if (i === 0) lbItems[i].style.color = "gold";
            else if (i === 1) lbItems[i].style.color = "silver";
            else if (i === 2) lbItems[i].style.color = "brown";
        } 
    } 
}

// ★ HINT BUTTON
let hintBtn = document.getElementById('hintBtn');
if (!hintBtn) {
    hintBtn = document.createElement("button");
    hintBtn.id = "hintBtn";
    hintBtn.textContent = "Hint";
    hintBtn.disabled = true;

    giveUpBtn.insertAdjacentElement('afterend', hintBtn);
}

hintBtn.addEventListener("click", () => {
    if (!answer) return;
    msg.textContent = "Hint: The number is " + (answer % 2 === 0 ? "even" : "odd") + "!";
    msg.style.color = "purple";
});
