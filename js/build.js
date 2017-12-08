var build = {
  init:function(){
    build.upgradeSpeed = 3000;
    build.upgradeVision = 3000;
    build.upgradeAttack = 1000;
    build.upgradeDefense = 1000;
    build.addFood = 500;
    build.foodLevel = 1;
    build.enemyFoodLevel = 1;
    document.getElementById('supply').innerHTML = `Buy 10 food for $${build.addFood}`;
    supply

  },

  //allow building of buildings when food truck selected. Only HQ can buid food truck
  enableBuildingButtons:function(){
    document.getElementById('sidehud').classList.toggle('show-food_truck', true);
  },
  //allow building of units when any other building selected
  enableUnitButtons:function(){
    document.getElementById('sidehud').classList.toggle('show-food_truck', true);
  },

  enableAdvancedUnitButtons:function(){
    document.getElementById('sidehud').classList.toggle('show-food_tent', true);
  },

  enableFoodCartButtons:function(){
    document.getElementById('sidehud').classList.toggle('show-food_cart', true);
  },

  //enable vehicles when clicking on the garage
  enableVehicleButtons(){
    document.getElementById('sidehud').classList.toggle('show-garage', true);
  },

  enableHqButtons:function(){
    document.getElementById('sidehud').classList.toggle('show-hq', true);
  },

  expandFoodTruck(){
    //team human
    document.getElementById('bottomhud').classList.toggle('show-addWorker', true);

  },

  disableButtons:function(){
    document.getElementById('sidehud').classList.toggle('show-food_cart', false);
    document.getElementById('sidehud').classList.toggle('show-hq', false);
    document.getElementById('sidehud').classList.toggle('show-food_tent', false);
    document.getElementById('sidehud').classList.toggle('show-food_truck', false);
    document.getElementById('sidehud').classList.toggle('show-garage', false);
    document.getElementById('sidehud').classList.toggle('show-back', false);
    document.getElementById('sidehud').classList.toggle('show-upgrades', false);
    document.getElementById('bottomhud').classList.toggle('show-addWorker', true);
    //remove any tables that might've been created
    var deleteHqUnitTable = document.getElementById("unitTable");
    while (deleteHqUnitTable.firstChild) {
      deleteHqUnitTable.removeChild(deleteHqUnitTable.firstChild);
    }
    var deleteHqVehicleTable = document.getElementById("vehicleTable");
    while (deleteHqVehicleTable.firstChild) {
      deleteHqVehicleTable.removeChild(deleteHqVehicleTable.firstChild);
    }
  },

  addSupply:function(enemy){
    var cost;
    //if human player request
    if (enemy == undefined)
    {
      cost = build.addFood * build.foodLevel;
      if (game.secondMoney - cost < 0) {
        game.addMessage("Your broke ass can't afford that");
        return;
      }
      //
      else {
        game.spendSecondMoney(cost);
        build.foodLevel += 1;
        game.currentSupply += 10;
        cost = build.addFood * build.foodLevel;
        document.getElementById('supply').innerHTML = `Buy 10 Food for $${cost}`;
      }
    }
    else //do the robit's bidding
    {
      cost = build.addFood * build.enemyFoodLevel;
      if (game.enemySecondMoney - cost > 0) {
        game.spendSecondMoney(cost, 1);
        build.enemyFoodLevel += 1;
        game.enemyCurrentSupply += 10;
      }
      else {
        return -1;
      }
    }

  },

  enableUpgrades:function(){
    build.disableButtons();
    document.getElementById('sidehud').classList.toggle('show-upgrades', true);
    document.getElementById('sidehud').classList.toggle('show-back', true);
    document.getElementById('back').onclick = build.enableHqButtons;
    //need to fetch uid of items and connect upgrade values to them as 2 buttons
    //for each possible item in the uid ordered list on html in class upgrades
  },

  fetchUnits:function(){
    document.getElementById('sidehud').classList.toggle('show-back', true);
    document.getElementById('back').onclick = build.enableHqButtons;
    document.getElementById('sidehud').classList.toggle('show-upgrades', false);
    document.getElementById('sidehud').classList.toggle('show-unitsTable', true);
    var insertionPoint = document.getElementById("unitTable");
    var title = document.createElement("div");
    var titleText = document.createTextNode("Upgrade your units!");
    title.appendChild(titleText);
    insertionPoint.appendChild(title);
    var descriptor = document.createElement("div");
    var descriptorText = document.createTextNode("Upgrades will be applied to all new and existing units.");
    descriptor.appendChild(descriptorText);
    insertionPoint.appendChild(descriptor);

    //build attack options
    var attackL = document.createElement("div");
    var attackLText = document.createTextNode(`Current Attack Lvl: ${game.unitsUps.attackLevel}` );
    attackL.appendChild(attackLText);
    insertionPoint.appendChild(attackL);
    if (game.unitsUps.attackLevel < 10) {
      var upgradeAttack = document.createElement("button");
      upgradeAttack.setAttribute("id", "attackButton");
      upgradeAttack.setAttribute("onClick", `attackUp('units', '${game.unitsUps.attackLevel}')`);
      var upgradeLevel = game.unitsUps.attackLevel + 1;
      var upgradeCost = upgradeLevel * build.upgradeAttack;
      var upgradeAttackTextNode = document.createTextNode(`Level ${upgradeLevel}: $${upgradeCost}`);
      upgradeAttack.appendChild(upgradeAttackTextNode);
      insertionPoint.appendChild(upgradeAttack);
    }
    else {
      var attackDone = document.createElement("div");
      var attackDoneTextNode = document.createTextNode("Attack Maxed Out");
      attackDone.appendChild(attackDoneTextNode);
      insertionPoint.appendChild(attackDone);
    }

    //build defense options
    var defenseL = document.createElement("div");
    var defenseLText = document.createTextNode(`Current Defense Lvl: ${game.unitsUps.defenseLevel}` )
    defenseL.appendChild(defenseLText);
    insertionPoint.appendChild(defenseL);
    if (game.unitsUps.defenseLevel < 10) {
      var upgradeDefense = document.createElement("button");
      upgradeDefense.setAttribute("id", "defenseButton");
      upgradeDefense.setAttribute("onClick", `defenseUp('units', '${game.unitsUps.defenseLevel}')`);
      var upgradeLevel = game.unitsUps.defenseLevel + 1;
      var upgradeCost = upgradeLevel * build.upgradeDefense;
      var upgradeDefenseTextNode = document.createTextNode(`Level ${upgradeLevel}: $${upgradeCost}`);
      upgradeDefense.appendChild(upgradeDefenseTextNode);
      insertionPoint.appendChild(upgradeDefense);
    }
    else {
      var defenseDone = document.createElement("div");
      var defenseDoneTextNode = document.createTextNode("Defense Maxed Out");
      defenseDone.appendChild(defenseDoneTextNode);
      insertionPoint.appendChild(defenseDone);
    }

    //build speed options
    var speedL = document.createElement("div");
    var speedLText = document.createTextNode(`Current Speed Lvl: ${game.unitsUps.speedLevel}` )
    speedL.appendChild(speedLText);
    insertionPoint.appendChild(speedL);
    if (game.unitsUps.speedLevel < 2) {
      var upgradeSpeed = document.createElement("button");
      upgradeSpeed.setAttribute("id", "speedButton");
      upgradeSpeed.setAttribute("onClick", `speedUp('units', '${game.unitsUps.speedLevel}')`);
      var upgradeLevel = game.unitsUps.speedLevel + 1;
      var upgradeCost = upgradeLevel * build.upgradeSpeed;
      var upgradeSpeedTextNode = document.createTextNode(`Level ${upgradeLevel}: $${upgradeCost}`);
      upgradeSpeed.appendChild(upgradeSpeedTextNode);
      insertionPoint.appendChild(upgradeSpeed);
    }
    else {
      var speedDone = document.createElement("div");
      var speedDoneTextNode = document.createTextNode("Speed Maxed Out");
      speedDone.appendChild(speedDoneTextNode);
      insertionPoint.appendChild(speedDone);
    }

    //build range
    var rangeL = document.createElement("div");
    var rangeLText = document.createTextNode(`Current Vision Lvl: ${game.unitsUps.rangeLevel}` )
    rangeL.appendChild(rangeLText);
    insertionPoint.appendChild(rangeL);
    if (game.unitsUps.rangeLevel < 2) {
      var upgradeRange = document.createElement("button");
      upgradeRange.setAttribute("id", "RangeButton");
      upgradeRange.setAttribute("onClick", `rangeUp('units', '${game.unitsUps.rangeLevel}')`);
      var upgradeLevel = game.unitsUps.rangeLevel + 1;
      var upgradeCost = upgradeLevel * build.upgradeVision;
      var upgradeRangeTextNode = document.createTextNode(`Level ${upgradeLevel}: $${upgradeCost}`);
      upgradeRange.appendChild(upgradeRangeTextNode);
      insertionPoint.appendChild(upgradeRange);
    }
    else {
      var rangeDone = document.createElement("div");
      var rangeDoneTextNode = document.createTextNode("Vision Maxed Out");
      rangeDone.appendChild(rangeDoneTextNode);
      insertionPoint.appendChild(rangeDone);
    }
  },

  fetchVehicles:function(){
    document.getElementById('sidehud').classList.toggle('show-back', true);
    document.getElementById('back').onclick = build.enableHqButtons;
    //dump units in html table
    document.getElementById('sidehud').classList.toggle('show-upgrades', false);
    document.getElementById('sidehud').classList.toggle('show-vehiclesTable', true);
    var insertionPoint = document.getElementById("vehicleTable");
    var title = document.createElement("div");
    var titleText = document.createTextNode("Upgrade your vehicles!");
    title.appendChild(titleText);
    insertionPoint.appendChild(title);
    var descriptor = document.createElement("div");
    var descriptorText = document.createTextNode("Upgrades will be applied to all new and existing units.");
    descriptor.appendChild(descriptorText);
    insertionPoint.appendChild(descriptor);

    //build attack options
    var attackL = document.createElement("div");
    var attackLText = document.createTextNode(`Current Attack Lvl: ${game.vehiclesUps.attackLevel}` );
    attackL.appendChild(attackLText);
    insertionPoint.appendChild(attackL);
    if (game.vehiclesUps.attackLevel < 10) {
      var upgradeAttack = document.createElement("button");
      upgradeAttack.setAttribute("id", "attackButton");
      upgradeAttack.setAttribute("onClick", `attackUp('units', '${game.vehiclesUps.attackLevel}')`);
      var upgradeLevel = game.vehiclesUps.attackLevel + 1;
      var upgradeCost = upgradeLevel * build.upgradeAttack;
      var upgradeAttackTextNode = document.createTextNode(`Level ${upgradeLevel}: $${upgradeCost}`);
      upgradeAttack.appendChild(upgradeAttackTextNode);
      insertionPoint.appendChild(upgradeAttack);
    }
    else {
      var attackDone = document.createElement("div");
      var attackDoneTextNode = document.createTextNode("Attack Maxed Out");
      attackDone.appendChild(attackDoneTextNode);
      insertionPoint.appendChild(attackDone);
    }

    //build defense options
    var defenseL = document.createElement("div");
    var defenseLText = document.createTextNode(`Current Defense Lvl: ${game.vehiclesUps.defenseLevel}` )
    defenseL.appendChild(defenseLText);
    insertionPoint.appendChild(defenseL);
    if (game.vehiclesUps.defenseLevel < 10) {
      var upgradeDefense = document.createElement("button");
      upgradeDefense.setAttribute("id", "defenseButton");
      upgradeDefense.setAttribute("onClick", `defenseUp('units', '${game.vehiclesUps.defenseLevel}')`);
      var upgradeLevel = game.vehiclesUps.defenseLevel + 1;
      var upgradeCost = upgradeLevel * build.upgradeDefense;
      var upgradeDefenseTextNode = document.createTextNode(`Level ${upgradeLevel}: $${upgradeCost}`);
      upgradeDefense.appendChild(upgradeDefenseTextNode);
      insertionPoint.appendChild(upgradeDefense);
    }
    else {
      var defenseDone = document.createElement("div");
      var defenseDoneTextNode = document.createTextNode("Defense Maxed Out");
      defenseDone.appendChild(defenseDoneTextNode);
      insertionPoint.appendChild(defenseDone);
    }

    //build speed options
    var speedL = document.createElement("div");
    var speedLText = document.createTextNode(`Current Speed Lvl: ${game.vehiclesUps.speedLevel}` )
    speedL.appendChild(speedLText);
    insertionPoint.appendChild(speedL);
    if (game.vehiclesUps.speedLevel < 2) {
      var upgradeSpeed = document.createElement("button");
      upgradeSpeed.setAttribute("id", "speedButton");
      upgradeSpeed.setAttribute("onClick", `speedUp('units', '${game.vehiclesUps.speedLevel}')`);
      var upgradeLevel = game.vehiclesUps.speedLevel + 1;
      var upgradeCost = upgradeLevel * build.upgradeSpeed;
      var upgradeSpeedTextNode = document.createTextNode(`Level ${upgradeLevel}: $${upgradeCost}`);
      upgradeSpeed.appendChild(upgradeSpeedTextNode);
      insertionPoint.appendChild(upgradeSpeed);
    }
    else {
      var speedDone = document.createElement("div");
      var speedDoneTextNode = document.createTextNode("Speed Maxed Out");
      speedDone.appendChild(speedDoneTextNode);
      insertionPoint.appendChild(speedDone);
    }

    //build range
    var rangeL = document.createElement("div");
    var rangeLText = document.createTextNode(`Current Vision Lvl: ${game.vehiclesUps.rangeLevel}` )
    rangeL.appendChild(rangeLText);
    insertionPoint.appendChild(rangeL);
    if (game.vehiclesUps.rangeLevel < 2) {
      var upgradeRange = document.createElement("button");
      upgradeRange.setAttribute("id", "RangeButton");
      upgradeRange.setAttribute("onClick", `rangeUp('units', '${game.vehiclesUps.rangeLevel}')`);
      var upgradeLevel = game.vehiclesUps.rangeLevel + 1;
      var upgradeCost = upgradeLevel * build.upgradeVision;
      var upgradeRangeTextNode = document.createTextNode(`Level ${upgradeLevel}: $${upgradeCost}`);
      upgradeRange.appendChild(upgradeRangeTextNode);
      insertionPoint.appendChild(upgradeRange);
    }
    else {
      var rangeDone = document.createElement("div");
      var rangeDoneTextNode = document.createTextNode("Vision Maxed Out");
      rangeDone.appendChild(rangeDoneTextNode);
      insertionPoint.appendChild(rangeDone);
    }
  },

  make:function(thing, type, enemy,maker){
	var destination
    var template;
    var name;
    var team;
    var supplyCost;
	var truck;

    var cost = 0;
    //if making for the human, perform human related checks

    if (enemy == undefined) {
      name = `${thing}_${game.team}`;
      team = game.team;
      if (type == "units") {
        cost = units.list[name].cost;
        supplyCost = units.list[name].supply;
      }
      else if (type == "vehicles") {
        cost = vehicles.list[name].cost;
        supplyCost = vehicles.list[name].supply;
      }
      else {
        cost = buildings.list[name].cost;
        supplyCost = 0;
      }
      //confirm they can afford it
      if ((game.money - cost) < 0)
      {
        game.addMessage("Your broke ass can't afford that");
        return;
      }
      //confirm they have the supply
      if (game.food + supplyCost > game.currentSupply)
      {
        game.addMessage("That supply budget ain't gonna do it, baby.");
        return;
      }


      if ((game.money - cost) < 0)
      {
        game.addMessage("Your broke ass can't afford that");
        return;
      }
		destination = build.identify_build_location(0);
    }
    //if making for the enemy check enemy related stuff
    else {
      name = `${thing}_${game.enemyTeam}`;
      team = game.enemyTeam;

	  //console.log("name, team", name, team);
      var truck;
      for (var i=0; i < game.items.length-1; i++)
      {
        if (game.items[i].name.search("food_truck") > -1 && game.items[i].team == game.enemyTeam) {
          truck = game.items[i];
          //i = game.items.length;
		  //console.log("i", truck);
        }
      }

	  truck = maker;


      if (type == "units") {
        cost = units.list[name].cost;
        supplyCost = units.list[name].supply;
      }
      else if (type == "vehicles") {
        cost = vehicles.list[name].cost;
        supplyCost = vehicles.list[name].supply;
      }
      else {
        cost = buildings.list[name].cost;
        supplyCost = 0;
      }
      if ((game.enemyMoney - cost) < 0)
      {
        return -1;
      }
      //confirm they have the supply
      if (game.enemyFood + supplyCost > game.enemyCurrentSupply)
      {
        return -1;
      }
	//destination = build.identify_build_location(0, truck);
    }

    //check if the build locatiion is suitable for either side. abort if not
    //var destination = build.identify_build_location(0);
	destination = build.identify_build_location(0, truck);
    if (destination == -1)
    {
	if(enemy == undefined){
      game.addMessage("Where do you think you can build? Show me on the gosh dang map where you think there's a spot.");
      sounds.error.play();
		}
      return;
    }
    //if they made it this far, adjust the money and supply separately
    //before adding item to game
    //team human
    if (enemy == undefined) {
      game.spendMoney(cost);
      game.food += supplyCost;
    }
    //team robit
    else {
      game.spendMoney(cost, 1);
      game.enemyFood += supplyCost;
    }
/*
	if(destination.team == game.enemyTeam){
		destination.x +=3;
		destination.y +=3;
	}
*/
    //build new item based on method input
    switch (thing)
    {
      case 'mascot':
        template = {
          "type": "units",
          "name": "mascot",
          "x":destination.x,
          "y":destination.y
        };
        break;
      case 'prep_cook':
        template = {
        "type": "units",
        "name": "prep_cook",
        "x":destination.x,
        "y":destination.y
        };
        break;
      case 'brawler':
        template = {
        "type": "units",
        "name": "brawler",
        "x":destination.x,
        "y":destination.y
        };
        break;
      case 'specialty_chef':
        template = {
        "type": "units",
        "name": "specialty_chef",
        "x":destination.x,
        "y":destination.y
        };
        break;
      case 'bicycle':
        template = {
        "type": "vehicles",
        "name": "bicycle",
        "x":destination.x,
        "y":destination.y
        };
        break;
      case 'food_critic':
        template = {
        "type": "units",
        "name": "food_critic",
        "x":destination.x,
        "y":destination.y
        };
        break;
      case 'food_tent':
        template = {
          "type": "buildings",
          "name": "food_tent",
          "x":destination.x,
          "y":destination.y
        };
        break;
      case 'food_cart':
        template = {
          "type": "buildings",
          "name": "food_cart",
          "x":destination.x,
          "y":destination.y
        };
        break;
      case 'food_truck':
        template = {
          "type": "buildings",
          "name": "food_truck",
          "x":destination.x,
          "y":destination.y
        };
        break;
      case 'garage':
        template = {
          "type": "buildings",
          "name": "garage",
          "x":destination.x,
          "y":destination.y
        };
        break;
    }
    game.add(template, team);
	for(item in game.items) {
    item = game.items[item]
    if(item.name.search("food_truck")>-1) {
  		item.checkForOutposts();
    }
  }
	if(game.items[game.items.length-1].type == "buildings") {
		game.items[game.items.length-1].addDistanceMult();

    if(game.items[game.items.length-1].team == game.team)
		economy.outpostListAdd(game.items[game.items.length-1]);
	else
		economyEnemy.outpostListAdd(game.items[game.items.length-1]);
	}
},

drawDeath:function(item){
  //need replacement method for this.
  game.drawingContext.drawImage(item.spriteSheet,item.pixelSheetOffsetX,item.pixelSheetOffsetY,item.pixelWidth,item.pixelHeight,item.x*20,10,80,80);
},

//reassign offsetx and offsety on the sprite sheet to show damaged versions
updateSprite:function(item){
  //dead for the sake of drawing final sprite
  var dead = false;
  if (item.health/item.maxHealth <= .75)
  {
    if (item.health/item.maxHealth <= .10){
      dead= true;
    }
    switch (item.name) {
      case 'prep_cook_america':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 96;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 128;
      }
        break;
      case 'prep_cook_coffee':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 480;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 512;
      }
        break;
      case 'prep_cook_fusion':
      debugger;
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 864;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 896;
      }
        break;
      case 'mascot_america':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 192;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 224;
      }
        break;
      case 'mascot_coffee':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 608;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 640;
      }
        break;
      case 'mascot_fusion':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 960;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 992;
      }
        break;
      case 'food_critic_america':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 1152;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 1184;
      }
        break;
      case 'food_critic_coffee':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 1152;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 1184;
      }
        break;
      case 'food_critic_fusion':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 1152;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 1184;
      }
        break;
      case 'brawler_america':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 0;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 32;
      }
        break;
      case 'brawler_coffee':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 384;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 416;
      }
        break;
      case 'brawler_fusion':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 768;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 800;
      }
        break;
      case 'specialty_chef_coffee':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 672;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 704;
      }
        break;
      case 'specialty_chef_fusion':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 1056;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 1088;
      }
        break;
      case 'specialty_chef_america':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 288;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 320;
      }
        break;
      case 'bicycle_fusion':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 192;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 224;
      }
        break;
      case 'bicycle_coffee':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 96;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 128;
      }
        break;
      case 'bicycle_america':
      if (!dead) {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 0;
      }
      else {
        item.pixelSheetOffsetY = 0;
        item.pixelSheetOffsetX = 32;
      }
        break;
      case 'food_truck_coffee':
        if (!dead) {
          item.pixelSheetOffsetY = 448;
          item.pixelSheetOffsetX = 64;
        }
        else {
          item.pixelSheetOffsetY = 512;
          item.pixelSheetOffsetX = 0;
        }

        break;
      case 'food_truck_america':
        if (!dead) {
          item.pixelSheetOffsetY = 192;
          item.pixelSheetOffsetX = 0;
        }
        else {
          item.pixelSheetOffsetY = 192;
          item.pixelSheetOffsetX = 64;
        }
        break;
      case 'food_truck_fusion':
        if (!dead) {
          item.pixelSheetOffsetY = 768;
          item.pixelSheetOffsetX = 0;
        }
        else {
          item.pixelSheetOffsetY = 768;
          item.pixelSheetOffsetX = 64;
        }
        break;
      case 'hq_america':
        if (!dead) {
          item.pixelSheetOffsetY = 832;
          item.pixelSheetOffsetX = 64;
        }
        else {
          item.pixelSheetOffsetY = 896;
          item.pixelSheetOffsetX = 0;
        }
        break;
      case 'hq_coffee':
        if (!dead) {
          item.pixelSheetOffsetY = 960;
          item.pixelSheetOffsetX = 64;
        }
        else {
          item.pixelSheetOffsetY = 960;
          item.pixelSheetOffsetX = 0;
        }
        break;
      case 'hq_fusion':
        if (!dead) {
          item.pixelSheetOffsetY = 1024;
          item.pixelSheetOffsetX = 64;
        }
        else {
          item.pixelSheetOffsetY = 1088;
          item.pixelSheetOffsetX = 0;
        }
        break;
      case 'food_tent_coffee':
        if (!dead) {
          item.pixelSheetOffsetY = 384;
          item.pixelSheetOffsetX = 64;
        }
        else {
          item.pixelSheetOffsetY = 448;
          item.pixelSheetOffsetX = 0;
        }
        break;
      case 'food_tent_america':
        if (!dead) {
          item.pixelSheetOffsetY = 128;
          item.pixelSheetOffsetX = 0;
        }
        else {
          item.pixelSheetOffsetY = 128;
          item.pixelSheetOffsetX = 64;
        }
        break;
      case 'food_tent_fusion':
        if (!dead) {
          item.pixelSheetOffsetY = 704;
          item.pixelSheetOffsetX = 0;
        }
        else {
          item.pixelSheetOffsetY = 704;
          item.pixelSheetOffsetX = 64;
        }
        break;
      case 'food_cart_fusion':
        if (!dead) {
          item.pixelSheetOffsetY = 576;
          item.pixelSheetOffsetX = 0;
        }
        else {
          item.pixelSheetOffsetY = 576;
          item.pixelSheetOffsetX = 64;
        }
        break;
      case 'food_cart_coffee':
        if (!dead) {
          item.pixelSheetOffsetY = 320;
          item.pixelSheetOffsetX = 0;
        }
        else {
          item.pixelSheetOffsetY = 320;
          item.pixelSheetOffsetX = 64;
        }
        break;
      case 'food_cart_america':
        if (!dead) {
          item.pixelSheetOffsetY = 0;
          item.pixelSheetOffsetX = 0;
        }
        else {
          item.pixelSheetOffsetY = 0;
          item.pixelSheetOffsetX = 64;
        }
        break;
      case 'garage_america':
        if (!dead) {
          item.pixelSheetOffsetY = 1152;
          item.pixelSheetOffsetX = 0;
        }
        else {
          item.pixelSheetOffsetY = 1152;
          item.pixelSheetOffsetX = 64;
        }
        break;
      case 'garage_fusion':
        if (!dead) {
          item.pixelSheetOffsetY = 1152;
          item.pixelSheetOffsetX = 0;
        }
        else {
          item.pixelSheetOffsetY = 1152;
          item.pixelSheetOffsetX = 64;
        }
        break;
      case 'garage_coffee':
        if (!dead) {
          item.pixelSheetOffsetY = 1152;
          item.pixelSheetOffsetX = 0;
        }
        else {
          item.pixelSheetOffsetY = 1152;
          item.pixelSheetOffsetX = 64;
        }
        break;
    }

    //to simulate death ( < .1 health) then check if a unit
    //or building actually died and play correct sound.
    if (dead) {
      if (item.health <= 0) {
        if (item.type == "buildings") {
          sounds.demolition.play();
        }
        else {
          sounds.death.play();
        }
      }
    }
  }
  return;
},

  //note: need to pass in the enemy truck/building/headquarters, otherwise
  //it will not properly build for the enemy team
  identify_build_location:function(attempts, truck){
    var possibleDestination = {};
	if(truck){
		possibleDestination.x = truck.x;
		possibleDestination.y = truck.y;
	}
	else{
		possibleDestination.x=game.selectedItems[0].x;
		possibleDestination.y=game.selectedItems[0].y;
	}
    /*1st possible destination set on attempt 0 only, then that shifting destination value is passed in
      subsequent calls*/
	  var destx;
	  var desty;
    if (attempts == 0)
    {

	possibleDestination.x = Math.floor(possibleDestination.x);
      //if blue team, check the location below. otherwise look above
      //also convert from grid location to actual pixels
      /*11/25 commenting out this chunk and always building from bottom for now
      if(game.team == "america")
      {
        //ensure that we're working in whole grid numbers in the vent truck is between multiple
        possibleDestination.y = Math.floor(possibleDestination.y + 4.2);
      }
      else
      {
        possibleDestination.y = Math.floor(possibleDestination.y - 4.2);
      }

      11/25 auto looking at the bottom*/
      possibleDestination.y = Math.floor(possibleDestination.y + 4.2);
 
	}

    //follow similar functionality to drag-select check in mouse.js
    var canBuild = true;
    for (var i = 0; i <= game.items.length - 1; i++) {
        var item = game.items[i];
        var xend = Math.floor(item.x - item.pixelOffsetX/game.gridSize + item.pixelWidth/game.gridSize);
        var xstart = Math.floor(item.x - item.pixelOffsetX/game.gridSize);
        var yend = Math.floor(item.y - item.pixelOffsetY/game.gridSize + item.pixelHeight/game.gridSize);
        var ystart = Math.floor(item.y - item.pixelOffsetY/game.gridSize);
        //check if it's alive
        if(item.isAlive != "false")
        {
          /*possibleDestination currently holds proposed top left corner of 2x2 grid to build object. check if
          either the beginning or end of pixels for game objects falls in that 2 grid space
          */
          if((xstart >= possibleDestination.x && xstart <= (possibleDestination.x + 1)) || (xend >= possibleDestination.x && xend <= (possibleDestination.x + 1)) ||
			  (xstart >= destx && xstart <= (destx+1)) || (xend >= destx && xend <= (destx+1)))
          {
            if((ystart >= possibleDestination.y && ystart <= (possibleDestination.y + 1)) || (yend >= possibleDestination.y && yend <= (possibleDestination.y + 1)) ||
			(ystart >= desty && ystart <= (desty+1)) || (yend >= desty && yend <= (desty + 1)))
            {
              canBuild = false;
            }
          }
        }
    }
    //now check if there's environmental blocker in the way
    var level = game.currentLevel;
    for (var i = 0; i <= level.mapObstructedTerrain.length - 1; i++)
    {
      var coordinates = level.mapObstructedTerrain[i];
      //check if it's within the bounds of currently proposed placement
      if(coordinates[0] >= possibleDestination.x && coordinates[0] <= (possibleDestination.x + 1) ||
	  (coordinates[0] >= destx && coordinates[0] <= (destx+ 1)))
      {
        if(coordinates[1] >= possibleDestination.y && coordinates[1] <= (possibleDestination.y + 1) ||
		(coordinates[1] >= desty && coordinates[1] <= (desty + 1)))
        {
          canBuild = false;
        }
      }
    }
    /*If the landing spot is clear, return the proposed coordinate for building something.
    else call the function again with a modifier */
    //var destination;
    if (canBuild)
    {
      //destination.x = possibleDestination.x;
      //destination.y = possibleDestination.y;
      return possibleDestination;

    }
    else
    {
		
      return -1;
    }
  }
}
