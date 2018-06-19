//=========================================================
// Global variables
//=========================================================

//Array of all philosophers for game
let philosophers;

// 'L' for selecting locutor, 'A' for battling
// in agora, 'I' for selecting interlocutor and
// 'G' for gameover.
let gameState;

// The rate attack power increases for the player every turn
const growthRate = 1.5;

//=========================================================
// Input
//=========================================================
$(document).ready(function () {

    initialize();

    $("body").on("click",".philosopherinbin", function () {
        let philosopherIndex;
        philosopherIndex = parseInt($(this).attr("id"));
        if (gameState === "L") {
            philosophers[philosopherIndex].isLocutor = true;
            gameState = "I";
        } else if (gameState === "I") {
            philosophers[philosopherIndex].isInterlocutor = true;
            gameState = "A";
        }
        updateDisplay();
    });

    $("body").on("click","#dialogue", function() {
        if (gameState === "A") {
            let locutor = getLocutor();
            let interlocutor = getInterlocutor();
            locutor.currentIdeaPoints -= interlocutor.responsePower;
            interlocutor.currentIdeaPoints -= locutor.questionPower;
            if (locutor.currentIdeaPoints <= 0) {
                alert("you lost!");
                initialize();
            } else if (interlocutor.currentIdeaPoints <= 0) {
                interlocutor.isInterlocutor = false;
                interlocutor.isDefeated = true;
                if (allDefeated()) {
                    alert("you win!");
                    initialize();
                } else {
                    gameState = "I";
                    updateDisplay();
                }
            } else {
                locutor.questionPower *= growthRate;
            }
            displayAgora();
        }
    });

});

//=========================================================
// Logic
//=========================================================
function initialize() {
    philosophers = [
        {
            name: "Socrates",
            backgroundImagePath: "assets/images/socrates.png",
            currentIdeaPoints: 300,
            startingIdeaPoints: 300,
            questionPower: 75,
            responsePower: 46,
            isLocutor: false,
            isInterlocutor: false,
            isDefeated: false
        },
        {
            name: "Judith Butler",
            backgroundImagePath: "assets/images/judith_butler.png",
            currentIdeaPoints: 450,
            startingIdeaPoints: 450,
            questionPower: 50,
            responsePower: 33,
            isLocutor: false,
            isInterlocutor: false,
            isDefeated: false
        },
        {
            name: "René Descartes",
            backgroundImagePath: "assets/images/rene_descartes.png",
            currentIdeaPoints: 350,
            startingIdeaPoints: 350,
            questionPower: 58,
            responsePower: 40,
            isLocutor: false,
            isInterlocutor: false,
            isDefeated: false
        },
        {
            name: "Ludwig Wittgenstein",
            backgroundImagePath: "assets/images/ludwig_wittgenstein.png",
            currentIdeaPoints: 400,
            startingIdeaPoints: 400,
            questionPower: 67,
            responsePower: 49,
            isLocutor: false,
            isInterlocutor: false,
            isDefeated: false
        }
    ];

    gameState = "L";
    updateDisplay();
}

function getLocutor() {
    for (let philosopher of philosophers) {
        if (philosopher.isLocutor) {
            return philosopher;
        }
    }
}

function getInterlocutor() {
    for (let philosopher of philosophers) {
        if (philosopher.isInterlocutor) {
            return philosopher;
        }
    }
}

function allDefeated() {
    for (let philosopher of philosophers) {
        if (!philosopher.isDefeated && !philosopher.isLocutor) {
            return false;
        }
    }
    return true;
}

//=========================================================
// Display
//=========================================================
function updateDisplay() {
    if (gameState === "L") {
        $("#philosopherbininstructions").text("Choose your philosopher below...");
        $("#agorainstructions").text("Choose your philosopher above...");
    } else if (gameState === "I") {
        $("#philosopherbininstructions").text("Choose the next philosopher to take to the agora for dialogue...");
        $("#agorainstructions").text("Choose your next interlocutor above...");
    } else if (gameState === "A") {
        $("#philosopherbininstructions").text("Conduct your dialogue in the agora below.");
        $("#agorainstructions").text("Click the 'ask question' button to hash out your ideas.");  
    }
    displayAgora();
    displayPhilosopherBin();
}

function displayPhilosopherBin() {
    $("#philosopherbin").empty();
    for (let philosopherIndex in philosophers) {
        let philosopher = philosophers[philosopherIndex];
        if (!philosopher.isLocutor && !philosopher.isDefeated && !philosopher.isInterlocutor) {
            let newDiv = document.createElement("div");
            $(newDiv).html("<h5>" + philosopher.name + "</h5>");
            $(newDiv).css("background-image", "url(" + philosopher.backgroundImagePath + ")");
            $(newDiv).addClass("philosopherinbin");
            $(newDiv).attr("id", philosopherIndex);
            $("#philosopherbin").append(newDiv);
        }
    }
}

function displayAgora() {
    displayLocutor();
    displayInterlocutor();
}

function displayLocutor() {
    let philosopher = getLocutor();
    let philosopherText = "";
    let currentIdeaPoints = 0;
    let startingIdeaPoints = 0;
    let imagePath = "assets/images/question_mark.png";
    if (philosopher !== undefined) {
        philosopherText = philosopher.name;
        imagePath = philosopher.backgroundImagePath;
        currentIdeaPoints = philosopher.currentIdeaPoints;
        startingIdeaPoints = philosopher.startingIdeaPoints;
    }
    $("#locutorsprite").css("background-image", "url(" + imagePath + ")");
    $("#locutorsprite > h5").text(philosopherText);
    $("#locutorideapoints").text(currentIdeaPoints);
    $("#locutorprogress").attr("value", currentIdeaPoints);
    $("#locutorprogress").attr("max", startingIdeaPoints);
}

function displayInterlocutor() {
    let philosopher = getInterlocutor();
    let philosopherText = "";
    let currentIdeaPoints = 0;
    let startingIdeaPoints = 0;
    let imagePath = "assets/images/question_mark.png";
    if (philosopher !== undefined) {
        philosopherText = philosopher.name;
        imagePath = philosopher.backgroundImagePath;
        currentIdeaPoints = philosopher.currentIdeaPoints;
        startingIdeaPoints = philosopher.startingIdeaPoints;
    }
    $("#interlocutorsprite").css("background-image", "url(" + imagePath + ")");
    $("#interlocutorsprite > h5").text(philosopherText);
    $("#interlocutorideapoints").text(currentIdeaPoints);
    $("#interlocutorprogress").attr("value", currentIdeaPoints);
    $("#interlocutorprogress").attr("max", startingIdeaPoints);
}