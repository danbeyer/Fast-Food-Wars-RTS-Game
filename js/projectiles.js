var projectiles = {
	list:{
		"coffee_projectile":{
			name:"coffee_projectile",
			speed: 50,
			range: 20,
			damage: 15,
			projInterval: 25,
		  pixelWidth:32,
	    pixelHeight:32,
	    pixelOffsetX:0,
		  pixelSheetOffsetX:0,
	    pixelOffsetY:0,
		  pixelSheetOffsetY:0,
		},
		"croissant_projectile":{
			name:"croissant_projectile",
			speed:40,
			range:20,
			damage:11,
			projInterval: 10,
		  pixelWidth:32,
	    pixelHeight:32,
	    pixelOffsetX:0,
		  pixelSheetOffsetX:32,
	    pixelOffsetY:0,
		  pixelSheetOffsetY:0,
		},
		"donut_projectile":{
			name:"donut_projectile",
			speed:25,
			range:12,
			damage:15,
			projInterval: 10,
		  pixelWidth:32,
	    pixelHeight:32,
	    pixelOffsetX:0,
		  pixelSheetOffsetX:64,
	    pixelOffsetY:0,
		  pixelSheetOffsetY:0,
		},
		"hamburger_projectile":{
			name:"hamburger_projectile",
			speed:30,
			range:10,
			damage:30,
			projInterval: 10,
		  pixelWidth:32,
	    pixelHeight:32,
	    pixelOffsetX:0,
		  pixelSheetOffsetX:96,
	    pixelOffsetY:0,
		  pixelSheetOffsetY:0,
		},
		"samosa_projectile":{
			name:"samosa_projectile",
			speed:45,
			range:15,
			damage:14,
			projInterval: 20,
		  pixelWidth:32,
	    pixelHeight:32,
	    pixelOffsetX:0,
		  pixelSheetOffsetX:128,
	    pixelOffsetY:0,
		  pixelSheetOffsetY:0,
		},
		"takeout_projectile":{
			name:"takeout_projectile",
			speed:20,
			range:8,
			damage:40,
			projInterval: 20,
		  pixelWidth:32,
	    pixelHeight:32,
	    pixelOffsetX:0,
		  pixelSheetOffsetX:160,
	    pixelOffsetY:0,
		  pixelSheetOffsetY:0,
		},
	},
	defaults:{
		type:"projectiles",
		distance:0,
		selected:false,
		selectable:false,
		orders:"fire",
		animate:function(){
		},
		draw:function(){
			/*from what i can see in the debugger, it appears to be loading
			hamburger projectile object, but it's missing key values that are
			defined above for pixeloffsetY and pixeloffsetX. I'm not sure
			why it doesn't have the additional fields for hamburger_projectile
			but that's currently why it's breaking now.

			Also it's very annoying in Atom that it attempts auto fill anything
			when it knows you're typing in a comment block
			*/
  		var x = (this.x*game.gridSize)-game.offsetX-this.pixelOffsetX;
  		var y = (this.y*game.gridSize)-game.offsetY-this.pixelOffsetY;
		game.foregroundContext.drawImage(this.spriteSheet, this.pixelSheetOffsetX, this.pixelSheetOffsetY, this.pixelWidth, this.pixelHeight, x, y, 32, 32);
  		//The above produces an error without the 32x32, which is the scaling of the image.  It drawImage requires 3,5 or 9 arguments, so needed something there.
		},
		processCommand:function(command,x,y){
			this.to = {
			toX: x,
			toY: y
			}
		this.currentX = game.offsetX;
		this.currentY = game.offsetY;
		this.orders = command;
		},
		processOrders:function(){
			this.movedX = 0;
			this.movedY = 0;
			var target;
			for(item in game.sortedItems) {
				if(game.sortedItems[item].uid == this.target)
					target = game.sortedItems[item];
			}
			var realX = (this.x*game.gridSize - this.pixelOffsetX+15);
			var realY = (this.y*game.gridSize - this.pixelOffsetY+15);
			switch(this.orders){
				case "fire":
				if(!target){
					this.clearOrders();
					game.remove(this);
					return;
				}
					var reachedTarget = false;
					if(this.distance>this.range){
						game.remove(this);
					}
			else {
				this.moveTo(target.x, target.y, realX, realY);
				}
			break;
			}
		},
		moveTo:function(destX,destY,reX,reY){
			//console.log("destx, desty, rex, rey", destX, destY, reX, reY);
			//destX = Math.floor(destX/game.gridSize);
			//destY = Math.floor(destY/game.gridSize);
			reX = Math.floor(reX/game.gridSize);
			reY = Math.floor(reY/game.gridSize);
			angle = findAngle(reX,reY,destX,destY);
			var target;
			for(item in game.sortedItems) {
				if(game.sortedItems[item].uid == this.target)
					target = game.sortedItems[item];
			}
			this.movedX = (Math.cos(angle) * this.speed/64);
			this.movedY = (Math.sin(angle) * this.speed/64);
			this.x -= this.movedX;
			this.y -= this.movedY;
			var distance = Math.pow(destX - reX,2) + Math.pow(destY - reY,2);
			if(!target.isAlive)
				game.remove(this);
			if(distance < 1){
				for(item in game.items)
					if(target != undefined && game.sortedItems[item].uid == target.uid){
						//account for power ups and boosters on vehicles and units
						//by applying them to the projectiles
						//object that is created in processCommand when dealing with attack.
						var hitPoints;
						if (game.sortedItems[item].type == "units" || game.sortedItems[item].type == "vehicles"){
							hitPoints = this.damage - game.sortedItems[item].addDef();
						}
						else hitPoints = this.damage;


						game.sortedItems[item].health-=hitPoints;
						//change sprite sheet if unit becomes damaged
						//build.updateSprite(game.sortedItems[item]);
						theItem = game.sortedItems[item];
					}
				if(theItem.health <= 0){
					target.isAlive = false;
					game.remove(target);
				}
				//console.log("targetlife:", this.target.life);
				game.remove(this);
			}
			this.distance +=this.speed/64;

		},
		clearOrders:function(){
		this.orders = "none";
		},
		},
		load:loadItem, //framework sourced from Mr Shankar's Pro HTML5 Games
		add:addItem,
		}
