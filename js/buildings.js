var buildings = {
  list:{
    "hq_america":{
      name:"hq_america",
      health:6000,
      cost:-1,
      vision:5,
      speed:0,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		pixelOffsetX:0,
	    pixelSheetOffsetX:64,
		pixelSheetOffsetY:896,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:6000
    },
    "hq_coffee":{
      name:"hq_coffee",
      health:6000,
      cost:-1,
      vision:5,
      speed:0,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		pixelOffsetX:0,
	    pixelSheetOffsetX:0,
		pixelSheetOffsetY:1024,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:6000
    },
    "hq_fusion":{
      name:"hq_fusion",
      health:6000,
      cost:-1,
      vision:5,
      speed:0,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:64,
		  pixelSheetOffsetY:1088,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:6000
    },
    "food_truck_america":{
      name:"food_truck_america",
      health:1000,
      cost:10000,
      vision:5,
      speed:50,
      capacity:12,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:0,
		  pixelSheetOffsetY:256,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      numWorkers:0,
      hasOutpost:false,
      maxHealth:1000,
      supply:0,
	  reachedDestination:true,
      addWorker:function(enemy){
        //human food truck request
        if(enemy == undefined){
          if (game.food + 1 > game.currentSupply)
          {
            game.addMessage("That supply budget ain't gonna do it, baby.");
            return;
          }
          else if (this.numWorkers + 1 > this.capacity) {
            game.addMessage("Truck's full, boo.");
            return;
          }
		  else if(game.money<500) {
			  return;
		  }
		  game.money-=500;
          game.food++;
          this.supply++;
          this.numWorkers++;
        }
        //do the robit's bidding
        else {
          if (1 + game.enemyFood > game.enemyCurrentSupply)
          {
            //game.addMessage("That supply budget ain't gonna do it, baby.");
            return;
          }
          else if (this.supply + 1 > this.capacity) {
            return -1;
          }
		  else if(game.enemyMoney<500) {
			  return;
		  }
		  game.enemyMoney-=500;
          game.enemyFood++;
          this.supply++;
          this.numWorkers++;
        }
      },
      checkForOutposts:function(){
        var flag = false;
        for (item in game.items) {
          item = game.items[item];
          if(item.team == this.team){
            if(Math.pow((item.x - this.x),2) + Math.pow((item.y-this.y),2) <= 32 && item.type == "buildings")
              flag = true;
            if(flag == true &&
              item.hasTruck == -1 &&
              item.name != "hq_america" &&
			  item.name != "hq_coffee" &&
			  item.name != "hq_fusion" &&
              item.name != "food_truck_america" &&
              item.name != "food_truck_coffee" &&
              item.name != "food_truck_fusion" &&
              this.hasOutpost == false) {
                item.hasTruck = this.uid;
                this.hasOutpost = true;
              }
            if(flag == false &&
              this.hasOutpost == true
              && item.hasTruck == this.uid){
                item.hasTruck = -1;
                this.hasOutpost = false;
              }
            flag = false;
          }
        }
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
      var realX = (this.x*game.gridSize - this.pixelOffsetX+15);
      var realY = (this.y*game.gridSize - this.pixelOffsetY+15);
      switch(this.orders){
        case "move":
          var distance = Math.pow(this.to.toX - realX,2) + Math.pow(this.to.toY - realY,2);
          inRadius = Math.pow(this.pixelHeight/2,2);//+Math.pow(this.pixelWidth/2,2);
          if(distance > inRadius ) {
			  this.reachedDestination = false;
            this.moveTo(this.to.toX, this.to.toY,realX,realY);
          }
          else {
			  this.reachedDestination = true;
      this.clearOrders();
            //add code to search for/attack enemies
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
      this.movedX = (Math.cos(angle) * this.speed/64);
      this.movedY = (Math.sin(angle) * this.speed/64);
      this.x -= this.movedX;
      this.y -= this.movedY;
      }
      else {
        this.clearOrders();
      }
      this.checkForOutposts();
    },
    clearOrders:function(){
      this.orders = "none";
    },
  },
  "food_truck_coffee":{
    name:"food_truck_coffee",
    health:1000,
    cost:10000,
    vision:5,
    speed:50,
    capacity:12,
    pixelWidth:64,
    pixelHeight:64,
  pixelOffsetX:0,
    pixelSheetOffsetX:64,
  pixelSheetOffsetY:512,
    pixelOffsetY:0,
    isAlive:true,
    sight:5,
    numWorkers:0,
    hasOutpost:false,
    maxHealth:1000,
    supply:0,
	reachedDestination:true,
    addWorker:function(enemy){
        //human food truck request
        if(enemy == undefined){
          if (game.food + 1 > game.currentSupply)
          {
            game.addMessage("That supply budget ain't gonna do it, baby.");
            return;
          }
          else if (this.numWorkers + 1 > this.capacity) {
            game.addMessage("Truck's full, boo.");
            return;
          }
		  else if(game.money<500) {
			  return;
		  }
		  game.money-=500;
          game.food++;
          this.supply++;
          this.numWorkers++;
        }
        //do the robit's bidding
        else {
          if (1 + game.enemyFood > game.enemyCurrentSupply)
          {
            //game.addMessage("That supply budget ain't gonna do it, baby.");
            return;
          }
          else if (this.supply + 1 > this.capacity) {
            return -1;
          }
		  else if(game.enemyMoney<500) {
			  return;
		  }
		  game.enemyMoney-=500;
          game.enemyFood++;
          this.supply++;
          this.numWorkers++;
        }
      },
    checkForOutposts:function(){
      var flag = false;
        for (item in game.items) {
          item = game.items[item];
          if(item.team == this.team){
            if(Math.pow((item.x - this.x),2) + Math.pow((item.y-this.y),2) <= 32 && item.type == "buildings")
              flag = true;
            if(flag == true &&
              item.hasTruck == -1 &&
              item.name != "hq_america" &&
			  item.name != "hq_coffee" &&
			  item.name != "hq_fusion" &&
              item.name != "food_truck_america" &&
              item.name != "food_truck_coffee" &&
              item.name != "food_truck_fusion" &&
              this.hasOutpost == false) {
                item.hasTruck = this.uid;
                this.hasOutpost = true;
              }
            if(flag == false &&
              this.hasOutpost == true
              && item.hasTruck == this.uid){
                item.hasTruck = -1;
                this.hasOutpost = false;
              }
            flag = false;
          }
        }
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
    var realX = (this.x*game.gridSize - this.pixelOffsetX+15);
    var realY = (this.y*game.gridSize - this.pixelOffsetY+15);
    switch(this.orders){
      case "move":
        var distance = Math.pow(this.to.toX - realX,2) + Math.pow(this.to.toY - realY,2);
        inRadius = Math.pow(this.pixelHeight/2,2);//+Math.pow(this.pixelWidth/2,2);
        if(distance > inRadius ) {
			this.reachedDestination = false;
          this.moveTo(this.to.toX, this.to.toY,realX,realY);
        }
        else {
			this.reachedDestination = true;
    this.clearOrders();
          //add code to search for/attack enemies
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
      this.movedX = (Math.cos(angle) * this.speed/64);
      this.movedY = (Math.sin(angle) * this.speed/64);
      this.x -= this.movedX;
      this.y -= this.movedY;
      }
      else {
        this.clearOrders();
      }
      this.checkForOutposts();
    },
    clearOrders:function(){
      this.orders = "none";
    },
  },
  "food_truck_fusion":{
    name:"food_truck_fusion",
    health:1000,
    cost:10000,
    vision:5,
    speed:50,
    capacity:12,
    pixelWidth:64,
    pixelHeight:64,
  pixelOffsetX:0,
    pixelSheetOffsetX:0,
  pixelSheetOffsetY:832,
    pixelOffsetY:0,
    isAlive:true,
    sight:5,
    numWorkers:0,
    hasOutpost:false,
    maxHealth:1000,
    supply:0,
	reachedDestination:false,
    addWorker:function(enemy){
        //human food truck request
        if(enemy == undefined){
          if (game.food + 1 > game.currentSupply)
          {
            game.addMessage("That supply budget ain't gonna do it, baby.");
            return;
          }
          else if (this.numWorkers + 1 > this.capacity) {
            game.addMessage("Truck's full, boo.");
            return;
          }
		  else if(game.money<500) {
			  return;
		  }
		  game.money-=500;
          game.food++;
          this.supply++;
          this.numWorkers++;
        }
        //do the robit's bidding
        else {
          if (1 + game.enemyFood > game.enemyCurrentSupply)
          {
            //game.addMessage("That supply budget ain't gonna do it, baby.");
            return;
          }
          else if (this.supply + 1 > this.capacity) {
            return -1;
          }
		  else if(game.enemyMoney<500) {
			  return;
		  }
		  game.enemyMoney-=500;
          game.enemyFood++;
          this.supply++;
          this.numWorkers++;
        }
      },
    checkForOutposts:function(){
      var flag = false;
        for (item in game.items) {
          item = game.items[item];
          if(item.team == this.team){
            if(Math.pow((item.x - this.x),2) + Math.pow((item.y-this.y),2) <= 32 && item.type == "buildings")
              flag = true;
            if(flag == true &&
              item.hasTruck == -1 &&
              item.name != "hq_america" &&
			  item.name != "hq_coffee" &&
			  item.name != "hq_fusion" &&
              item.name != "food_truck_america" &&
              item.name != "food_truck_coffee" &&
              item.name != "food_truck_fusion" &&
              this.hasOutpost == false) {
                item.hasTruck = this.uid;
                this.hasOutpost = true;
              }
            if(flag == false &&
              this.hasOutpost == true
              && item.hasTruck == this.uid){
                item.hasTruck = -1;
                this.hasOutpost = false;
              }
            flag = false;
          }
        }
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
    var realX = (this.x*game.gridSize - this.pixelOffsetX+15);
    var realY = (this.y*game.gridSize - this.pixelOffsetY+15);
    switch(this.orders){
      case "move":
        var distance = Math.pow(this.to.toX - realX,2) + Math.pow(this.to.toY - realY,2);
        inRadius = Math.pow(this.pixelHeight/2,2);//+Math.pow(this.pixelWidth/2,2);
        if(distance > inRadius ) {
			this.reachedDestination = false;
          this.moveTo(this.to.toX, this.to.toY,realX,realY);
        }
        else {
			this.reachedDestination = true;
    this.clearOrders();
          //add code to search for/attack enemies
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
    this.movedX = (Math.cos(angle) * this.speed/64);
    this.movedY = (Math.sin(angle) * this.speed/64);
    this.x -= this.movedX;
    this.y -= this.movedY;
    }
    else {
      this.clearOrders();
    }
    this.checkForOutposts();
  },
  clearOrders:function(){
    this.orders = "none";
  },
},
    "food_tent_america":{
      name:"food_tent_america",
      health:4000,
      cost:4000,
      vision:3,
      speed:0,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:64,
		  pixelSheetOffsetY:64,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:4000
    },
    "food_tent_coffee":{
      name:"food_tent_coffee",
      health:4000,
      cost:4000,
      vision:3,
      speed:0,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:0,
		  pixelSheetOffsetY:384,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:4000
    },
    "food_tent_fusion":{
      name:"food_tent_fusion",
      health:4000,
      cost:4000,
      vision:3,
      speed:0,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:64,
		  pixelSheetOffsetY:640,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:4000
    },
    "food_cart_america":{
      name:"food_cart_america",
      health:2000,
      cost:1200,
      vision:4,
      speed:40,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:0,
		  pixelSheetOffsetY:64,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:2000
    },
    "food_cart_coffee":{
      name:"food_cart_coffee",
      health:2000,
      cost:1200,
      vision:4,
      speed:40,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:64,
		  pixelSheetOffsetY:256,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:2000
    },
    "food_cart_fusion":{
      name:"food_cart_fusion",
      health:2000,
      cost:1200,
      vision:4,
      speed:40,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:0,
		  pixelSheetOffsetY:640,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:2000
    },
    "garage_america":{
      name:"garage_america",
      health:6000,
      cost:6000,
      vision:3,
      speed:0,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:0,
		  pixelSheetOffsetY:1216,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:6000
    },
    "garage_coffee":{
      name:"garage_coffee",
      health:6000,
      cost:6000,
      vision:3,
      speed:0,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:0,
		  pixelSheetOffsetY:1216,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:6000
    },
    "garage_fusion":{
      name:"garage_fusion",
      health:6000,
      cost:6000,
      vision:3,
      speed:0,
      capacity:0,
      pixelWidth:64,
	    pixelHeight:64,
		  pixelOffsetX:0,
	    pixelSheetOffsetX:0,
		  pixelSheetOffsetY:1216,
	    pixelOffsetY:0,
      isAlive:true,
      sight:5,
      maxHealth:6000
    },
  },
  defaults:{
    type:"buildings",
    selected:false,
    selectable:true,
    hasTruck:-1,
    animate:function(){

    },
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

    },
    addDistanceMult:function(){
      if(this.team == game.team)
        this.distanceMultiplier = 2 * ( Math.pow(this.x/10,2) + Math.pow(this.y/10,2));
      else
        this.distanceMultiplier = 2 * ( Math.pow((175 - this.x)/10,2) + Math.pow((175 - this.y)/10,2)); //175 is map width/height
    },
    findColor:function(){
    if(this.health / this.maxHealth >= .75)
      return "green";
    else if(this.health / this.maxHealth < .75 && this.health / this.maxHealth >= .5)
      return "yellow";
    else
      return "red";
  }
  },
  load:loadItem, //framework sourced from Mr Shankar's Pro HTML5 Games
  add:addItem
}
