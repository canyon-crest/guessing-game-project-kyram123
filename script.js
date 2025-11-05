// time
const date = document.getElementById('date');
const currentTime = document.getElementById('currentTime');
date.textContent = time();
currentTime.textContent = now();
// global variables/constants
let score, answer, level, evaluation;
const levelArr = document.getElementsByName("level");
const scoreArr = [];

// event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);

function time(){
    let d = new Date();
    //concatenate the date and time
    let dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let day = dayArr[d.getDay()];
    let month = monthArr[d.getMonth()];
    let dateNum = d.getDate();
    //Add ticking clock
    //update here
    if (dateNum ==1 || dateNum ==21 || dateNum ==31){
        dateNum = dateNum + "st";
    }
    else if (dateNum ==2 || dateNum ==22){
        dateNum = dateNum + "nd";
    }
    else if (dateNum ==3 || dateNum ==23){
        dateNum = dateNum + "rd";
    }
    else{
        dateNum = dateNum + "th";
    }
    monthName = monthArr[d.getMonth()] + ' ';
    let year = d.getFullYear();
    let str = monthName + '' + dateNum + ', ' + year;
    return str;
}
//time function
function now(){
    let a = new Date();
    let hour = a.getHours();
    let mins = a.getMinutes();
    let secs = a.getSeconds();
    let amPm = "";
    if(hour >= 12){
        amPm = "p.m.";
    }
    else{
        amPm = "a.m.";
    }
    if (hour >0){
        hour -=12;
    }
    else if (hour ==0){
        hour =12;
    }
    if(mins<10){
        mins="0"+mins;
    }
    if (secs<10){
        secs="0"+secs;
    }
    return hour + ":" + mins + ":" + secs + " " + amPm;
}
setInterval(function(){
    currentTime.textContent = now();
}, 1000);


function play(){
    playBtn.disabled = true; 
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUpBtn.disabled = false;
    if (names.value == ''){
        msg.textContent = "Please enter your name to start playing!";
        playBtn.disabled = false;
        guessBtn.disabled = true;
        guess.disabled = true;
        giveUpBtn.disabled = true;
        return;
    }
    names.value = names.value.charAt(0).toUpperCase() + names.value.substring(1).toLowerCase();
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled=true;
        if(levelArr[i].checked){
            level= levelArr[i].value;
        }
    }

    answer = Math.floor(Math.random()*level)+1;
    msg.textContent = "Guess a number 1-" + level;
    guess.placeholder = answer;
    score = 0;
}
function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "INVALID " + names.value + ", guess a number!"
        return;
    }
    score++;
    let temperature = "";
    let diff = Math.abs(userGuess - answer);
    if (level == 3){
        if (diff >=2){
            temperature = "cold";
        }
        else if (diff ==1){
            temperature = "warm";        
        }
        else{
            temperature = "hot";
        }
    }
    else if (level == 10){
        if (diff >=5){
            temperature = "cold";
        }
        else if (diff >=2){
            temperature = "warm";        
        }
        else{
            temperature = "hot";
        }
    }
    else if (level == 100){
        if (diff >=20){
            temperature = "cold";
        }
        else if (diff >=10){
            temperature = "warm";        
        }
        else{
            temperature = "hot";
        }
    }
    if( userGuess > answer) {
        msg.textContent = "Too high "+ names.value + ", guess again! Your answer is " + temperature + ".";
    }
    else if( userGuess < answer) {
        msg.textContent = "Too low " + names.value + ", guess again! Your answer is " + temperature + ".";
    }
    else{
        if (level == 3){
            if (score ==1){
                evaluation = "good";
            }
            else if (score == 2){
                evaluation = "ok";
            }
            else{
                evaluation = "bad";
            }
        }
        else if (level == 10){
            if (score <=2){
                evaluation = "good";
            }
            else if (score <=4){
                evaluation = "ok";
            }
            else{
                evaluation = "bad";
            }
        }
        else if (level == 100){
            if (score <=3){
                evaluation = "good";
            }
            else if (score <=7){
                evaluation = "ok";
            }
            else{
                evaluation = "bad";
            }
        }
        msg.textContent = "Correct " + names.value + " ! It took " + score + " tries. Your score was evaluated as " + evaluation + ".";
        reset();
        updateScore();
    }
}
function reset(){
    guessBtn.disabled = false;
    guess.value = "";
    guess.placehoder = "";
    playBtn.disabled = false;
    giveUpBtn.disabled = false;
    for(let i=0; i< levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(){
    scoreArr.push(score); // adds current score to array of scores
    let sum = 0;
    scoreArr.sort((a, b) => a-b); //sorts ascending
    const lb = document.getElementsByName("leaderboard");

    for(let i=0; i<scoreArr.length; i++){
        sum+= scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}

function giveUp(){
    giveUpBtn.disabled = true;
    msg.textContent = names.value + ", the answer was " + answer + ". Better luck next time!";
    score = Number(level);
    reset();
    updateScore();
}



