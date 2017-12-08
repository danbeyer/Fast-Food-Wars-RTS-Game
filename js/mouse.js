var mouse = {
    // x,y coordinates of mouse relative to top left corner of canvas
    x:0,
    y:0,
    // x,y coordinates of mouse relative to top left corner of game map
    gameX:0,
    gameY:0,
    // game grid x,y coordinates of mouse
    gridX:0,
    gridY:0,
    // whether or not the left mouse button is currently pressed
    buttonPressed:false,
    // whether or not the player is dragging and selecting with the left mouse button pressed
    dragSelect:false,
    // whether or not the mouse is inside the canvas region
    insideCanvas:false,
    insideDrawCanvas:false,
    justDragged:false,
    draggedX:0,
    draggedY:0,
    dragWidth:0,
    dragHeight:0,
    click:function(ev,rightClick){
        var selected = this.isSelected();
        var enemySelected = this.isEnemySelected();
        var deselect = window.event.altKey;

        if(!rightClick) {
            if(mouse.insideDrawCanvas && mouse.isInMiniMap()){
                var maxWidth = (430 - game.canvasWidth/(game.currentLevel.mapWidth * game.gridSize)*130);
                var maxHeight = (140 - game.canvasHeight/(game.currentLevel.mapHeight * game.gridSize)*130);
                var minWidth = (300+game.canvasWidth/2/(game.currentLevel.mapWidth * game.gridSize)*130);
                var minHeight = (10+game.canvasHeight/2/(game.currentLevel.mapHeight*game.gridSize)*130);
                var calcOffsetX = (mouse.drawx-300);
                var calcOffsetY = (mouse.drawy - 10);
                var multiplyGameSize = game.gridSize*game.currentLevel.mapWidth/130;
                game.offsetX = mouse.drawx >= maxWidth?(maxWidth-300)*multiplyGameSize:calcOffsetX*multiplyGameSize-game.canvasWidth/2;
                game.offsetY = mouse.drawy >= maxHeight?(maxHeight-10)*multiplyGameSize:calcOffsetY*multiplyGameSize-game.canvasHeight/2;
                game.offsetX = mouse.drawx <= minWidth?0:game.offsetX;
                game.offsetY = mouse.drawy <= minHeight?0:game.offsetY;
                game.screenMoved = true;
                return;
            }
            if(!deselect)
                game.deselectAll();
            if(selected) {
                game.selectItem(selected,deselect);
            }
            if(enemySelected)
                game.selectEnemy(enemySelected);

            //if food truck is the sole selected item, then enable functionality of sidebar buttons
            if(game.selectedItems.length == 1 && game.selectedItems[0].type == "buildings")//add building code here
            {
              /*if the building is a food truck, then display
                only other buildings to be built*/
              var isFoodTruck = game.selectedItems[0].name.search("food_truck");
              var isHq = game.selectedItems[0].name.search("hq");
              var isGarage = game.selectedItems[0].name.search("garage");
              var isFoodTent = game.selectedItems[0].name.search("food_tent");
              build.disableButtons();
              if(isFoodTruck > -1)
              {
                build.enableBuildingButtons();
                build.expandFoodTruck();
              }
              //for all other buildings, allow the building of units
              else if(isHq > -1)
              {
                build.enableHqButtons();
              }
              else if(isGarage > -1)
              {
                build.enableVehicleButtons();
              }
              else if(isFoodTent > -1){
                build.enableAdvancedUnitButtons();
              }
              else {
                build.disableButtons();
                build.enableFoodCartButtons();
              }
            }
            else {
              build.disableButtons();
            }

        } else {
            var units = [];
			for(var i = 0; i<game.selectedItems.length; i++){
					if(game.selectedItems[i].type != "building" || game.selectedItems[i].name == "food_truck_coffee" || game.selectedItems[i].name == "food_truck_america" || game.selectedItems[i].name == "food_truck_fusion")
                    units.push(game.selectedItems[i]);
            }
            if(enemySelected && enemySelected.type != "projectiles" && units.length>0){
                game.sendAttackCommand(units, enemySelected);
                return;
            }
            if(mouse.insideDrawCanvas && mouse.isInMiniMap() && units.length>0){
                var calcOffsetX = (mouse.drawx-300);
                var calcOffsetY = (mouse.drawy - 10);
                var multiplyGameSize = game.gridSize*game.currentLevel.mapWidth/130;
                game.sendCommands(units,"move",calcOffsetX*multiplyGameSize,calcOffsetY*multiplyGameSize);
                return;
            }
            if(units.length>0){
                game.sendCommands(units,"move",mouse.gameX,mouse.gameY);
            }
		}
    },
    isSelected:function(){
        for (var i = 0; i <= game.items.length - 1; i++) {
            item = game.items[i];
            if(item.isAlive != "false" && item.team == game.team
                    && mouse.gameX <=  item.x*game.gridSize - item.pixelOffsetX + item.pixelWidth
                    && mouse.gameX >=  item.x*game.gridSize - item.pixelOffsetX
                    && mouse.gameY <= item.y*game.gridSize - item.pixelOffsetY + item.pixelHeight
                    && mouse.gameY >= item.y*game.gridSize - item.pixelOffsetY
                    ){
                        return item;
            }
        }

    },
    isEnemySelected:function(){
        for (var i = 0; i <= game.items.length - 1; i++) {
            item = game.items[i];
            if(item.isAlive != "false" && item.team != game.team
                && mouse.gameX <=  item.x*game.gridSize - item.pixelOffsetX + item.pixelWidth
                && mouse.gameX >=  item.x*game.gridSize - item.pixelOffsetX
                && mouse.gameY <= item.y*game.gridSize - item.pixelOffsetY + item.pixelHeight
                && mouse.gameY >= item.y*game.gridSize - item.pixelOffsetY)
                return item;
        }
      },
      isInMiniMap:function(){
        if((mouse.drawx<=430 && mouse.drawx>=300) && (mouse.drawy<=140 && mouse.drawy >= 10))
            return true;
        else
            return false;
      },
    dragSelectItem:function(x,y,width,height){
        for (var i = 0; i <= game.items.length - 1; i++) {
            item = game.items[i];
            var x1 = item.x*game.gridSize - item.pixelOffsetX + item.pixelWidth;
            var x2 = item.x*game.gridSize - item.pixelOffsetX;
            var y1 = item.y*game.gridSize - item.pixelOffsetY + item.pixelHeight;
            var y2 = item.y*game.gridSize - item.pixelOffsetY;
            if(item.isAlive != "false" && item.team == game.team && item.name != "food_truck_america" && item.name != "food_truck_coffee" && item.name != "food_truck_fusion" && item.type != "buildings"
                && x + width >=  x1
                && x <=  x2
                && y + height >= y1
                && y <= y2)
                    game.selectItem(item,false);
        }
    },
    draw:function(){
        if(this.dragSelect){
            ctx = game.foregroundContext;
            this.draggedX = Math.min(this.gameX,this.dragX) - game.offsetX;
            this.draggedY = Math.min(this.gameY,this.dragY) - game.offsetY;
            this.draggedWidth = Math.abs(this.gameX-this.dragX);
            this.draggedHeight = Math.abs(this.gameY-this.dragY);
            ctx.strokeStyle = 'green';
            ctx.lineWidth = '4';
            //ctx.setLineDash([6]);
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = 'rgba(225,225,225,0.5)';
            ctx.fillRect(this.draggedX,this.draggedY, this.draggedWidth, this.draggedHeight)
            game.foregroundContext.strokeRect(this.draggedX,this.draggedY, this.draggedWidth, this.draggedHeight);
            ctx.fillStyle = "#FF0000";
            ctx.globalAlpha = 1.0;
            ctx.lineWidth = '1';
            ctx.strokeStyle = '#000';
            this.justDragged = true;
        }
    },
    calculateGameCoordinates:function(){
        mouse.gameX = mouse.x + game.offsetX;
        mouse.gameY = mouse.y + game.offsetY;
        mouse.gridX = Math.floor((mouse.gameX) / game.gridSize);
        mouse.gridY = Math.floor((mouse.gameY) / game.gridSize);
        return {
            x: mouse.gameX,
            y: mouse.gameY,
			gridx: mouse.gridX,
			gridy: mouse.gridY
        };
    },
    calculateDrawingCoordinates:function(){
        mouse.gameX = mouse.drawx;
        mouse.gameY = mouse.drawy;
        return {
            x: mouse.gameX,
            y: mouse.gameY,
        };
    },
    init:function(){
    var $mouseCanvas = $("#gameforeground");
    $mouseCanvas.mousemove(function(ev) {
        var offset = $mouseCanvas.offset();
        mouse.x = ev.pageX - offset.left;
        mouse.y = ev.pageY - offset.top;
        mouse.calculateGameCoordinates();
        if (mouse.buttonPressed){
            if ((Math.abs(mouse.dragX - mouse.gameX) > 4 || Math.abs(mouse.dragY - mouse.gameY) > 4)){
                mouse.dragSelect = true
            }
        } else {
                mouse.dragSelect = false;
                if(mouse.justDragged){
                    mouse.dragSelectItem(mouse.draggedX + game.offsetX,mouse.draggedY+game.offsetY,mouse.draggedWidth,mouse.draggedHeight);
                    mouse.justDragged = false;
                }
        }
        });
        $mouseCanvas.click(function(ev) {
            mouse.click(ev,false);
            mouse.dragSelect = false;
            return false;
        });
        $mouseCanvas.mousedown(function(ev) {
            if(ev.which == 1){
                mouse.buttonPressed = true;
                mouse.dragX = mouse.gameX;
                mouse.dragY = mouse.gameY;
                ev.preventDefault();
            }
            return false;
        });
        $mouseCanvas.bind('contextmenu',function(ev){
            mouse.click(ev,true);
            return false;
        });
        $mouseCanvas.mouseup(function(ev) {
            var shiftPressed = ev.shiftKey;
            if(ev.which==1){
                //Left key was released
                mouse.buttonPressed = false;
                mouse.dragSelect = false;
            }
            return false;
        });
        $mouseCanvas.mouseleave(function(ev) {
            mouse.insideCanvas = false;
        });
        $mouseCanvas.mouseenter(function(ev) {
            mouse.buttonPressed = false;
            mouse.insideCanvas = true;
        });

    var $mouseDrawing = $("#gameDrawing");
    $mouseDrawing.mousemove(function(ev) {
        var offset = $mouseDrawing.offset();
        mouse.drawx = ev.pageX - offset.left;
        mouse.drawy = ev.pageY - offset.top;
        mouse.calculateDrawingCoordinates();
        });
        $mouseDrawing.click(function(ev) {
            mouse.click(ev,false);
            return false;
        });
        $mouseDrawing.bind('contextmenu',function(ev){
            mouse.click(ev,true);
            return false;
        });
        $mouseDrawing.mouseup(function(ev) {
            var shiftPressed = ev.shiftKey;
            if(ev.which==1){
                //Left key was released
                mouse.buttonPressed = false;
            }
            return false;
        });
        $mouseDrawing.mouseleave(function(ev) {
            mouse.insideDrawCanvas = false;
        });
        $mouseDrawing.mouseenter(function(ev) {
            mouse.buttonPressed = false;
            mouse.insideDrawCanvas = true;
        });
    },
}
