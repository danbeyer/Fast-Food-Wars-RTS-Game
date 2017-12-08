var fog = {
    grid:[],
    canvas:document.createElement('canvas'),
    initLevel:function(){
        // Set fog canvas to the size of the map
        this.canvas.width = game.currentLevel.mapWidth*game.gridSize;
        this.canvas.height = game.currentLevel.mapHeight*game.gridSize;
        this.context = this.canvas.getContext('2d');        


        // Set the fog grid for the player to array with all values set to 1
        this.defaultFogGrid = [];
        for (var i=0; i < game.currentLevel.mapHeight; i++) {
           this.defaultFogGrid[i] = [];
           for (var j=0; j < game.currentLevel.mapWidth; j++) {
               this.defaultFogGrid[i][j] = 1;
           };
        };

    },
    animate:function(){
        var ctx = this.context;
        // Fill fog with random color over the map
        ctx.drawImage(game.currentMapImage,0,0)
        ctx.fillStyle = getRndImage(ctx); 
        ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        ctx.fillStyle = "#FF0000";
        
        // Initialize fog grid for the team
        this.grid[game.team] = $.extend(true,[],this.defaultFogGrid);
        
        // Add vision for team
        fog.context.globalCompositeOperation = "destination-out";
        for (var i = game.items.length - 1; i >= 0; i--){        
            var item = game.items[i];
            var team = game.team;        
                if (item.team == team){
                    var x = Math.floor(item.x - item.pixelOffsetX/game.gridSize);
                    var y = Math.floor(item.y - item.pixelOffsetY/game.gridSize);
                      var x0 = Math.max(0,x-item.sight+1);
                      var y0 = Math.max(0,y-item.sight+1);
                      var x1 = Math.min(game.currentLevel.mapWidth-1, x+item.sight);
                      var y1 = Math.min(game.currentLevel.mapHeight-1, y+item.sight);
                    for (var j=x0; j <= x1; j++) {
                        for (var k=y0; k <= y1; k++) {
                            if ((j>x0 && j<x1) || (k>y0 && k<y1)){
                                if(this.grid[team][k][j]){                                     
                                    ctx.fillStyle = getRndColor(.9); 
                                    ctx.beginPath();                                    
                                    ctx.arc(j*game.gridSize+12, k*game.gridSize+12, 16, 0, 2*Math.PI, false);    
                                    ctx.fill();
                                    ctx.fillStyle = "#FF0000";
                                    ctx.fillStyle = getRndColor(.7); 
                                    ctx.beginPath();                                                                               
                                    ctx.arc(j*game.gridSize+12, k*game.gridSize+12,18, 0, 2*Math.PI, false);    
                                    ctx.fill();
                                    ctx.fillStyle = "#FF0000";
                                    ctx.fillStyle = getRndColor(.5); 
                                    ctx.beginPath();                                    
                                    ctx.arc(j*game.gridSize+12, k*game.gridSize+12, 24, 0, 2*Math.PI, false);    
                                    ctx.fill();
                                    ctx.fillStyle = "#FF0000";
                                }
                                this.grid[team][k][j] = 0;                               
                          }
                     };
                 };
             }
        };
        fog.context.globalCompositeOperation = "source-over";
    },
    draw:function(){
        game.foregroundContext.drawImage(this.canvas,game.offsetX, game.offsetY, game.canvasWidth, game.canvasHeight, 0,0,game.canvasWidth,game.canvasHeight);
        game.drawingContext.drawImage(this.canvas,0, 0, this.canvas.width, this.canvas.height, 300,10,130,130);
    },
}
