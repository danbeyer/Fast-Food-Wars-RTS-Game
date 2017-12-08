(function() {
    window.requestAnimationFrame = window.requestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame;
})();

var loader = {
    loaded:true,
    loadedCount:0, // Assets that have been loaded so far
    totalCount:0, // Total number of assets that need to be loaded
    loadImage:function (url){
            this.totalCount++;
            this.loaded = false;
            $('#loadingscreen').show();
            var image = new Image();
            image.src = url;
            image.onload = loader.itemLoaded;
            return image;
    },
    itemLoaded:function(){
        loader.loadedCount++;
        if (loader.loadedCount === loader.totalCount){
            loader.loaded = true;
            $('#loadingscreen').hide();
            if(loader.onload){
            loader.onload();
            loader.onload = undefined;
            }
        }
    }

}

window.addEventListener('DOMContentLoaded', function() {
    $('ul.#teamSelect').hide();
    $('div.#chooseTeam').hide();
    $('#intro').hide();
	$('#win').hide();
	$('#lose').hide();
	$('#difficulty').hide();
}, true);


function loadItem(name){
	var item = this.list[name];

	if(item.spriteSheet){
		return;
	}

	item.spriteSheet = loader.loadImage('images/'+this.defaults.type+'/'+'SpriteSheet.png');
  //console.log(`${item} ${item.spriteSheet}`)
	if(item.projectile){
		projectiles.load(item.projectile);
	}
}

function addItem(details){
	var item = {};
	var name = details.name;
  $.extend(item,details);
	$.extend(item,this.defaults);
	$.extend(item,this.list[name]);
	item.life = item.health;

	return item;
}

function findAngle(x1, y1, x2, y2){
    return Math.atan2(y1-y2,x1-x2);
}

function hideStart() {
    $('#singleplayer').hide();
    $('#load').hide();
    $('#intro').show();
    $('#chooseTeam').show();
    $('#teamSelect').show();
    $('#teamSelect').children().show();
}

function getRndImage(ctx) {
    var time = new Date;
    var seconds = time.getSeconds();
    var image;
    if(seconds < 20){
        image = document.getElementById("meat");
    }
    if(seconds >= 20 && seconds < 40){
        image = document.getElementById("wetmeat");
    }
    if(seconds>=40){
        image = document.getElementById("spag");
    }
    pattern = ctx.createPattern(image,"repeat");
    return pattern;
}

function getRndColor(alpha) {
    var time = new Date;
    var seconds = time.getSeconds();
    var r,g,b;
    if(seconds < 15){
        r = 100;
        g = 55;
        b = 55;
    }
    if(seconds >= 15 && seconds < 30){
        r = 55;
        g = 100;
        b = 100;
    }
    if(seconds >= 30 && seconds < 45){
        r = 100;
        g = 55;
        b = 100;
    }
    if(seconds>=45){
        r = 100;
        g = 100;
        b = 100;
    }
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function canTarget(item){
	return item.team != this.team && (item.type == "buildings" || item.type == "units" || item.type == "vehicles");
}

function findTargets(){
	var targets = [];
	for (var i = game.items.length -1; i>= 0; i--){
		var item = game.items[i];
		if (this.canTarget(item)) {
			if(Math.pow(item.x-this.x,2)+Math.pow(item.y-this.y,2)<Math.pow(this.sight,2)){
				targets.push(item);
			}
		}
	};
	var unit = this;
	targets.sort(function(a,b){
		return (Math.pow(a.x-unit.x,2)+Math.pow(a.y-unit.y,2))-(Math.pow(b.x-unit.x,2)+Math.pow(b.y-unit.y,2));
	});
	return targets;
}

function addElement(type, text) {
  var newElement = document.createElement(type);
  if (text != undefined) {
    var newElementText = document.createTextNode(text);
    newElement.appendChild(newElementText);
  }
  return newElement;
}

//note costs are currently universal: same for units and vehicles
function attackUp(type, level,enemy){
  var cost = build.upgradeAttack * level;
  if (game.secondMoney - cost > 0) {
	  if(enemy == true){
		 game.spendSecondMoney(cost,true);
		game[type+"EnemyUps"].attackLevel++;
	  }
	  else{
		game.spendSecondMoney(cost);
		game[type+"Ups"].attackLevel++;
		build.disableButtons();
		if (type == "units") {
		  build.fetchUnits();
		}
		else {
		  build.fetchVehicles();
		}
	  }
  }
  else {
    game.addMessage("Your broke ass can't afford that");
    return;
  }
}

function defenseUp(type, level,enemy){
  var cost = build.upgradeDefense * level;
  if (game.secondMoney - cost > 0) {
	  	  if(enemy == true){
		 game.spendSecondMoney(cost,true);
		game[type+"EnemyUps"].defenseLevel++;
	  }
	  else{
		game.spendSecondMoney(cost);
		game[type+"Ups"].defenseLevel++;
		build.disableButtons();
		if (type == "units") {
		  build.fetchUnits();
		}
		else {
		  build.fetchVehicles();
		}
  }
  }
  else {
    game.addMessage("Your broke ass can't afford that");
    return;
  }
}

function speedUp(type,enemy){
  var cost = build.upgradeSpeed;
  if (game.secondMoney - cost > 0) {
	  	  if(enemy == true){
		 game.spendSecondMoney(cost,true);
		game[type+"EnemyUps"].speedLevel++;
	  }
	  else{
    game.spendSecondMoney(cost);
    game[type+"Ups"].speedLevel++;
    build.disableButtons();
    if (type == "units") {
      build.fetchUnits();
    }
    else {
      build.fetchVehicles();
    }
  }
  }
  else {
    game.addMessage("Your broke ass can't afford that");
    return;
  }
}

function rangeUp(type, level,enemy){
  var cost = build.upgradeVision;
  if (game.secondMoney - cost > 0) {
	  	  if(enemy == true){
		 game.spendSecondMoney(cost,true);
		game[type+"EnemyUps"].attackLevel++;
	  }
	  else{
    game.spendSecondMoney(cost);
    game[type+"Ups"].rangeLevel++;
    build.disableButtons();
    if (type == "units") {
      build.fetchUnits();
    }
    else {
      build.fetchVehicles();
    }
  }
  }
  else {
    game.addMessage("Your broke ass can't afford that");
    return;
  }
}

function addAttack(){
	if(this.team == game.team)
		return this.attack + (.1*game[this.type+"Ups"].attackLevel)*this.attack;
	else
		return this.attack + (.1*game[this.type+"EnemyUps"].attackLevel)*this.attack
}

function addDefense(){
	if(this.team == game.team)
		return this.defense + (.01*game[this.type+"Ups"].defenseLevel)*this.health;
	else
		return this.defense + (.01*game[this.type+"EnemyUps"].defenseLevel)*this.health;
}

function addSpeed(){
	if(this.team == game.team)
		return this.speed + .1*game[this.type+"Ups"].speedLevel*this.speed;
	else
		return this.speed + .1*game[this.type+"EnemyUps"].speedLevel*this.speed;
}

function addRange(){
	if(this.team == game.team)
		return this.sight + game[this.type+"Ups"].rangeLevel;
	else
		return this.sight + game[this.type+"EnemyUps"].rangeLevel;
}

function gameOver(team) {
	var winCondition = (team != game.team);
	var winString;
	game.on = false;
	window.clearInterval(economy.firstEcon);
	window.clearInterval(economy.secondEcon);
	window.clearInterval(economyEnemy.firstEcon);
	window.clearInterval(economyEnemy.secondEcon);
	window.clearInterval(game.timerVar);
	window.clearInterval(game.timeState);
	window.clearInterval(game.gameAiInterval);
	window.clearInterval(game.animationInterval);
	window.clearInterval(game.animationInterval);

	
	$('#gameinterface').hide();
	if(winCondition)
		winString = "win";
	else
		winString = "lose";
	$('#'+winString).show();
	
}

function displayBeginning() {
	location.reload();
}
