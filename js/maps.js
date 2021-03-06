var maps = {
	"playground":{
		"mapImage":"images/playground.png",
		"startingX":36,
		"startingY":4,
		"mapWidth":175,
		"mapHeight":175,
		"mapObstructedTerrain":[
		[18,5], [19,5], [20,5], [21,5], [22,5], [23,5], [24,5], [25,5], [26,5], [27,5], [29,5],
		[18,6], [19,6], [20,6], [21,6], [22,6], [23,6], [24,6], [25,6], [26,6], [27,6], [29,6],
		[18,7], [19,7], [20,7], [21,7], [22,7], [23,7], [24,7], [25,7], [26,7], [27,7], [29,7],
		[18,8], [19,8], [20,8], [21,8], [22,8], [23,8], [24,8], [25,8], [26,8], [27,8], [29,8],
		[18,9], [19,9], [20,9], [21,9], [22,9], [23,9], [24,9], [25,9], [26,9], [27,9], [29,9],
		[18,10], [19,10], [20,10], [21,10], [22,10], [23,10], [24,10], [25,10], [26,10], [27,10], [29,10],
		[18,11], [19,11], [20,11], [21,11], [22,11], [23,11], [24,11], [25,11], [26,11], [27,11], [29,11],
		[18,12], [19,12], [20,12], [21,12], [22,12], [23,12], [24,12], [25,12], [26,12], [27,12], [29,12],
		[18,13], [19,13], [20,13], [21,13], [22,13], [23,13], [24,13], [25,13], [26,13], [27,13], [29,13],
		[14,84], [15,84], [16,84], [17,84], [18,84], [19,84], [20,84], [21,84], [22,84], [23,84], [24,84], [25,84], [26,84], [27,84], [28,84],
		[14,85], [15,85], [16,85], [17,85], [18,85], [19,85], [20,85], [21,85], [22,85], [23,85], [24,85], [25,85], [26,85], [27,85], [28,85],
		[14,86], [15,86], [16,86], [17,86], [18,86], [19,86], [20,86], [21,86], [22,86], [23,86], [24,86], [25,86], [26,86], [27,86], [28,86],
		[14,87], [15,87], [16,87], [17,87], [18,87], [19,87], [20,87], [21,87], [22,87], [23,87], [24,87], [25,87], [26,87], [27,87], [28,87],
		[14,88], [15,88], [16,88], [17,88], [18,88], [19,88], [20,88], [21,88], [22,88], [23,88], [24,88], [25,88], [26,88], [27,88], [28,88],
		[14,89], [15,89], [16,89], [17,89], [18,89], [19,89], [20,89], [21,89], [22,89], [23,89], [24,89], [25,89], [26,89], [27,89], [28,89],
		[14,90], [15,90], [16,90], [17,90], [18,90], [19,90], [20,90], [21,90], [22,90], [23,90], [24,90], [25,90], [26,90], [27,90], [28,90],
		[14,91], [15,91], [16,91], [17,91], [18,91], [19,91], [20,91], [21,91], [22,91], [23,91], [24,91], [25,91], [26,91], [27,91], [28,91],
		[14,92], [15,92], [16,92], [17,92], [18,92], [19,92], [20,92], [21,92], [22,92], [23,92], [24,92], [25,92], [26,92], [27,92], [28,92],
		[15,98], [16,98], [17,98], [18,98], [19,98], [20,98], [21,98], [22,98], [23,98], [24,98], [25,98], [26,98],
		[15,99], [16,99], [17,99], [18,99], [19,99], [20,99], [21,99], [22,99], [23,99], [24,99], [25,99], [26,99],
		[15,100], [16,100], [17,100], [18,100], [19,100], [20,100], [21,100], [22,100], [23,100], [24,100], [25,100], [26,100],
		[15,101], [16,101], [17,101], [18,101], [19,101], [20,101], [21,101], [22,101], [23,101], [24,101], [25,101], [26,101],
		[15,102], [16,102], [17,102], [18,102], [19,102], [20,102], [21,102], [22,102], [23,102], [24,102], [25,102], [26,102],
		[44,64], [45,64], [46,64], [47,64],
		[44,65], [45,65], [46,65], [47,65],
		[44,66], [45,66], [46,66], [47,66],
		[44,67], [45,67], [46,67], [47,67],
		[44,68], [45,68], [46,68], [47,68],
		[44,69], [45,69], [46,69], [47,69],
		[44,70], [45,70], [46,70], [47,70],
		[44,71], [45,71], [46,71], [47,71],
		[44,72], [45,72], [46,72], [47,72],
		[44,73], [45,73], [46,73], [47,73],
		[44,74], [45,74], [46,74], [47,74],
		[44,75], [45,75], [46,75], [47,75],
		[71,108], [72,108], [73,108], [74,108], [75,108], [76,108], [77,108], [78,108], [79,108], [80,108], [81,108], [82,108], [83,108], [84,108], [85,108],
		[71,109], [72,109], [73,109], [74,109], [75,109], [76,109], [77,109], [78,109], [79,109], [80,109], [81,109], [82,109], [83,109], [84,109], [85,109],
		[71,110], [72,110], [73,110], [74,110], [75,110], [76,110], [77,110], [78,110], [79,110], [80,110], [81,110], [82,110], [83,110], [84,110], [85,110],
		[71,111], [72,111], [73,111], [74,111], [75,111], [76,111], [77,111], [78,111], [79,111], [80,111], [81,111], [82,111], [83,111], [84,111], [85,111],
		[71,112], [72,112], [73,112], [74,112], [75,112], [76,112], [77,112], [78,112], [79,112], [80,112], [81,112], [82,112], [83,112], [84,112], [85,112],
		],
		"startingObjects":{
		//Add Starting Objects Here
			"buildings":["hq_america", "hq_coffee", "hq_fusion", "food_truck_america", "food_truck_fusion", "food_truck_coffee", "food_tent_america",
			"food_tent_coffee", "food_tent_fusion",  "food_cart_america", "food_cart_fusion", "food_cart_coffee",
			"garage_america", "garage_coffee", "garage_fusion"],
			"vehicles":["bicycle_america", "bicycle_coffee", "bicycle_fusion"],
			"units":["prep_cook_coffee", "prep_cook_america", "prep_cook_fusion", "specialty_chef_america", "specialty_chef_coffee", "specialty_chef_fusion", "mascot_america", "mascot_coffee",
			"mascot_fusion", "brawler_america", "brawler_coffee", "brawler_fusion", "food_critic_america", "food_critic_coffee", "food_critic_fusion"]
		},
		"player_items":[
			{
				"type": "units",
				"name": "specialty_chef",
				"x":15,
				"y":14,
			},
			{
				"type": "units",
				"name": "specialty_chef",
				"x":20,
				"y":14,
			},
			{
				"type": "buildings",
				"name": "food_truck",
				"x":20,
				"y":20,
			},
			{
				"type": "buildings",
				"name": "hq",
				"x":11,
				"y":9,
			}
		],
		"enemy_items":[
			{
				"type": "vehicles",
				"name": "bicycle",
				"x": 173,
				"y": 154,
			},
			{
				"type": "units",
				"name": "specialty_chef",
				"x":160,
				"y":161,
			},
			{
				"type": "units",
				"name": "specialty_chef",
				"x":155,
				"y":161,
			},
			{
				"type": "buildings",
				"name": "food_truck",
				"x":155,
				"y":155,
			},
			{
				"type": "buildings",
				"name": "hq",
				"x":164,
				"y":166,
			}
		],
		"triggers":{
			"winCondition":{
				"action":function(){
					//game.end();
				},
				"condition":{
					//var enemyStructures = game.getItemByUid();
					//return(!enemyStructures)
				}
			}
		}
	}

}
