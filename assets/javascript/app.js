// Pink Trivia 2017
// By: Aaron Michael McNulty
// Monkey Stomp Games 2017
//
// All rights reserved
if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    var categoryDropDown = document.getElementById("category");

    (function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://opentdb.com/api_category.php", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                var categories = JSON.parse(xhr.responseText).trivia_categories;
                for (var i = 0; i < categories.length; i++) {
                    var newOption = document.createElement("option");
                    newOption.value = categories[i].id;
                    newOption.innerHTML = categories[i].name;
                    categoryDropDown.appendChild(newOption);
                }
            }
        }
        xhr.send(null);
    })();

    var game = {
        startButton: document.getElementById("startButton"),
        timer: document.getElementById("timer"),
        QAsection: document.getElementById("QAsection"),
        alertSection: document.getElementById("alertSection"),
        alertMessage: document.getElementById("alertMessage"),
        resultsSection: document.getElementById("resultsSection"),
        resultsHeaderMessage: document.getElementById("resultsMessage"),
        currentCorrectMessage: document.getElementById("currentCorrect"),
        currentIncorrectMessage: document.getElementById("currentIncorrect"),
        totalCorrectMessage: document.getElementById("totalCorrect"),
        totalIncorrectMessage: document.getElementById("totalIncorrect"),
        secondsCounter: 30,
        timerIntervalId: null,
        questionSet: null,
        questionIndex: 0,
        currentQuestion: document.getElementById("currentQuestion"),
        answers: document.getElementsByClassName("answerText"),
        correctAnswerIndex: null,
        totalCorrect: 0,
        totalIncorrect: 0,
        currentRoundCorrect: 0,
        currentRoundIncorrect: 0,
        renderProgress: function(progress) {
            if(progress<25){
                var angle = -90 + (progress/100)*360;
                $(".animate-0-25-b").css("transform","rotate("+angle+"deg)");
                $(".animate-25-50-b, .animate-50-75-b, .animate-75-100-b").css("transform", "rotate(-90deg)");
            }
            else if(progress>=25 && progress<50){
                var angle = -90 + ((progress-25)/100)*360;
                $(".animate-25-50-b").css("transform","rotate("+angle+"deg)");
                $(".animate-50-75-b, .animate-75-100-b").css("transform", "rotate(-90deg)");
            }
            else if(progress>=50 && progress<75){
                var angle = -90 + ((progress-50)/100)*360;
                $(".animate-50-75-b").css("transform","rotate("+angle+"deg)");
                $(".animate-75-100-b").css("transform","rotate(-90deg)");
            }
            else if(progress>=75 && progress<=100){
                var angle = -90 + ((progress-75)/100)*360;
                $(".animate-0-25-b, .animate-25-50-b, .animate-50-75-b").css("transform", "rotate(0deg)");
                $(".animate-75-100-b").css("transform","rotate("+angle+"deg)");
            }
            $(".text").html(game.secondsCounter + "s");
        },
        // This method may not be needed
        resetProgress: function() {
            $(".animate-0-25-b").css("transform","rotate(-90deg)")
            $(".animate-25-50-b").css("transform","rotate(-90deg)")
            $(".animate-50-75-b").css("transform","rotate(-90deg)")
            $(".animate-75-100-b").css("transform","rotate(-90deg)");
        },
        startTimer: function() {
            game.secondsCounter = 30;
            game.renderProgress((game.secondsCounter / 30) * 100);
            $(".loader-spiner").css("border-color", "#92C695");
            $(".text").css("color", "#92C695");
            game.timerIntervalId = setInterval(function() {
                game.secondsCounter -= 1;
                if (game.secondsCounter === 0) {
                    game.stopTimer();
                    game.timeExpired();
                }
                if (game.secondsCounter === 8) {
                    $(".loader-spiner").css("border-color", "#AF4E4B");
                    $(".text").css("color", "#AF4E4B");
                }
                game.renderProgress((game.secondsCounter / 30) * 100);
            }, 1000);
        },
        stopTimer: function() {
            clearInterval(game.timerIntervalId);
        },
        showTimer: function() {
            game.timer.style.visibility = "visible";
        },
        hideTimer: function() {
            game.timer.style.visibility = "hidden";
        },
        showCategories: function() {
            categoryDropDown.style.visibility = "visible";
        },
        hideCategories: function() {
            categoryDropDown.style.visibility = "hidden";
        },
        showStartButton: function() {
            game.startButton.style.visibility = "visible";
        },
        hideStartButton: function() {
            game.startButton.style.visibility = "hidden";
        },
        showQAsection: function() {
            game.QAsection.style.display = "block";
        },
        hideQAsection: function() {
            game.QAsection.style.display = "none";
        },
        showAlertSection: function() {
            game.alertSection.style.display = "block";
        },
        hideAlertSection: function() {
            game.alertSection.style.display = "none";
        },
        showResultsSection: function() {
            game.resultsSection.style.display = "block";
        },
        hideResultsSection: function() {
            game.resultsSection.style.display = "none";
        },
        startGame: function() {
            game.questionIndex = 0;
            game.currentRoundCorrect = 0;
            game.currentRoundIncorrect = 0;
            game.generateQuestions(function() {
                game.hideStartButton();
                game.hideCategories();
                game.displayNextQuestion();
                game.hideAlertSection();
                game.hideResultsSection();
                game.showQAsection();
                game.showTimer();
                game.startTimer();
            });
        },
        timeExpired: function() {
            game.showAlert("Out Of Time!!", function() {
                game.totalIncorrect++;
                game.currentRoundIncorrect++;
                game.hideAlertSection();
                game.showQAsection();
                game.startTimer();
                game.displayNextQuestion();
            });
        },
        generateQuestions: function(callback) {
            var categoryID = categoryDropDown.options[categoryDropDown.selectedIndex].value;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "https://opentdb.com/api.php?amount=5&category=" + categoryID +"&type=multiple", true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    game.questionSet = JSON.parse(xhr.responseText).results;
                    callback();
                }
            }
            xhr.send(null);
        },
        displayNextQuestion: function() {
            for (var i = 0; i < game.answers.length; i++) {
                game.answers[i].parentElement.className = "answer";
            }
            if (game.questionIndex < game.questionSet.length) {
                game.currentQuestion.innerHTML = game.questionSet[game.questionIndex].question;
                game.correctAnswerIndex = Math.floor(Math.random() * 4);
                var incorrectAnswerIndex = 0;
                for (var i = 0; i < 4; i++) {
                    if (i === game.correctAnswerIndex) {
                        game.answers[i].innerHTML = game.questionSet[game.questionIndex].correct_answer;
                        console.log(game.questionSet[game.questionIndex].correct_answer);
                    }
                    else {
                        game.answers[i].innerHTML = game.questionSet[game.questionIndex].incorrect_answers[incorrectAnswerIndex++];
                    }
                }
                game.questionIndex++;
            }
            else {
                game.hideQAsection();
                game.updateResults();
                game.stopTimer();
                game.hideTimer();
                game.showCategories();
                game.showStartButton();
                game.showResultsSection();
            }
        },
        checkAnswer: function() {
            game.stopTimer();
            for (var i = 0; i < game.answers.length; i++) {
                if (game.answers[i].innerHTML === this.children[0].innerHTML) {
                    if (game.correctAnswerIndex === i) {
                        this.className = "answer correct";
                        setTimeout(function() {
                            game.showAlert("Correct!", function() {
                                game.totalCorrect++;
                                game.currentRoundCorrect++;
                                game.hideAlertSection();
                                game.showQAsection();
                                game.startTimer();
                                game.displayNextQuestion();
                            });
                        }, 1000);
                    }
                    else {
                        this.className = "answer incorrect"
                        game.answers[game.correctAnswerIndex].parentElement.className = "answer correct";
                        setTimeout(function() {
                            game.showAlert("Incorrect<br>The correct answer is: " + game.answers[game.correctAnswerIndex].innerHTML, function() {
                                game.totalIncorrect++;
                                game.currentRoundIncorrect++;
                                game.hideAlertSection();
                                game.showQAsection();
                                game.startTimer();
                                game.displayNextQuestion();
                            });
                        }, 1000);
                    }
                }
            }
        },
        showAlert: function(message, callback) {
            game.hideQAsection();
            game.alertMessage.innerHTML = message;
            game.showAlertSection();
            setTimeout(function() {
                callback();
            }, 2000);
        },
        updateResults: function() {
            game.resultsHeaderMessage.innerHTML = "Great Job!";
            game.currentCorrectMessage.innerHTML = "This round you got: " + game.currentRoundCorrect + " questions correct.";
            game.currentIncorrectMessage.innerHTML = "This round you got: " + game.currentRoundIncorrect + " questions incorrect.";
            game.totalCorrectMessage.innerHTML = "You have gotten a total of: " + game.totalCorrect + " questions correct.";
            game.totalIncorrectMessage.innerHTML = "You have gotten a total of: " + game.totalIncorrect + " questions incorrect.";
        }
    }
    game.startButton.addEventListener("click", game.startGame, false);
    for (var i = 0; i < game.answers.length; i++) {
        game.answers[i].parentElement.addEventListener("click", game.checkAnswer, false);
    }
}