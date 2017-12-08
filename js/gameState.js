gameState = {
	gState:{
		offsetX:undefined,
		offsetY:undefined,
		currentTime:undefined,
		team:undefined,
		money:undefined,
		food:undefined,
		//currentLevel:undefined,
		//selectedItems:undefined,
		counter:undefined,
		secondMoney:undefined,
		currentSupply:undefined,
		messageQueue:undefined,
		unitsUps:undefined,
		unitsEnemyUps:undefined,
		vehiclesUps:undefined,
		vehiclesEnemyUps:undefined,
		difficulty:undefined,
		enemyTeam:undefined,
	},
	gItems:{
		items:undefined,
	},
	gAI:{
	aiTimer:undefined,
	aiBuildTimer:undefined,
	humanUnitsSighted:undefined,
	humanBuildingsSighted:undefined,
	humanVehiclesSighted:undefined,
	hasFoodTent:undefined,
	hasGarage:undefined,
	hasUnitPatroling:undefined,
	},
	updateGameState:function() {
		gameState.gState = {
			
			offsetX:JSON.stringify(game.offsetX),
	    	offsetY:JSON.stringify(game.offsetY),
	    	currentTime:game.currentTime,
	    	team:JSON.stringify(game.team),
	    	money:JSON.stringify(game.money),
	    	food:JSON.stringify(game.food),
	    	//currentLevel:JSON.stringify(game.currentLevel),
	    	//selectedItems:JSON.stringify(game.selectedItems),
	    	counter:JSON.stringify(game.counter),
	    	secondMoney:JSON.stringify(game.secondMoney),
	    	currentSupply:JSON.stringify(game.currentSupply),
	    	messageQueue:JSON.stringify(game.messageQueue),
			unitsUps:JSON.stringify(game.unitsUps),
			unitsEnemyUps:JSON.stringify(game.unitsEnemyUps),
			vehiclesUps:JSON.stringify(game.vehiclesUps),
			vehiclesEnemyUps:JSON.stringify(game.vehiclesEnemyUps),
			difficulty:JSON.stringify(game.difficulty),
			enemyTeam:JSON.stringify(game.enemyTeam)
    	};
    	gameState.gItems = {
			items:game.items,
    	};
		gameState.gAI = {
		aiTimer:JSON.stringify(enemyAi.aiTimer),
		aiBuildTimer:JSON.stringify(enemyAi.aiBuildTimer),
		humanUnitsSighted:JSON.stringify(enemyAi.humanUnitsSighted),
		humanBuildingsSighted:JSON.stringify(enemyAi.humanBuildingsSighted),
		humanVehiclesSighted:JSON.stringify(enemyAi.humanVehiclesSighted),
		hasFoodTent:JSON.stringify(enemyAi.hasFoodTent),
		hasGarage:JSON.stringify(enemyAi.hasGarage),
		hasUnitPatroling:JSON.stringify(enemyAi.hasUnitPatroling),
		};
	}
};

