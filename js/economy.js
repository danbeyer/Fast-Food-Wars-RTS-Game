economy = {
	foodTrucksList:[],
	outpostList:[],
	init:function() {
		economy.firstEcon = setInterval(economy.updateFirstEcon, 2000);
		economy.secondEcon = setInterval(economy.updateSecondEcon, 3000);
	},
	foodTrucksListAdd:function(truck){
		economy.foodTrucksList.push(truck);
	},
	foodTrucksListRemove:function(truck) {
		for (var i = 0;i<economy.foodTrucksList.length;i++) {
			if(thing.uid == truck.uid){
				economy.foodTrucksList.splice(i,1);
				break;
			}
		}
	},
	outpostListAdd:function(outpost){
		economy.outpostList.push(outpost);
	},
	outpostListRemove:function(outpost) {
		for (var i = 0;i<economy.outpostList.length;i++) {
			if(thing.uid == outpost.uid){
				economy.outpostList.splice(i,1);
				break;
			}
		}
	},
	updateFirstEcon:function() {
		var increaseNum = 0;
		for (truck in economy.foodTrucksList) {
			increaseNum += (100 + economy.foodTrucksList[truck].numWorkers * 25)
		}
		game.gainMoney(increaseNum);
	},
	updateSecondEcon:function() {
		var increaseNum = 0;
		for (outpost in economy.outpostList) {
			if(economy.outpostList[outpost].hasTruck != -1)
				increaseNum += Math.floor(economy.outpostList[outpost].distanceMultiplier * 2)
		}
		game.gainSecondMoney(increaseNum);
	}

};

economyEnemy = {
	foodTrucksList:[],
	outpostList:[],
	init:function() {
		economyEnemy.firstEcon = setInterval(economyEnemy.updateFirstEcon, 2000);
		economyEnemy.secondEcon = setInterval(economyEnemy.updateSecondEcon, 3000);
	},
	foodTrucksListAdd:function(truck){
		economyEnemy.foodTrucksList.push(truck);
	},
	foodTrucksListRemove:function(truck) {
		for (var i = 0;i<economyEnemy.foodTrucksList.length;i++) {
			if(thing.uid == truck.uid){
				economyEnemy.foodTrucksList.splice(i,1);
				break;
			}
		}
	},
	outpostListAdd:function(outpost){
		economyEnemy.outpostList.push(outpost);
	},
	outpostListRemove:function(outpost) {
		for (var i = 0;i<economyEnemy.outpostList.length;i++) {
			if(thing.uid == outpost.uid){
				economyEnemy.outpostList.splice(i,1);
				break;
			}
		}
	},
	updateFirstEcon:function() {
		var increaseNum = 0;
		for (truck in economyEnemy.foodTrucksList) {
			increaseNum += (100 + economyEnemy.foodTrucksList[truck].numWorkers * 25)
		}
		game.gainMoney(increaseNum,true);
	},
	updateSecondEcon:function() {
		var increaseNum = 0;
		for (outpost in economyEnemy.outpostList) {
			if(economyEnemy.outpostList[outpost].hasTruck != -1)
				increaseNum += Math.floor(economyEnemy.outpostList[outpost].distanceMultiplier * 2)
		}
		game.gainSecondMoney(increaseNum,true);
	}

};