
/* There are many different pathfinding algorithms available.  This example of the Astar algorithm was relatively easy 
** to understand and performs well.  
** Source: http://buildnewgames.com/astar/
** Author:  Christer Kaitila
*/

function findPath(world, pathStart, pathEnd, unitId)
{
	//console.log("worldunpassable =", world[24][7]);
	// shortcuts for speed
	var	abs = Math.abs;
	var	max = Math.max;
	var	pow = Math.pow;
	var	sqrt = Math.sqrt;


	var maxWalkableTileNum = 0;


	var worldWidth = world[0].length;
	var worldHeight = world.length;
	var worldSize =	worldWidth * worldHeight;


	var distanceFunction = EuclideanDistance;
	var findNeighbours = DiagonalNeighbours;


	function ManhattanDistance(Point, Goal)
	{	
		return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
	}

	function DiagonalDistance(Point, Goal)
	{	
		return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
	}

	function EuclideanDistance(Point, Goal)
	{	
		return sqrt(pow(Point.x - Goal.x, 2) + pow(Point.y - Goal.y, 2));
	}


	function Neighbours(x, y)
	{

		var	N = y - 1,		
		S = y + 1,		
		E = x + 1,
		W = x - 1,
		myN = N > -1 && canWalkHere(x, N),
		myS = S < worldHeight && canWalkHere(x, S),
		myE = E < worldWidth && canWalkHere(E, y),
		myW = W > -1 && canWalkHere(W, y),
		result = [];
		if(myN)
		result.push({x:x, y:N});
		if(myE)
		result.push({x:E, y:y});
		if(myS)
		result.push({x:x, y:S});
		if(myW)
		result.push({x:W, y:y});
		findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
		//console.log("MyN, E, S, W =", myN, myE, myS, myW);
		return result;
	}


	function DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result)
	{
		if(myN)
		{
			if(myE && canWalkHere(E, N))
			result.push({x:E, y:N});
			if(myW && canWalkHere(W, N))
			result.push({x:W, y:N});
		}
		if(myS)
		{
			if(myE && canWalkHere(E, S))
			result.push({x:E, y:S});
			if(myW && canWalkHere(W, S))
			result.push({x:W, y:S});
		}
	}

	// returns boolean value (world cell is available and open)
	function canWalkHere(x, y)
	{
		
		var spaceTaken = false;
		var unit;
		for(var i = game.items.length-1; i>=0; i--){
			var item = game.items[i];
			if(item.uid == unitId)
				unit = item;
		}
		for(var i = game.items.length-1; i>=0; i--){
			var item = game.items[i];
			if(item.uid != unitId && item.team == unit.team){
			var xLoc = Math.floor(item.x);
			var xLocplus = xLoc+1;
			var xLocminus = xLoc-1;
			var yLoc = Math.floor(item.y);
			var yLocplus = yLoc+1;
			var yLocminus = yLoc-1;
			//console.log("xloc, yloc:", xLoc, yLoc);
			if((xLoc == x && yLoc == y) || (x == xLocplus && y == yLocplus) || (x == xLocminus && y == yLocminus) ||
			(x == xLocplus && y == yLocminus) || (x == xLocminus && y == yLocplus) || (x == xLoc && y == yLocminus) ||
			(x == xLoc && y == yLocplus) || (y == yLoc && x == xLocplus) || (y == yLoc && x == xLocminus)){
				spaceTaken = true;
			}
			}
		}
		
		return ((world[x] != null) &&
			(world[x][y] != null) &&
			(world[x][y] <= maxWalkableTileNum) &&
			(spaceTaken != true));

	};


	function Node(Parent, Point)
	{
		var newNode = {
			// pointer to another Node object
			Parent:Parent,
			// array index of this Node in the world linear array
			value:Point.x + (Point.y * worldWidth),
			// the location coordinates of this Node
			x:Point.x,
			y:Point.y,
			// the heuristic estimated cost
			// of an entire path using this node
			f:0,
			// the distanceFunction cost to get
			// from the starting point to this node
			g:0
		};

		return newNode;
	}

	// Path function, executes AStar algorithm operations
	function calculatePath()
	{
		// create Nodes from the Start and End x,y coordinates
		var	mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
		//console.log("mypathStart =", mypathStart);

		var mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
		//console.log("mypathend =", mypathEnd);
		// create an array that will contain all world cells
		var AStar = new Array(worldSize);
		// list of currently open Nodes
		var Open = [mypathStart];
		// list of closed Nodes
		var Closed = [];
		// list of the final output array
		var result = [];
		// reference to a Node (that is nearby)
		var myNeighbours;
		// reference to a Node (that we are considering now)
		var myNode;
		// reference to a Node (that starts a path in question)
		var myPath;
		// temp integer variables used in the calculations
		var length, max, min, i, j;
		// iterate through the open list until none are left
		while(length = Open.length)
		{
			max = worldSize;
			min = -1;
			for(i = 0; i < length; i++)
			{
				if(Open[i].f < max)
				{
					max = Open[i].f;
					min = i;
				}
			}
			// grab the next node and remove it from Open array
			myNode = Open.splice(min, 1)[0];
			// is it the destination node?
			if(myNode.value === mypathEnd.value)
			{
				myPath = Closed[Closed.push(myNode) - 1];
				do
				{
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				// clear the working arrays
				AStar = Closed = Open = [];
				// we want to return start to finish
				result.reverse();
			}
			else // not the destination
			{

				myNeighbours = Neighbours(myNode.x, myNode.y);
				// test each one that hasn't been tried already
				for(i = 0, j = myNeighbours.length; i < j; i++)
				{
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value])
					{
						// estimated cost of this particular route so far
						myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
						// estimated cost of entire guessed route to the destination
						myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
						// remember this new path for testing above
						Open.push(myPath);
						// mark this node in the world graph as visited
						AStar[myPath.value] = true;
					}
				}
				
				Closed.push(myNode);
			}
		} 
		return result;
	}

	return calculatePath();

}