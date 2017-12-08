var vehicles = {
  list:{
    "bicycle_america":{
      name:"bicycle_america",
      health:200,
      cost:400,
      vision:3,
      speed:75,
      projectile:"donut_projectile",
		  pixelWidth:32,
	    pixelHeight:32,
	    pixelOffsetX:0,
		  pixelSheetOffsetX:64,
	    pixelOffsetY:0,
		  pixelSheetOffsetY:0,
      isAlive:true,
      sight:6,
      maxHealth:200,
      attack:14,
      defense:10,
      defenseLevel:0,
      attackLevel:0,
      visionLevel:0,
      speedLevel:0,
      supply:1,
    },
    "bicycle_coffee":{
      name:"bicycle_coffee",
      health:600,
      cost:600,
      vision:3,
      speed:75,
      projectile:"coffee_projectile",
	  	pixelWidth:32,
	    pixelHeight:32,
	    pixelOffsetX:0,
		  pixelSheetOffsetX:160,
	    pixelOffsetY:0,
		  pixelSheetOffsetY:0,
      isAlive:true,
      sight:6,
      maxHealth:600,
      attack:15,
      defense:10,
      defenseLevel:0,
      attackLevel:0,
      visionLevel:0,
      speedLevel:0,
      supply:1,
    },
    "bicycle_fusion":{
      name:"bicycle_fusion",
      health:200,
      cost:400,
      vision:3,
      speed:75,
      projectile:"takeout_projectile",
	  	pixelWidth:32,
	    pixelHeight:32,
	    pixelOffsetX:0,
		  pixelSheetOffsetX:256,
	    pixelOffsetY:0,
		  pixelSheetOffsetY:0,
      isAlive:true,
      sight:6,
      maxHealth:200,
      attack:40,
      defense:10,
      defenseLevel:0,
      attackLevel:0,
      visionLevel:0,
      speedLevel:0,
      supply:1,
    },
  },
  defaults:{
  type:"vehicles",
	reachedDestination:true,
	selected:false,
  selectable:true,
  moveCounter:0,
  orders:"idle",
  animate:function(){
  	},
	findTargets:findTargets,
	canTarget:canTarget,
  addAtt:addAttack,
  addDef:addDefense,
  addSpd:addSpeed,
  addRng:addRange,
    draw:function(){
      if(this.team != game.enemyTeam){
      ctx = game.drawingContext;
      ctx.fillStyle = "rgb("+0+","+0+","+255+")";
      ctx.fillRect( this.x/175*130 + 300, this.y/175*130 + 10, 2, 2 );
      ctx.fillStyle = "#FF0000";
      }
      else {
      ctx = game.drawingContext;
      ctx.fillStyle = "rgb("+255+","+0+","+0+")";
      ctx.fillRect( this.x/175*130 + 300, this.y/175*130 + 10, 2, 2 );
      ctx.fillStyle = "#FF0000";
      }

      var x = (this.x*game.gridSize)-game.offsetX-this.pixelOffsetX;
      var y = (this.y*game.gridSize)-game.offsetY-this.pixelOffsetY;
      this.selectX = x;
      this.selectY = y;
      this.drawSelectX = this.x*game.gridSize + this.pixelWidth/2;
      this.drawSelectY = this.y*game.gridSize + this.pixelHeight/2;
      if(this.selected || this.enemySelected) {
        this.drawSelected();
      }
      this.drawHealth();
      game.foregroundContext.drawImage(this.spriteSheet, this.pixelSheetOffsetX, this.pixelSheetOffsetY, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight);
      //The above produces an error without the 32x32, which is the scaling of the image.  It drawImage requires 3,5 or 9 arguments, so needed something there.
    },
    drawSelected:function(){
        var x = this.drawSelectX - game.offsetX;
        var y = this.drawSelectY - game.offsetY;
        game.foregroundContext.strokeStyle = "white";
        game.foregroundContext.linewidth = 1;
        game.foregroundContext.beginPath();
        game.foregroundContext.arc(x,y,this.pixelWidth/2,0,Math.PI*2);
        game.foregroundContext.stroke();
        game.lineWidth = '1';
        game.strokeStyle = '#000';
    },
        drawHealth:function(){
      var x = this.selectX;
      var y = this.selectY - 5;
      game.foregroundContext.fillStyle = this.findColor();
      game.foregroundContext.fillRect(x,y,Math.floor(this.pixelWidth * this.health / this.maxHealth),5);
      game.foregroundContext.strokeStyle = "white";
      game.foregroundContext.linewidth = 1;
      game.foregroundContext.strokeRect(x,y,this.pixelWidth,5);
      game.foregroundContext.fillStyle = "#FF0000";
      game.foregroundContext.strokeStyle = '#000';

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
	processAttackCommand(target){
		this.target = target;
		this.orders = "attack";
		//console.log("target", this.target);
	},
    processOrders:function(){
    //move distance declaration to the top to fix projectile bug
    var distance;
    var units=[];
    this.movedX = 0;
    this.movedY = 0;
    var realX = (this.x*game.gridSize - this.pixelOffsetX+15);
    var realY = (this.y*game.gridSize - this.pixelOffsetY+15);
	  if(this.shotInterval){
		this.shotInterval--;
	  }
    switch(this.orders){
      case "move":
        for(item in game.sortedItems){
          if(game.sortedItems[item].team != this.team && game.sortedItems[item].type != "projectiles") {
            distance = Math.pow(game.sortedItems[item].x - this.x,2) + Math.pow(game.sortedItems[item].y - this.y,2);
            if(distance<Math.pow(this.addRng(),2)){
              units.push(this);
              game.sendAttackCommand(units, game.sortedItems[item]);
            }
          }
        }
        distance = Math.pow(this.to.toX - realX,2) + Math.pow(this.to.toY - realY,2);
        inRadius = Math.pow(this.pixelHeight/2,2);//+Math.pow(this.pixelWidth/2,2);
        if(distance > inRadius ) {
          this.moveTo(this.to.toX, this.to.toY,realX,realY);
        }
        else {
			this.moveCounter++;
			this.clearOrders();
		    }
        break;
		case "attack":
		var target;
			for(item in game.sortedItems) {
				if(game.sortedItems[item].uid == this.target)
					target = game.sortedItems[item];
			}
      if(!target.isAlive){
        this.clearOrders();
        return
      }
			distance = Math.pow(target.x - this.x,2) + Math.pow(target.y - this.y,2);
			if(distance < Math.pow(this.addRng(),2)){
				if(!this.shotInterval){
					var firingInterval = projectiles.list[this.projectile].projInterval;
					this.shotInterval = firingInterval;
					var projectilex = this.x;
					var projectiley = this.y;
					var projectile = game.add({name:this.projectile,type:"projectiles",x:projectilex,y:projectiley,target:target.uid}, game.team, this);

				}
			}
			else{
				this.moveTo(target.x*game.gridSize, target.y*game.gridSize, this.x*game.gridSize, this.y*game.gridSize);
			}
			break;
      case "idle":
      for(item in game.sortedItems){
        if(game.sortedItems[item].team != this.team && game.sortedItems[item].type != "projectiles") {
          distance = Math.pow(game.sortedItems[item].x - this.x,2) + Math.pow(game.sortedItems[item].y - this.y,2);
          if(distance<Math.pow(this.addRng(),2)){
            units.push(this);
            game.sendAttackCommand(units, game.sortedItems[item]);
          }
        }
        }
        break;
    }
  },
  moveTo:function(destX,destY,reX,reY){
	destX = Math.floor(destX/game.gridSize);
	destY = Math.floor(destY/game.gridSize);
	reX = Math.floor(reX/game.gridSize);
	reY = Math.floor(reY/game.gridSize);

	var start = [reX, reY];
	var dest = [destX, destY];
	var grid = game.currentMapGrid;
	  //The path variable below contains the result of the Astar algorithm and it creates a successful path.
	path = findPath(grid, start, dest, this.uid);
	if(path.length>1){
		  destX = path[1][0];
		  destY = path[1][1];
	angle = findAngle(reX,reY,destX,destY);
    this.movedX = (Math.cos(angle) * this.addSpd()/64);
    this.movedY = (Math.sin(angle) * this.addSpd()/64);
    this.x -= this.movedX;
    this.y -= this.movedY;
	  }
	  else {
		  this.clearOrders();
	  }
  },
  clearOrders:function(){
    this.orders = "idle";
  },
  findColor:function(){
    if(this.health / this.maxHealth >= .75)
      return "green";
    else if(this.health / this.maxHealth < .75 && this.health / this.maxHealth >= .5)
      return "yellow";
    else
      return "red";
  },
 },
  load:loadItem, //framework sourced from Mr Shankar's Pro HTML5 Games
  add:addItem,


}
