var leftHoverState = 0; // can be 0 for no 0.5 for in middle of open 1 for open
var rightHoverState = 0; // can be 0 for no 0.5 for in middle of open 1 for open
var timeoutTimer = null;

function hoverLeft() {
	if (leftHoverState === 0) {
		window.clearTimeout(timeoutTimer);
		closeBoth();
		leftHoverState = 0.5;
		document.getElementById('left').classList.add('hover')
		timeoutTimer = window.setTimeout(hoverLeftFin, 1000)
	}
}

function closeLeft() {
	window.clearTimeout(timeoutTimer);
	leftHoverState = 0.5;
	document.getElementById('left').classList.add('close');
	window.setTimeout(closeLeftFin, 1000);
}

function closeLeftFin() {
	leftHoverState = 0;
	document.getElementById('left').classList.remove('close')
}

function closeRight() {
	window.clearTimeout(timeoutTimer);
	rightHoverState = 0.5;
	document.getElementById('right').classList.add('close');
	window.setTimeout(closeRightFin, 1000);
}

function closeRightFin() {
	rightHoverState = 0;
	document.getElementById('right').classList.remove('close')
}

function hoverLeftFin() {
	leftHoverState = 1;
	document.getElementById('left').classList.add('hover2')
}

function hoverRight() {
	if (rightHoverState === 0) {
		window.clearTimeout(timeoutTimer);
		closeBoth();
		rightHoverState = 0.5;
		document.getElementById('right').classList.add('hover')
		timeoutTimer = window.setTimeout(hoverRightFin, 1000)
	}
}

function hoverRightFin() {
	rightHoverState = 1;
	document.getElementById('right').classList.add('hover2')
}

function closeBoth() {

	if (leftHoverState === 1) {
		window.clearTimeout(timeoutTimer);
		document.getElementById('left').classList.remove('hover');
		document.getElementById('left').classList.remove('hover2');
		closeLeft();
	}
	if (rightHoverState === 1) {
		window.clearTimeout(timeoutTimer);
		document.getElementById('right').classList.remove('hover')
		document.getElementById('right').classList.remove('hover2')
		closeRight();
	}
	leftHoverState = 0; // can be 0 for no 0.5 for in middle of open 1 for open
	rightHoverState = 0; // can be 0 for no 0.5 for in middle of open 1 for open
	//window.setTimeout(hoverLeftFin, 1000)
}

function getRepos() {
	var req = new XMLHttpRequest();
	req.open('GET', 'https://api.github.com/users/cm-tech/repos', false);
	req.send(null);
	var repos = eval(req.responseText);
	repos.forEach(function(e) {
		var a = document.createElement("a");
		a.innerText = e.name;
		a.href = "http://cm-tech.github.io/" + e.name;
		a.classList.add("proj");
		document.getElementsByClassName("projects")[0].appendChild(a);

	});
}
getRepos();