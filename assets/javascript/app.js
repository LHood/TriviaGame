// Pink Trivia 2017
// By: Aaron Michael McNulty
// Monkey Stomp Games 2017
//
// All rights reserved
if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    var index = 30;
    function renderProgress(progress) {
        // progress = Math.floor(progress);
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
        $(".text").html(index + "s");
    }
    function resetProgress() {
        console.log("Resetting progress");
        $(".animate-0-25-b").css("transform","rotate(-90deg)")
        $(".animate-25-50-b").css("transform","rotate(-90deg)")
        $(".animate-50-75-b").css("transform","rotate(-90deg)")
        $(".animate-75-100-b").css("transform","rotate(-90deg)");
    }
    setInterval(function() {
        if (index < 0) {
            index = 30;
            $(".loader-spiner").css("border-color", "#92C695");
            $(".text").css("color", "#92C695");
        }
        if (index === 8) {
            $(".loader-spiner").css("border-color", "#AF4E4B");
            $(".text").css("color", "#AF4E4B");
        }
        renderProgress((index / 30) * 100);
        index -= 1;
    }, 1000);
}