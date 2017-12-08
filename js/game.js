/*global window */


var game = {
    gridSize:20,
    offsetX:0,
    offsetY:0,
    panningThreshold:60, // Distance from edge of canvas at which panning starts
    panningSpeed:10, // Pixels to pan every drawing loop
    animateTimeout:100,
    isOnHud:false,
    currentSupply:10,
	aiTimer:4,
    enemyCurrentSupply:10,
    messageQueue:[],
	vehiclesEnemyUps:{
        attackLevel:1,
        defenseLevel:1,
        speedLevel:1,
        rangeLevel:1
    },
	unitsEnemyUps:{
        attackLevel:1,
        defenseLevel:1,
        speedLevel:1,
        rangeLevel:1
    },
    vehiclesUps:{
        attackLevel:1,
        defenseLevel:1,
        speedLevel:1,
        rangeLevel:1
    },
    unitsUps:{
        attackLevel:1,
        defenseLevel:1,
        speedLevel:1,
        rangeLevel:1
    },
	teamSelect:function(theTeam){
		game.team = theTeam;
		$('#chooseTeam').hide();
		$('#teamSelect').hide();
		$('#teamSelect').children().hide();
		$('#difficulty').show();
	},
    writeMessage:function(message, x, y) {
        var ctx = game.foregroundContext;
        ctx.font = '20pt Calibri';
        ctx.fillStyle = 'white';
        ctx.fillText(message, x,  y);
        ctx.fillStyle = "#FF0000";
        ctx.font = '10px sans-serif';
    },
    writeTimeMessage:function(message, x, y) {
        var ctx = game.drawingContext;
        ctx.font = '20pt Calibri';
        ctx.fillStyle = 'white';
        ctx.fillText(message, x,  y);
        ctx.fillStyle = "#FF0000";
        ctx.font = '10px sans-serif';
    },
    writeSmallMessage:function(message, x, y) {
        var ctx = game.foregroundContext;
        ctx.font = '8pt Calibri';
        ctx.fillStyle = 'white';
        ctx.fillText(message, x,  y);
        ctx.fillStyle = "#FF0000";
        ctx.font = '10px sans-serif';
    },
    writeSmallColoredMessage:function(message, color, x, y) {
        var ctx = game.drawingContext;
        ctx.font = '16pt Calibri';
        ctx.fillStyle = color;
        ctx.fillText(message, x,  y);
        ctx.fillStyle = "#FF0000";
        ctx.font = '10px sans-serif';
    },
    addMessage:function(message) {
        game.messageQueue.push(message);
        while(game.messageQueue.length > 10)
            game.messageQueue.splice(0,1);
        setTimeout(game.clearMessageQueue,5000);
    },
    writeMessageQueue:function() {
        for(var i = 0;i<game.messageQueue.length;i++){
            game.writeSmallMessage(game.messageQueue[i],10,game.canvasHeight/2-i*10);
        }
    },
    clearMessageQueue:function() {
        if(game.messageQueue.length)
            game.messageQueue.splice(0,1);
    },
    handlePanning:function(){
    // do not pan if mouse leaves the canvas
    if (!mouse.insideCanvas){
    return;
    }
    if (this.isOnHud){
      return;
    }
    if(mouse.x<=game.panningThreshold){
    if (game.offsetX>=game.panningSpeed){
    game.screenMoved = true;
    game.offsetX -= game.panningSpeed;
    }
    } else if (mouse.x>= game.canvasWidth - game.panningThreshold - 150){                   //150 is width of HUD
    if (game.offsetX + game.canvasWidth + game.panningSpeed <= game.currentMapImage.width){
    game.screenMoved = true;
    game.offsetX += game.panningSpeed;
    }
    }
    if(mouse.y<=game.panningThreshold){
    if (game.offsetY>=game.panningSpeed){
    game.screenMoved = true;
    game.offsetY -= game.panningSpeed;
    }
    } else if (mouse.y>= game.canvasHeight - game.panningThreshold - 150){                  //150 is height of HUD
    if (game.offsetY + game.canvasHeight + game.panningSpeed <= game.currentMapImage.height){
    game.screenMoved = true;
    game.offsetY += game.panningSpeed;
    }
    }
    if (game.screenMoved){
    // Update mouse game coordinates based on game offsets
    mouse.calculateGameCoordinates();
    }
    },
    resizeCanvas:function() {
            game.backgroundCanvas.width = window.innerWidth;
            game.backgroundCanvas.height = window.innerHeight;
            game.foregroundCanvas.width = window.innerWidth;
            game.foregroundCanvas.height = window.innerHeight;
            game.drawingCanvas.width = window.innerWidth-150;
            game.drawingCanvas.height = 150;
            game.canvasWidth = window.innerWidth;
            game.canvasHeight = window.innerHeight;
    },
    render:function() {
        game.handlePanning();

        if(game.screenMoved){
          game.resizeCanvas();
          game.backgroundContext.drawImage(game.currentMapImage, game.offsetX, game.offsetY, game.canvasWidth, game.canvasHeight, 0, 0, game.canvasWidth, game.canvasHeight);
          game.screenMoved = false;
        }

        game.foregroundContext.clearRect(0,0,game.canvasWidth,game.canvasHeight);
        game.drawingContext.clearRect(0,0,game.drawingCanvas.width,game.drawingCanvas.height);
        //game.drawGrayRect();

        if(mouse.insideCanvas) {
            var pos = mouse.calculateGameCoordinates();
            var message = 'Mouse position: ' + pos.x + ',' + pos.y + 'Mouse grid: ' + pos.gridx + ',' + pos.gridy;
            game.writeMessage(message,10,25);
        }
        game.drawMiniMap();
		for(var i = game.sortedItems.length-1; i>=0;i--){
			if(game.sortedItems[i].type != "projectiles"){
				game.sortedItems[i].draw();
			}
		};

		for(var i  = game.projectiles.length - 1; i >= 0; i--){
			game.projectiles[i].draw();
		};

        fog.draw();
		game.drawMiniMapBox();
        mouse.draw();
        var x = window.innerWidth - 500;
        var aMessage = 'Box Coordinates: x0:' + mouse.draggedX + ', y0:' + mouse.draggedY + ', width:' + mouse.draggedWidth + ', height:' + mouse.draggedHeight;
        if(mouse.insideCanvas) {
            var pos = mouse.calculateGameCoordinates();
            var message = 'Mouse position: ' + pos.x + ',' + pos.y;
            game.writeMessage(message,10,25);
        }
        game.writeMessage(aMessage,10,55);
        game.writeMessage("$ " + game.money,x,35);
        game.writeMessage("Supply: " + game.food + "/" + game.currentSupply,x,60);
        game.writeMessage("Secondary $ " + game.secondMoney,x,95);
        game.writeMessageQueue();
        game.writeTime();
        if(game.selectedItems.length >= 1 || game.enemySelectedItems.length == 1 )
            game.drawStats();


        if(game.on)
            requestAnimationFrame(game.render);
    },
    drawMiniMap:function(){
        var ctx = game.drawingContext;
        ctx.drawImage(game.currentMapImage, 0, 0, game.currentLevel.mapWidth * game.gridSize, game.currentLevel.mapHeight*game.gridSize, 300, 10, 130, 130);
    },
	drawMiniMapBox:function(){
		var rectStartX = 300 + game.offsetX / (175*game.gridSize) * 130;
        var rectStartY = 10 + game.offsetY / (175*game.gridSize) * 130;
        var rectEndY = game.canvasHeight/(game.currentLevel.mapHeight*game.gridSize)*130;
        var rectEndX = game.canvasWidth/(game.currentLevel.mapWidth*game.gridSize)*130;
        ctx.rect(rectStartX,rectStartY,rectEndX,rectEndY);
        ctx.stroke();
	},
    drawStats:function() {
        var theHeight = 20;
        var theWidth = 3*game.drawingCanvas.width/4;
        if(game.selectedItems.length >= 1) {
          var item = game.selectedItems[0];
        }
        else {
          var item = game.enemySelectedItems[0];
        }
        var name = item.name.replace(/_/g, ' ');
        game.writeSmallColoredMessage("Name: "+name,"white",theWidth, theHeight + 10);
        if(item.health/item.maxHealth > .75) {
          game.writeSmallColoredMessage("Health: "+item.health+"/"+item.maxHealth,"green",theWidth, theHeight + 30);
        }
        else if(item.health/item.maxHealth <= .75 && item.health/item.maxHealth > .5) {
          game.writeSmallColoredMessage("Health: "+item.health+"/"+item.maxHealth,"yellow",theWidth, theHeight + 30);
        }
        else {
          game.writeSmallColoredMessage("Health: "+item.health+"/"+item.maxHealth,"red",theWidth, theHeight + 30);
        }
        if(item.type != "buildings"){
          game.writeSmallColoredMessage("Attack: "+item.addAtt(),"white",theWidth, theHeight + 50);
          game.writeSmallColoredMessage("Defense: "+item.addDef(),"white",theWidth, theHeight + 70);
          game.writeSmallColoredMessage("Speed: "+item.addSpd(),"white",theWidth, theHeight + 90);
          game.writeSmallColoredMessage("Range: "+item.addRng(),"white",theWidth, theHeight + 110);
        }

        var isFoodTruck = item.name.search("food_truck");
        if(isFoodTruck > -1) {
          var truckWorkers = `Truck Workers: ${item.numWorkers}/${item.capacity}`
          game.writeSmallColoredMessage(truckWorkers,"white", theWidth, theHeight + 50);
        }
        game.drawingContext.drawImage(item.spriteSheet,item.pixelSheetOffsetX,item.pixelSheetOffsetY,item.pixelWidth,item.pixelHeight,theWidth-80,10,80,80);
    },
    drawGrayRect:function() {
        ctx = game.drawingContext;
        ctx.fillStyle = "#2f4f4f";
        ctx.clearRect(0,0,game.drawingCanvas.width,game.drawingCanvas.height);
        ctx.fillRect(0,0,game.drawingCanvas.width,game.drawingCanvas.height);
        ctx.fillStyle = "#FF0000";
    },
    writeTime:function(){
        var nowHours =  Math.floor(game.currentTime / 3600);
        var nowMinutes = Math.floor((game.currentTime - 3600*nowHours) / 60);
        var nowSeconds = Math.floor((game.currentTime - 3600*nowHours - 60*nowMinutes));
        if(nowMinutes < 10)
            nowMinutes = "0"+nowMinutes;
        if(nowSeconds < 10)
            nowSeconds = "0"+nowSeconds;
        var theMessage = "Game Time: " + nowHours + ":" + nowMinutes + ":" + nowSeconds;
        var height = 75;
        var width = 10;
        game.writeTimeMessage(theMessage, width, height);
    },
    count:function() {
        game.currentTime++;
    },
    init:function(difficulty) {
        $('#background').hide();
        $('#gameinterface').show();
        document.getElementById("sidehud").addEventListener("mouseenter", function(  ) {this.isOnHud=true;});
        document.getElementById("sidehud").addEventListener("mouseout", function(  ) {this.isOnHud=false;});
        window.addEventListener('resize', game.resizeCanvas, false);
        mouse.init();
        build.init();
        sounds.init();
        var firstSong = Math.floor(3*Math.random());
        if(firstSong == 0)
            firstSong = "";
        else
            firstSong += 1;
        sounds["background"+firstSong].play();
        sounds["background"+firstSong].addEventListener('ended',function() {
            this.currentTime = 0;
            if(firstSong == "")
                sounds["background2"].play();
            else if(firstSong == 2)
                sounds["background3"].play();
            else
            sounds["background"].play();
        });
        if(firstSong != "")
            sounds["background"].addEventListener('ended',function() {
            this.currentTime = 0;
            sounds["background2"].play();
        });
        if(firstSong != 2)
            sounds["background2"].addEventListener('ended',function() {
            this.currentTime = 0;
            sounds["background3"].play();
        });
        if(firstSong != 3)
            sounds["background3"].addEventListener('ended',function() {
            this.currentTime = 0;
            sounds["background"].play();
        });


        game.backgroundCanvas = document.getElementById('gamebackground');
        game.backgroundContext = game.backgroundCanvas.getContext('2d');

        game.foregroundCanvas = document.getElementById('gameforeground');
        game.foregroundContext = game.foregroundCanvas.getContext('2d');

        game.drawingCanvas = document.getElementById('gameDrawing');
        game.drawingContext = game.drawingCanvas.getContext('2d');

        game.canvasWidth = game.backgroundCanvas.clientWidth;
        game.canvasHeight = game.backgroundCanvas.clientHeight;

		game.difficulty = difficulty;
        game.enemyTeam = "";

        //assign team to cpu based on player choice
        //skin side buttons based on user choice as well
        if (game.team == "america") {
          document.getElementById('sidehud').classList.toggle('show-america', true);
          game.enemyTeam = "fusion";
        }
        else if (game.team == "coffee") {
          document.getElementById('sidehud').classList.toggle('show-coffee', true);
          game.enemyTeam = "america";
        }
        else {
          document.getElementById('sidehud').classList.toggle('show-fusion', true);
          game.enemyTeam = "coffee";
        }
        game.secondMoney = 10000;
        game.money = 10000;
        game.food = 0;
        //potential enemy starting values?
        game.enemySecondMoney = 10000;
        game.enemyMoney = 10000;
        game.enemyFood = 0;
        game.currentTime = 0;
        game.enemy
        game.timerVar = setInterval(game.count, 1000);
        game.timeState = setInterval(gameState.updateGameState, 100);
        game.currentMapImage = loader.loadImage(maps.playground.mapImage);
        game.currentLevel = maps.playground;
        game.screenMoved = true;
        game.on = true;
        game.offsetY = 0; //game.gridSize * maps.playground.startingY;
        game.offsetX = 0; //game.gridSize * maps.playground.startingX;
		var level = game.currentLevel;
		//Load level requirements
		game.resetArrays();
		for(var type in level.startingObjects){
			//console.log(level.startingObjects);
			var requirementArray = level.startingObjects[type];
			//console.log(requirementArray);
			for (var i = 0; i < requirementArray.length; i++){
				var name = requirementArray[i];

				if (window[type]){
					window[type].load(name);
				}
				else {
					console.log('Could not load type:', type);
				}
			};
		};

        fog.initLevel();
    //load the player-related items
		for (var i = level.player_items.length - 1; i >= 0; i--){
			var itemDetails = level.player_items[i];
      var team = game.team;
      var name = `${itemDetails.name}_${game.team}`;
			//console.log(itemDetails);
			game.add(itemDetails, team);
      if(itemDetails.type == "units" || itemDetails.type == "vehicles" && itemDetails.team == game.team) { //note that item.supply doesn't exist if item.type isn't units
          game.food += units.list[itemDetails.name].supply;
      }
		};
    //load the enemy-related items
    for (var i = level.enemy_items.length - 1; i >= 0; i--){
			var itemDetails = level.enemy_items[i];
      var enemyTeam = game.enemyTeam;
      var name = `${itemDetails.name}_${game.enemyTeam}`;
			//console.log(itemDetails);
			game.add(itemDetails, enemyTeam);
      if(itemDetails.type == "units" || itemDetails.type == "vehicles" && itemDetails.team == game.team) { //note that item.supply doesn't exist if item.type isn't units
          game.enemyFood += units.list[itemDetails.name].supply;
      }
		};
    for(thing in game.items) {
      if(game.items[thing].name == "food_truck_america" || game.items[thing].name == "food_truck_coffee" || game.items[thing].name == "food_truck_fusion")
      {
		  if(game.items[thing].team == game.team)
			  economy.foodTrucksListAdd(game.items[thing]);
		  else
			  economyEnemy.foodTrucksListAdd(game.items[thing]);
      }
    }
		//Create game world grid
		game.currentMapGrid = [[]];
		for(var y = 0;y < level.mapHeight; y++){
			game.currentMapGrid[y] = [];
			for (var x = 0; x < level.mapWidth; x++){
				game.currentMapGrid[y][x] = 0;
			}
		};
		for (var i = level.mapObstructedTerrain.length - 1; i >= 0; i--) {
			var obstr = level.mapObstructedTerrain[i];
			game.currentMapGrid[obstr[0]][obstr[1]] = 1;
		};
		game.currentMapPassableGrid = undefined;

        economy.init();
		economyEnemy.init();
		//Sorting items based on location
		game.sortedItems = $.extend([],game.items);
		game.sortedItems.sort(function(a,b){
			return b.y-a.y + ((b.y == a.y)?(a.x-b.x):0);
		});
		//console.log(game.sortedItems);
		game.gameAiInterval = setInterval(game.gameAi, 500);
        game.animationLoop();
        game.animationInterval = setInterval(game.animationLoop,game.animateTimeout);

        loader.onload = function() {
          game.render();
        }
    },
	gameAi:function(){
		game.aiTimer--;
		//console.log(game.aiTimer);
		if(game.aiTimer == 0){
			game.aiTimer = 4
		}
		if(game.aiTimer == 3){
			enemyAi.enemyAttackAi(game.enemyTeam);
		}
		if(game.aiTimer == 2){
			enemyAi.enemyBuildAi(game.enemyTeam);
		}
		if(game.aiTimer == 1){
			enemyAi.enemyEconAi(game.enemyTeam);
		}

	},
    deselectAll:function(){
        while(game.selectedItems.length > 0) {
            game.selectedItems[game.selectedItems.length-1].selected = false;
            game.selectedItems.pop();
        }
        while(game.enemySelectedItems.length > 0) {
            game.enemySelectedItems[game.enemySelectedItems.length-1].enemySelected = false;
            game.enemySelectedItems.pop();
        }
    },
    selectItem:function(item,deselect){
        if(deselect)
            item.selected = false;
        else {
            item.selected = true;
            game.selectedItems.push(item);
            sounds.wolf.play();
        }
    },
    selectEnemy:function(item){
        item.enemySelected = true;
        game.enemySelectedItems.push(item);
    },
	resetArrays:function(){
		game.counter=1;
		game.items=[];
		game.sortedItems=[];
		game.buildings=[];
		game.vehicles=[];
		game.units=[];
		game.triggers=[];
		game.selectedItems=[];
        game.enemySelectedItems=[];
		game.sortedItems=[];
		game.projectiles = [];
	},
	add:function(itemDetails, team, projectileFirer){
    var item;
    var skipName = false;
		if(!itemDetails.uid){
			itemDetails.uid=game.counter++;
		}
    else {
        skipName = true;
    }
    //for projectiles also give them the attributes of the unit firing
    //to ensure upgrades applied
    if (itemDetails.type == "projectiles"){
      itemDetails.damage = 0 + projectileFirer.addAtt();
    }
    else if (!skipName){
      var name = `${itemDetails.name}_${team}`;
      itemDetails.name = name;
    }
    itemDetails.team = team;
    item = window[itemDetails.type].add(itemDetails);
    // window.buildings.undefined.add(itemDetails)
    // window.buildings = itemDetails

    // Add the item to the items array
    game.items.push(item);
    // Add the item to the type specific array
    game[item.type].push(item);

    return item;

	},
	remove:function(item){
	    // Unselect item if it is selected
		switch(item.type) {
		case "buildings":
		if(item.name == "food_truck_"+item.team || item.name == "hq_" + item.team) {
			var hqCount = 0;
			var foodTruckCount = 0;
			for (i in game.items) {
				i = game.items[i];
				if(item.team == i.team) {
					if(i.name == "food_truck_"+i.team && i.health > 0)
						foodTruckCount++;
					if(i.name == "hq_"+i.team && i.health > 0)
						hqCount++;
				}
			}
			if(hqCount == 0 || foodTruckCount == 0)
				gameOver(item.team);
		}
		break;
		case "projectiles":
		break;
		case "units":
		break;
		case "vehicles":
		break;
		}
	    item.selected = false;
	    for (var i = game.selectedItems.length - 1; i >= 0; i--){
	           if(game.selectedItems[i].uid == item.uid){
	               game.selectedItems.splice(i,1);
	               break;
	           }
	    };

        for (var i = game.enemySelectedItems.length - 1; i >= 0; i--){
               if(game.enemySelectedItems[i].uid == item.uid){
                   game.enemySelectedItems.splice(i,1);
                   break;
               }
        };


	    // Remove item from the items array
	    for (var i = game.items.length - 1; i >= 0; i--){
	        if(game.items[i].uid == item.uid){
	            game.items.splice(i,1);
	            break;
	        }
	    };

	    // Remove items from the type specific array
	    for (var i = game[item.type].length - 1; i >= 0; i--){
	        if(game[item.type][i].uid == item.uid){
	            game[item.type].splice(i,1);
	            break;
	        }
	    };
	},
	animationLoop:function() {
        for (var i = game.items.length - 1; i >= 0; i--){
            if(game.items[i] && game.items[i].processOrders){
                game.items[i].processOrders();
            }
        };
		for(var i = game.items.length - 1; i >= 0; i--){
			game.items[i].animate();
		};
		//Sorting items based on location
		game.sortedItems = $.extend([],game.items);
		game.sortedItems.sort(function(a,b){
			return b.y-a.y + ((b.y == a.y)?(a.x-b.x):0);
		});
        fog.animate();
	},
	sendAiCommand:function(unit, command,x,y){
		unit.processCommand(command, x, y);
	},
	sendAiAttackCommand:function(unit, target){
		unit.processAttackCommand(target.uid);
	},
    sendCommands:function(units,command,x,y) {
        if(units.length > 0){
            for(var i = 0; i<units.length; i++){
                units[i].processCommand(command,x,y);
            }
        }
    },
	sendAttackCommand:function(units, target){
		if(units.length>0){
			for(var i = 0;i<units.length;i++){
				units[i].processAttackCommand(target.uid);
			}
		}
	},

    gainMoney:function(money, enemy) {
      if (enemy == undefined) {
        game.money += money;
      }
      else {
        game.enemyMoney += money;
      }
    },
    spendMoney:function(money, enemy) {
      if (enemy == undefined) {
        game.money -= money;
      }
      else {
        game.enemyMoney -= money;
      }
    },
    increaseFood:function(num, enemy) {
        if (enemy == undefined) {
          game.food += num;
        }
        else {
          game.enemyFood += num;
        }
    },
    decreaseFood:function(num, enemy) {
      if (enemy == undefined) {
        game.food -= num;
      }
      else {
        game.enemyFood -= num;
      }
    },
    gainSecondMoney: function(money, enemy) {
      if (enemy == undefined) {
        game.secondMoney += money;
      }
      else {
        game.enemySecondMoney += money;
      }
    },
    spendSecondMoney:function(money, enemy) {
      if (enemy == undefined) {
        game.secondMoney -= money;
      }
      else {
        game.enemySecondMoney -= money;
      }
    },
    saveGame:function() {
    //    var gameSave = prompt("Please enter Save Name", "");
    //    if (gameSave == null || gameSave == "")
     //       return;
        var cookies = document.cookie.split(";");
        for (delCookie in cookies) {
            setCookie(cookies[delCookie],"",-1);
        }
        for(thing in gameState.gState)
            setCookie(thing,gameState.gState[thing],20);
		for(thing in gameState.gAI)
            setCookie(thing,gameState.gAI[thing],20);
        for(thing in gameState.gItems)
            for(var i = 0;i<gameState.gItems[thing].length;i++)
                setCookie(thing+"["+i+"]",JSON.stringify(gameState.gItems[thing][i]),20);
        game.exit();
    },
    loadSave:function(saveFile) {
        if(!document.cookie)
            return;
        game.resetArrays();
        $('#background').hide();
        $('#gameinterface').show();
        game.backgroundCanvas = document.getElementById('gamebackground');
        game.backgroundContext = game.backgroundCanvas.getContext('2d');

        game.foregroundCanvas = document.getElementById('gameforeground');
        game.foregroundContext = game.foregroundCanvas.getContext('2d');

		game.drawingCanvas = document.getElementById('gameDrawing');
        game.drawingContext = game.drawingCanvas.getContext('2d');

        game.canvasWidth = game.backgroundCanvas.clientWidth;
        game.canvasHeight = game.backgroundCanvas.clientHeight;
        game.items = [];
        game.sortedItems = [];
        game.currentLevel = maps.playground;
        level = game.currentLevel;
                //Create game world grid
        game.currentMapGrid = [[]];
        for(var y = 0;y < level.mapHeight; y++){
            game.currentMapGrid[y] = [];
            for (var x = 0; x < level.mapWidth; x++){
                game.currentMapGrid[y][x] = 0;
            }
        };
        for (var i = level.mapObstructedTerrain.length - 1; i >= 0; i--) {
            var obstr = level.mapObstructedTerrain[i];
            game.currentMapGrid[obstr[0]][obstr[1]] = 1;
        };
        game.currentMapPassableGrid = undefined;

        document.getElementById("sidehud").addEventListener("mouseenter", function(  ) {this.isOnHud=true;});
        document.getElementById("sidehud").addEventListener("mouseout", function(  ) {this.isOnHud=false;});
        window.addEventListener('resize', game.resizeCanvas, false);
        for (item in gameState.gState) {
            game[item] = JSON.parse(getCookie(item));
        }
		for (item in gameState.gAI) {
            enemyAi[item] = JSON.parse(getCookie(item));
        }
        for (item in gameState.gItems) {
            var i = 0;
            while(getCookie(item+"["+i+"]")){
                var theThing = getCookie(item+"["+i+"]");
                var theThing = JSON.parse(theThing);
                window[theThing.type].load(theThing.name);
                game.add(theThing,theThing.team);
                i++;
            }
        }
        game.sortedItems = $.extend([],game.items);
        game.sortedItems.sort(function(a,b){
            return b.y-a.y + ((b.y == a.y)?(a.x-b.x):0);
        });
        for(thing in game.items) {
            if(game.items[thing].name == "food_truck_america" || game.items[thing].name == "food_truck_coffee" || game.items[thing].name == "food_truck_fusion" )
                if(game.items[thing].team == game.team)
					economy.foodTrucksListAdd(game.items[thing]);
				else
					economyEnemy.foodTrucksListAdd(game.items[thing]);
        }
        mouse.init();
        economy.init();
		economyEnemy.init();
        sounds.init();
        game.gameAiInterval = setInterval(game.gameAi, 500);
        game.timerVar = setInterval(game.count, 1000);
        game.timeState = setInterval(gameState.updateGameState, 100);
        game.currentMapImage = loader.loadImage(maps.playground.mapImage);
        game.screenMoved = true;
        game.on = true;
        //Load level requirements

        fog.initLevel();


        //console.log(game.sortedItems);


        loader.onload = function() {
            game.animationLoop();
            game.animationInterval = setInterval(game.animationLoop,game.animateTimeout);
            game.render();
        }

    },
    gameEnd:function(condition) {

    },
    exit:function() {

    }
}
