var enemyAi = {
	aiTimer:0,
	aiBuildTimer:0,
	humanUnitsSighted:[],
	humanBuildingsSighted:[],
	humanVehiclesSighted:[],
	hasFoodTent:false,
	hasGarage:false,
	hasUnitPatroling:false,



enemyAttackAi:function(team){
	enemyAi.aiTimer++;
	var mascot = "mascot_" + team;
	var brawler = "brawler_" + team;
	var food_critic = "food_critic_"+team;
	var specialty_chef = "specialty_chef_"+team;
	var bicycle = "bicycle_"+team;
	var food_truck = "food_truck_"+team;
	var food_tent = "food_tent_"+team;
	var hq = "hq_"+team;
	var garage = "garage_"+team;
	var enemyUnits = [];
	var enemyMascots = [];
	var enemyFood_Critics = [];
	var enemyBrawlers = [];
	var enemySpecialty_Chefs = [];
	var enemyVehicles = [];
	var enemyBuildings = [];
	for(var i = game.items.length-1; i>=0; i--){
		var item = game.items[i];
		if(item.type == "units" && item.team == team){
			enemyUnits.push(item);
			if(item.name == mascot){
				enemyMascots.push(item);
			}
			if(item.name == food_critic){
				enemyFood_Critics.push(item);
			}
			if(item.name == specialty_chef){
					enemySpecialty_Chefs.push(item);
			}
			if(item.name == brawler){
				enemyBrawlers.push(item);
			}
		}
		if(item.type == "vehicles" && item.team == team){
			enemyVehicles.push(item);
		}
		if(item.type == "buildings" && item.team == team){
			enemyBuildings.push(item);
		}
	}
	for(var h = enemyUnits.length-1; h >= 0; h--){
		var distance;
		var unit = enemyUnits[h];
		//checking for any human opponents nearby to add to human sighted arrays
		for(item in game.sortedItems){
          if(game.sortedItems[item].team != unit.team && game.sortedItems[item].type != "projectiles") {
            distance = Math.pow(game.sortedItems[item].x - unit.x,2) + Math.pow(game.sortedItems[item].y - unit.y,2);
            if(distance<Math.pow(unit.sight,2)){
              if(game.sortedItems[item].type == "units" && !enemyAi.humanUnitsSighted.includes(game.sortedItems[item].uid)){
				  enemyAi.humanUnitsSighted.push(game.sortedItems[item].uid);
			  }
			  if(game.sortedItems[item].type == "vehicles" && !enemyAi.humanVehiclesSighted.includes(game.sortedItems[item].uid)){
				  enemyAi.humanVehiclesSighted.push(game.sortedItems[item].uid);
			  }
			  if(game.sortedItems[item].type == "buildings" && !enemyAi.humanBuildingsSighted.includes(game.sortedItems[item].uid)){
				  enemyAi.humanBuildingsSighted.push(game.sortedItems[item].uid);

			  }
			}
		  }
		}

		//Check status of human player
		//If timer has run out and computer has not found any human buildings, rush the upper left corner
		//Otherwise move to attack known human building locations
		if((enemyAi.aiTimer > 500 && enemyAi.humanBuildingsSighted.length == 0) || game.difficulty == "easy"){
			enemyAi.aiMoveCommand(unit, "move", 10*game.gridSize, 10*game.gridSize)
		}
		else if (enemyAi.aiTimer > 500 && enemyAi.humanBuildingsSighted.length > 0){
			for (building in enemyAi.humanBuildingsSighted){
				for (items in game.sortedItems){
					if (building == game.sortedItems[item].uid && game.sortedItems[item].name == hq){
						enemyAi.aiMoveCommand(unit, "move", game.sortedItems[item].x, game.sortedItems[item].y);
					}
					else if (building == game.sortedItems[item].uid && game.sortedItems[item].name == food_tent){
						enemyAi.aiMoveCommand(unit, "move", game.sortedItems[item].x, game.sortedItems[item].y);
					}
					else if (building == game.sortedItems[item].uid && game.sortedItems[item].name == garage) {
						enemyAi.aiMoveCommand(unit, "move", game.sortedItems[item].x, game.sortedItems[item].y);
					}
					else if (building == game.sortedItems[item].uid && game.sortedItems[item].name == food_cart){
						enemyAi.aiMoveCommand(unit, "move", game.sortedItems[item].x, game.sortedItems[item].y);
					}
				}
			}
		}
		else {

		enemyAi.aiMovementLogic(unit, enemyBuildings);
		}
	}
	for(var h = enemyVehicles.length-1; h >= 0; h--){
		var unit = enemyVehicles[h];
		//checking for any human opponents nearby to add to human sighted arrays
		for(item in game.sortedItems){
          if(game.sortedItems[item].team != unit.team && game.sortedItems[item].type != "projectiles") {
            distance = Math.pow(game.sortedItems[item].x - unit.x,2) + Math.pow(game.sortedItems[item].y - unit.y,2);
            if(distance<Math.pow(unit.sight,2)){
              if(game.sortedItems[item].type == "units" && !humanUnitsSighted.includes(item.uid)){
				  enemyAi.humanUnitsSighted.push(game.sortedItems[item].uid);
			  }
			  if(game.sortedItems[item].type == "vehicles" && !humanVehiclesSighted.includes(item.uid)){
				  enemyAi.humanVehiclesSighted.push(game.sortedItems[item].uid);
			  }
			  if(game.sortedItems[item].type == "buildings" && !humanBuildingsSighted.includes(item.uid)){
				  enemyAi.humanBuildingsSighted.push(game.sortedItems[item].uid);
			  }
			}
		  }
		}
		//Check status of human player
		//If timer has run out and computer has not found any human buildings, rush the upper left corner
		//Otherwise move to attack known human building locations
		if((enemyAi.aiTimer > 500 && enemyAi.humanBuildingsSighted.length == 0)|| game.difficulty == "easy"){
			enemyAi.aiMoveCommand(unit, "move", 10*game.gridSize, 10*game.gridSize)
		}
		else if (enemyAi.aiTimer > 500 && enemyAi.humanBuildingsSighted.length > 0){
			for (building in enemyAi.humanBuildingsSighted){
				for (items in game.sortedItems){
					if (building == game.sortedItems[item].uid && game.sortedItems[item].name == hq){
						enemyAi.aiMoveCommand(unit, "move", game.sortedItems[item].x, game.sortedItems[item].y);
					}
					else if (building == game.sortedItems[item].uid && game.sortedItems[item].name == food_tent){
						enemyAi.aiMoveCommand(unit, "move", game.sortedItems[item].x, game.sortedItems[item].y);
					}
					else if (building == game.sortedItems[item].uid && game.sortedItems[item].name == garage) {
						enemyAi.aiMoveCommand(unit, "move", game.sortedItems[item].x, game.sortedItems[item].y);
					}
					else if (building == game.sortedItems[item].uid && game.sortedItems[item].name == food_cart){
						enemyAi.aiMoveCommand(unit, "move", game.sortedItems[item].x, game.sortedItems[item].y);
					}
				}
			}
		}
		else {
		enemyAi.aiMovementLogic(unit, enemyBuildings);
		}
	}

	/*
	for(var h = enemyBuildings.length-1; h >= 0; h--){
		var building = enemyBuildings[h];
		game.sendCommands(enemyBuildings, "move", 133*game.gridSize, 135*game.gridSize);	
		if (building.reachedDestination == true){
			build.make("food_tent", "buildings", "enemy");
		}
		if(enemyBrawlers.length < 3){
			build.make("brawler", "units", "enemy");
		}
		else if(enemyFood_Critics.length < 3){
			build.make("food_critic", "units", "enemy");
		}
		else if(enemySpecialty_Chefs.length < 3) {
			build.make("specialty_chef", "units", "enemy");
		}
		else if(enemyVehicles.length < 3){
			build.make("bicycle", "vehicles", "enemy");
		}
		}
		}
	
	for(var h = enemyBuildings.length-1; h>=0; h--){
		var building = enemyBuildings[h];
		if(building.name == hq){
			//enemyAi.aiHqBuildOptions(building);
		}
		if(building.name == food_tent){
			enemyAi.aiFood_TentBuildOptions(building);
		}
		if(building.name == garage){
			enemyAi.garageBuildOptions(building);
		}
	}
*/	
	
},
aiMovementLogic:function(unit,enemyBuildings){

		var unit_x_loc = unit.x;
		var unit_y_loc = unit.y;
		var homefood_tentlocx;
		var homefood_tentlocy;
		var homegaragelocx;
		var homegaragelocy;
		var distance_from_foot_tent;
		var distance_from_garage;
		var distance_from_hq;
		var maxPatrolRange = 40;
		
//Determining next random step
		var ranNum = Math.floor((Math.random() * 15) + 1);
		//ranNum *= Math.floor(Math.random()*2) == 1 ? 1: -1;
		var ranAxisNum = Math.floor(Math.random()*(6-1+1)+1);
		//Patroling direction, favors northwest
		if(ranAxisNum == 1 || ranAxisNum == 2){
		unit_x_loc -= ranNum;
		}
		else if(ranAxisNum == 3 || ranAxisNum == 4) {
		unit_y_loc -= ranNum;
		}
		else if (ranAxisNum == 5){
			unit_x_loc += ranNum;
		}
		else if (ranAxisNum == 6){
			unit_y_loc += ranNum;
		}
		if(unit.name == "specialty_chef_"+game.enemyTeam && unit.patrolling == true){
		var ranNum = Math.floor((Math.random() * 5) + 1);
		ranNum *= Math.floor(Math.random()*2) == 1 ? 1: -1;
		unit_x_loc *= game.gridSize+ranNum;
		unit_y_loc *= game.gridSize+ranNum;
		enemyAi.aiMoveCommand(unit, "move", unit_x_loc, unit_y_loc);			
		}
		else if(unit.name == "specialty_chef_"+game.enemyTeam && enemyAi.hasUnitPatroling == false){
			enemyAi.hasUnitPatroling = true;
			unit.patrolling = true;
			var ranNum = Math.floor((Math.random() * 5) + 1);
			ranNum *= Math.floor(Math.random()*2) == 1 ? 1: -1;
			unit_x_loc *= game.gridSize+ranNum;
			unit_y_loc *= game.gridSize+ranNum;
			enemyAi.aiMoveCommand(unit, "move", unit_x_loc, unit_y_loc);
		}
		else {
		//Getting location of AI hq
		var homehqloc = enemyAi.getHomeHqLoc(enemyBuildings);
		var homehqlocx = homehqloc[0];
		var homehqlocy = homehqloc[1];
		distance_from_hq = Math.pow(unit_x_loc-homehqlocx,2)+Math.pow(unit_y_loc-homehqlocy,2);
		//Getting location of AI food tent
		if(enemyAi.hasFoodTent == true){
		var homefood_tentloc = enemyAi.getHomeFoodTentLoc(enemyBuildings);
		homefood_tentlocx = homefood_tentloc[0];
		homefood_tentlocy = homefood_tentloc[1];
		distance_from_foot_tent = Math.pow(unit_x_loc-homefood_tentlocx,2)+Math.pow(unit_y_loc-homefood_tentlocy,2);
		}
		//Getting location of AI garage
		if(enemyAi.hasGarage == true){
		var homegarageloc = enemyAi.getHomeGarageLoc(enemyBuildings);
		homegaragelocx = homegarageloc[0];
		homegaragelocy = homegarageloc[1];
		distance_from_garage = Math.pow(unit_x_loc-homegaragelocx,2)+Math.pow(unit_y_loc-homegaragelocy,2);
		}
		//Check if unit is getting too far from base, if it is then turn it around for a move towards home
		if(distance_from_foot_tent > Math.pow(maxPatrolRange,2) || distance_from_garage > Math.pow(maxPatrolRange,2) || distance_from_hq > Math.pow(maxPatrolRange,2)){
			if(enemyAi.hasFoodTent == true){
				enemyAi.aiMoveCommand(unit, "move", homefood_tentlocx*game.gridSize, homefood_tentlocy*game.gridSize);
			}
			else if (enemyAi.hasGarage == true){
				enemyAi.aiMoveCommand(unit, "move", homegaragelocx*game.gridSize, homegaragelocy*game.gridSize);
			}
			else {
				enemyAi.aiMoveCommand(unit, "move", homehqlocx*game.gridSize, homehqlocy*game.gridSize);
			}
		}
			else if (unit.moveCounter == 3){
				enemyAi.aiMoveCommand(unit, "idle");
			}
			else {
		//Else continue random patrol movement
		enemyAi.aiMoveCommand(unit, "move", unit_x_loc*game.gridSize, unit_y_loc*game.gridSize);
			}
		}	

},
getHomeFoodTentLoc:function(enemyBuildings, food_tent){
	for(var i = enemyBuildings.length-1;i>=0;i--){
		if (enemyBuildings[i].name == ("food_tent_"+game.enemyTeam)){
			return [enemyBuildings[i].x,enemyBuildings[i].y];
	}
	}	
},
getHomeHqLoc:function(enemyBuildings){
	for(var i = enemyBuildings.length-1;i>=0;i--){
		if (enemyBuildings[i].name == ("hq_"+game.enemyTeam)){
			return [enemyBuildings[i].x,enemyBuildings[i].y];
	}
	}
},
getHomeGarageLoc:function(enemyBuildings, garage){
	for(var i = enemyBuildings.length-1;i>=0;i--){
		if (enemyBuildings[i].name == ("garage_"+game.enemyTeam)){
			return [enemyBuildings[i].x,enemyBuildings[i].y];
	}
	}
},
aiMoveCommand:function(unit, command, x,y){
	game.sendAiCommand(unit, command, x,y);	
},

aiHqBuildOptions:function(hq){
	build.addSupply(game.enemyTeam);
},

aiFood_TentBuildOptions:function(foodtent){
	build.make(units);
},

aiGarageBuildOptions:function(building){
	build.make(units);
},

enemyBuildAi:function(team){
	enemyAi.aiBuildTimer++;
	var garages = [];
	var food_tents = [];
	var food_carts = [];
	var enemyMascots = [];
	var enemyFood_Critics = [];
	var enemyPrep_Cooks = [];
	var enemyBrawlers = [];
	var enemySpecialty_Chefs = [];
	for(var i = game.items.length-1; i>=0; i--){
		var item = game.items[i];
		if(item.type == "units" && item.team == team){
			if(item.name == "mascot_"+game.enemyTeam){
				enemyMascots.push(item);
			}
			if(item.name == "prep_cook_"+game.enemyTeam){
				enemyPrep_Cooks.push(item);
			}
			if(item.name == "food_critic_"+game.enemyTeam){
				enemyFood_Critics.push(item);
			}
			if(item.name == "specialty_chef_"+game.enemyTeam){
					enemySpecialty_Chefs.push(item);
			}
			if(item.name == "brawler_"+game.enemyTeam){
				enemyBrawlers.push(item);
			}
				
			}
		}
	var buildingCount = 0;
	for(item in game.items){
		item = game.items[item];
		if(item.name.search("garage") > -1 && item.team == game.enemyTeam){
			garages.push(item);
			if(game.enemyMoney > 400 && game.enemyFood+1<game.enemyCurrentSupply && enemyAi.aiBuildTimer >5){
				enemyAi.aiBuildTimer = 0;
				build.make("bicycle", "vehicles", true, item);
			}
		}
		if(item.name.search("food_tent")>-1 && item.team == game.enemyTeam){
			food_tents.push(item);
			if(game.enemyMoney > 550 && game.enemyFood+1<game.enemyCurrentSupply && enemyAi.aiBuildTimer > 5 && enemyFood_Critics.length < 8){
				enemyAi.aiBuildTimer = 0;
				build.make("food_critic", "units", true, item);
			}
			if(game.enemyMoney > 400 && game.enemyFood+2<game.enemyCurrentSupply && enemyAi.aiBuildTimer > 5 && enemyBrawlers.length < 8){
				enemyAi.aiBuildTimer = 0;
				build.make("brawler", "units", true, item);
			}
			if(game.enemyMoney > 500 && game.enemyFood+3<game.enemyCurrentSupply && enemyAi.aiBuildTimer > 5 && enemySpecialty_Chefs.length<8){
				enemyAi.aiBuildTimer = 0;
				build.make("specialty_chef", "units", true, item);
			}
		}
		if(item.name.search("food_cart")>-1 && item.team == game.enemyTeam){
			food_carts.push(item);
			if(game.enemyMoney > 250 && game.enemyFood+1<game.enemyCurrentSupply && enemyAi.aiBuildTimer > 5 && enemyMascots.length<8){
				enemyAi.aiBuildTimer = 0;
				build.make("mascot", "units", true, item);
			}
			if(game.enemyMoney >= 200 && game.enemyFood+1<game.enemyCurrentSupply && enemyAi.aiBuildTimer > 5 && enemyPrep_Cooks.length<8){
				enemyAi.aiBuildTimer = 0;
				build.make("prep_cook", "units", true, item);
			}
		}
	}
},
moveFoodTruck:function(foodTruck,x,y){
	var units = [];
	foodTruck.reachedDestination = false;
	units.push(foodTruck)
	game.sendCommands(units,"move",(foodTruck.x+x)*game.gridSize,(foodTruck.y+y)*game.gridSize);
	foodTruck.movingToDest=true;
},
makeBuilding:function(building,truck){
	build.make(building,"buildings",true,truck);
	truck.clearOrders();

},
enemyEconAi:function(team){
	var foodTrucks = [];
	var buildingCount = 0;
	var hq;
	for(item in game.items) {
		item = game.items[item];
		if(item.name.search("food_truck") > -1 && item.team == game.enemyTeam){
			foodTrucks.push(item);
			if(game.enemyMoney > 1000 && item.numWorkers < 12 ){
				item.addWorker(true);
			}
		}
		else if(item.type == "buildings" && item.team == game.enemyTeam && item.name != "hq_" + game.enemyTeam)
			buildingCount++;
		else if(item.name == "hq_"+game.enemyTeam)
			hq = item;
	}
	
	if(buildingCount < 1 && foodTrucks[0].movingToDest != true) {
		enemyAi.moveFoodTruck(foodTrucks[0],-30,-30)
	}
	else if(buildingCount < 1 && buildings.list["food_cart_"+game.enemyTeam].cost < game.enemyMoney){
		enemyAi.makeBuilding("food_cart",foodTrucks[0])
	}
	if(buildingCount >= 1) {
		var allWorkers = true;
		for (truck in foodTrucks){
			if(foodTrucks[truck].numWorkers != 12)
				allWorkers = false;
		}
		if(!allWorkers && game.enemyCurrentSupply <= (game.enemyFood+2) && game.enemyCurrentSupply < 200){
			enemyAi.aiHqBuildOptions(hq);
		}
		if(game.difficulty != "easy"){
			var randUpgrade = 1+Math.floor(8*Math.random());
			switch(randUpgrade) {
				case 1:
					if(build.upgradeAttack*game.unitsEnemyUps.attackLevel < game.enemySecondMoney && game.unitsEnemyUps.attackLevel < 10)
						attackUp("units",game.unitsEnemyUps.attackLevel,true);
					break;
				case 2:
					if(build.upgradeAttack*game.unitsEnemyUps.defenseLevel < game.enemySecondMoney && game.unitsEnemyUps.defenseLevel < 10)
						defenseUp("units",game.unitsEnemyUps.defenseLevel,true);
					break;
				case 3:
					if(build.upgradeSpeed*game.unitsEnemyUps.speedLevel < game.enemySecondMoney && game.unitsEnemyUps.speedLevel < 2)
						speedUp("units",true);
					break;
				case 4:
					if(build.upgradeRange*game.unitsEnemyUps.rangeLevel < game.enemySecondMoney && game.unitsEnemyUps.rangeLevel < 2)
						rangeUp("units",game.unitsEnemyUps.attackLevel,true);
					break;
				case 5:
					if(build.upgradeAttack*game.vehiclesEnemyUps.attackLevel < game.enemySecondMoney && game.vehiclesEnemyUps.attackLevel < 10)
						attackUp("vehicles",game.vehiclesEnemyUps.attackLevel,true);
					break;
				case 6:
					if(build.upgradeAttack*game.vehiclesEnemyUps.defenseLevel < game.enemySecondMoney && game.vehiclesEnemyUps.defenseLevel < 10)
						defenseUp("vehicles",game.vehiclesEnemyUps.defenseLevel,true);
					break;
				case 7:
					if(build.upgradeSpeed*game.vehiclesEnemyUps.speedLevel < game.enemySecondMoney && game.vehiclesEnemyUps.speedLevel < 2)
						speedUp("vehicles",true);
					break;
				case 8:
					if(build.upgradeRange*game.vehiclesEnemyUps.rangeLevel < game.enemySecondMoney && game.vehiclesEnemyUps.rangeLevel < 2)
						rangeUp("vehicles",game.vehiclesEnemyUps.attackLevel,true);
					break;
			}
		}
		if(game.enemyMoney >= 10000 && allWorkers==true){
			build.make("food_truck","buildings",true,hq);
		}
		if(foodTrucks.length > buildingCount){
			for(var i = 0; i<foodTrucks.length; i++){
				if(foodTrucks[i].hasOutpost == false){
					if((i+1)%3 == 0){
						if(foodTrucks[i].movingToDest != true) {
							enemyAi.moveFoodTruck(foodTrucks[i],i*(-10),i*(-45));
						}
						else if(buildings.list["garage_"+game.enemyTeam].cost < game.enemyMoney && foodTrucks[i].orders != "move")
							enemyAi.makeBuilding("garage",foodTrucks[i])
					}
					else if((i+1)%2 == 0){
						if(foodTrucks[i].movingToDest != true) {
							enemyAi.moveFoodTruck(foodTrucks[i],i*(-40),i*(-20));
						}
						else if(buildings.list["food_tent_"+game.enemyTeam].cost < game.enemyMoney && foodTrucks[i].orders != "move")
							enemyAi.makeBuilding("food_tent",foodTrucks[i])
						}
					else{
						if(foodTrucks[i].movingToDest != true) {
							enemyAi.moveFoodTruck(foodTrucks[i],i*(-30),i*(-30));
						}
						else if(buildings.list["food_cart_"+game.enemyTeam].cost < game.enemyMoney && foodTrucks[i].orders != "move")
							enemyAi.makeBuilding("food_cart",foodTrucks[i])
						}
					}
				}
			}
		}
	}
}
