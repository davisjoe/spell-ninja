/*
spell ninja 
a typing game.
by DJ J Q2
version 1.0
*/
var counttext=document.querySelector("#countdown");
var TPL =3; // TimePerLetter
var countdown=5;
var time=setInterval(tick,1000);
var spintime=setInterval(doSpin,100);
var movetime=setInterval(doMoving,100);
var spindegree=0;
var throwingLeft=0;
moving="right";
var step=40;
var gameover=document.querySelector("#GAME-OVER");
var body=document.querySelector("body");
var apple=document.querySelector("#apple");
var spindiv=document.querySelector("#spin");
var throwingdiv=document.querySelector("#throwing");
var bgimage=body.style.backgroundImage;
var screenswidth=body.clientWidth-350;
var stuckinthemud=-120; //point where star stops going up
var updisc=-0;
var upstep=15; 
var scale=1.0;
var minscale=0.5;
var hearts=3;
var acceptInput = false;
var texters=document.querySelector("#texters")
var inputt=document.querySelector("#inputt")
var codeword="ninja";
var levels= {
		levelC:0,
		levelData:[
			{ words:["HULK","MAGNETO","IRONMAN","DOCTOR STRANGE"], timePerLetter:4.0 },
			{ words:["THOR","DEADPOOL","THANOS","CAPITAIN MARVEL","HAWKEYE"], timePerLetter:3.5 },
			{ words:["BLACK PANTHER","BLACK WIDOW","PUNISHER","LOKI","VISION","NICK FURY"], timePerLetter:3 },
			{ words:["CAPITAIN AMERICA","JESSICA JONES","SPIDERMAN","MYSTERIO","IRON PATRIOT","IRON FIST"], timePerLetter:2.5 },
			{ words:["ULTRON","YELLOWJACKET","BLACK DWARF","GHOST","DORMAMMU","RED SKULL","CULL OBSIDIAN"], timePerLetter:2  },
			{ words:["JUSTIN HAMMER","CORVUS GLAIVE","WHIPLASH","ULYSSES KLAUE","EGO","AYESHA","VULTURE","KILLMONGER"], timePerLetter:1.0 }
		],
		wordBucket :[],
		// return true if word not in wordBucket
		checkWordBucket:function (word){
			// check if new word has already been typed 
			console.log("word " + word)
			for (var i=0;i<this.wordBucket.length;i++) {
				if (this.wordBucket[i] == word ){
					return false;
				}
			}
			return true;
		},
		addToWordBucket: function(word){
			this.wordBucket.push(word);
		},
		clearWordBucket: function(word){
			this.wordBucket = [];
		},
		checkForEndOfLevel:function(){
			console.log("levelC " + this.levelC);
			
			if (this.wordBucket.length == this.levelData[this.levelC].words.length){
				return true;
			}
			return false;
		}
}
var score=100;
console.log("we got here")

// when page loads call this
function loaded(){
	gameover.hidden = true;
	clearInterval(time);
	clearInterval(spintime);
	clearInterval(movetime);
	throwingdiv.hidden = true;
	document.querySelector("#button").addEventListener("click", function(event){
		buttonClick();
	});
}
function buttonClick(){
	document.querySelector("#button").hidden = true;
	throwingdiv.hidden = false;
	throwingdiv.style.transform="scale(1.0) perspective(10em) rotateX(50deg)";
	body.className="body-image";
	apple.style.display="block";
	gameover.hidden = true;
	document.querySelector("#input-area").hidden=false;
	if (document.querySelector("#button-text").innerHTML == "CONTINUE"){
		if(levels.checkForEndOfLevel()){
			levels.levelC++;
			levels.clearWordBucket();
		}
		codeword=getcode();
	}
	if (document.querySelector("#button-text").innerHTML == "START"){
		score=0;
		levels.levelC=0;
		updateScore();
		codeword=getcode();
		hearts=3;
		showHearts();
	}
	setup();
}
function setup(){
	clearInterval(time);
	clearInterval(spintime);
	clearInterval(movetime);
	time=setInterval(tick,1000);
	spintime=setInterval(doSpin,100);
	movetime=setInterval(doMoving,100);
	acceptInput = true;
	updisc=0;
	moving="right";
	throwingLeft=0;
}

function doSpin() {
  if ((moving!="thrown") && (moving!="dead")) {
      spindegree+=15;
      spindiv.style.transform="rotate("+spindegree+"deg)"
  }
  if(moving=="thrower"){
     if(scale>minscale){
      scale-=0.1;
      throwingdiv.style.transform="scale("+scale+") perspective(10em) rotateX(50deg)";
     }
  }
}


function doMoving() {
  throwingdiv.style.left=throwingLeft+"px";
  throwingdiv.style.top=updisc+"px";
  if(moving=="right") {
    throwingLeft+=step;
    if (throwingLeft>(screenswidth-(calculateWordPercentage(screenswidth)/2) )){
      moving="left";
    }
  } else if (moving=="left"){ 
    throwingLeft-=step;
    if (throwingLeft<(0+(calculateWordPercentage(screenswidth)/2) )){
      moving="right";
    }
  } else if (moving=="thrower" || moving=="goodthrow") {
    // star thrown
    if(updisc>stuckinthemud){
      updisc-=upstep;
    } else {
	  if (moving=="thrower" ) {	  
	    loseLife();
      } else {
		  moving ="thrown";
	      setup();
	  }
    }
  }
}

function loseLife() {
	acceptInput = false;
	if  (hearts>0)hearts--;
	document.querySelector("#button").hidden = false;
	document.querySelector("#button-text").innerHTML = "CONTINUE";
	showHearts();
	moving = "dead";
	clearInterval(time);
	throwingdiv.hidden = true;
    if (hearts==0){
		gameover.hidden = false;
		body.className="body-gameover";
		apple.style.display="none";
		document.querySelector("#input-area").hidden=true;
		document.querySelector("#button-text").innerHTML = "START";
	}
}

function tick(){
  if (moving=="dead") return;
  counttext.innerHTML=countdown;
  countdown--;
  if(countdown<0){
    clearInterval(time);
    moving="thrower";
  }
}


var  bananacount=0; //bananacount is the number of letters the user has typed

function getcode(){
  var word = levels.levelData[levels.levelC].words[ Math.floor(Math.random()*levels.levelData[levels.levelC].words.length)];
  if (levels.checkForEndOfLevel()){
	  document.querySelector("#button").hidden = false;
	  document.querySelector("#button-text").innerHTML = "CONTINUE";
	  acceptInput = false;
	  moving = "dead";
	  console.log("new level?")
  } else {
	  while( !levels.checkWordBucket(word) ) {
		  word = levels.levelData[levels.levelC].words[ Math.floor(Math.random()*levels.levelData[levels.levelC].words.length)];
	  }
	  levels.addToWordBucket(word);
  }

  document.querySelector("#untyped-letters").innerHTML=word;
  document.querySelector("#typed-letters").innerHTML="";
  bananacount=0;
  countdown = word.length * TPL;
  inputt.innerHTML="";
  return word;
}

function checkkey(key){
  if ( (acceptInput == true) && (key == codeword.charAt(bananacount)) ){
    inputt.innerHTML+=key;
	updateTyped();
    bananacount++;
    if (bananacount>=codeword.length){
      moving="goodthrow";
      throwingLeft=(screenswidth/2)+95;
      codeword=getcode();
	  score+=20;
	   updateScore();
    }
  }
  //
}

function updateScore(){
	document.querySelector("#score").innerHTML=score;
	
}


function updateTyped(){
	var typed = document.querySelector("#typed-letters");
	var untyped = document.querySelector("#untyped-letters");
 	typed.innerHTML=codeword.substring(0,bananacount+1);
	untyped.innerHTML=codeword.substring(bananacount+1);
}


document.addEventListener("keypress", function(event){
  checkkey(String.fromCharCode(event.keyCode).toUpperCase());
})
/*
throwingdiv.addEventListener("click", function(event){
    gameover.style.display="none";
    body.style.backgroundImage=bgimage;
    apple.style.display="block";
    time=setInterval(tick,100);
    countdown=50;
})
*/
function calculateWordPercentage(total){
  var answer=0;
  var perc=100/codeword.length;
  var unit=total*(perc/100);
  answer=unit*bananacount;
  //console.log(codeword+" "+codeword.length+" " +bananacount +" perc "+perc+"% unit "+unit+" "+ answer);
  return answer;
}

function showHearts() {
	heart='&#x2665;';
	heartsspan = document.querySelector("#hearts");
	deathsspan = document.querySelector("#deaths");
	heartsspan.innerHTML = '';
	deathsspan.innerHTML = '';
	for (var i = 0; i<hearts;i++){
		heartsspan.innerHTML+=heart;
	}
	for (var i = 0; i<3-hearts;i++){
		deathsspan.innerHTML+=heart;
	}
}

loaded();