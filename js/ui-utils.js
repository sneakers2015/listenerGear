function blink(element) {
    element.classList.remove("blink");
    element.addEventListener("webkitAnimationEnd", function() {
        this.classList.remove("blink");
    }, false);
    setTimeout(function() {
        element.classList.add("blink");
    }, 100);
}

function blinkBlue(element) {
	element.classList.remove("blink-blue");
    element.addEventListener("webkitAnimationEnd", function() {
        this.classList.remove("blink-blue");
    }, false);
    setTimeout(function() {
        element.classList.add("blink-blue");
    }, 100);
}