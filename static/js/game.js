//get screen sizes and ratio
var x = window.innerWidth,
    y = window.innerHeight,
    ratio = x / y,
    spritePath = "../assets/img/";

//enemy and bonus spawn declarations
var maxEnemy = 100;
var spawnInterval = 5000;
var difficultyRate = 10000;
var difficultyMod = 1;
var startingTime = Date.now();
var enemyTypeList = ["Enemy"]; //["Enemy1", "Enemy2", "Enemy3"];
var bonusTypeList = ["Tree"]; //["Bonus1", "Bonus2"];
var TreeTypes = [1,2,3];//["Id1", "Id2", "Id3"];
var EnemyTypes = [1,2];
var TreeSheets = ["microcitysheet", "microcitysheet", "microcitysheet"];
var TreeTextures = ["tile512.png", "tile516.png", "tile517.png"];
var EnemySheets = ["microcharactersheet","microcharactersheet"];
var EnemyTextures = ["tile055.png","tile109.png"];
var EnemyNextId = 0;

// camera parameters
var cameraBounds = {
	x : -3840,
	y : -2160,
	width : 7680,
	height : 4320
};

var containerBounds = {
	x : 0,
	y : 0,
	width : 0,
	height : 0
}

//global spritesheet declarations
var microcoloredsheet,
    microbasic0sheet,
    microbasic1sheet,
    microcavesheet,
    microcharactersheet,
    microcitysheet,
    microindoorsheet,
    micromonochromesheet,
    gameContainer,
    player,
    sickP,
    timer,
    bg,
    killSymbol,
    killText,
    radarTexture,
    bulletList = [],
    enemyList = [],
    treeList = [],
    container = {"x" : 0, "y" : 0, "width" : x, "height" : y},
    enemyTypesDict =
      {
        1:{"h":1, "v" : 3, "d" : 1},
        2:{"h":3, "v" : 1, "d" : 3}
      },
    step = calculateStep(),
    pStep = 4320 / 20;
    vFactor = 1.5,
    hFactor = 50,
    dFactor = 10;


//create application
var app = new Application({
    width: x,
    height: y,
    antialias: true,
    transparent: false,
    resolution: window.devicePixelRatio
  }
);
//define app attribute and add it to document
app.renderer.backgroundColor = 0x0A0A08;
app.renderer.transparent = true;
app.renderer.view.style.display = "block";

document.body.appendChild(app.view);

//create load page container
var loadPageContainer = new Container();
app.stage.addChild(loadPageContainer);

//add progress bar(back bar)
var graphic = new PIXI.Graphics();
graphic.beginFill(0xffffff, 0.5);
graphic.lineStyle(2, 0xffffff, 1);
graphic.drawRect(x * 0.5 - 50, y * 0.5 - 10, 100, 20);
graphic.endFill();
loadPageContainer.addChild(graphic);

//add progress bar(front bar)
var graphic1 = new PIXI.Graphics();
graphic1.beginFill(0xffffff, 1);
graphic1.drawRect(x * 0.5 - 50, y * 0.5 - 10, 100, 20);
graphic1.endFill();
loadPageContainer.addChild(graphic1);

//add load text(it shows percentage)
var loadText = new Text("", {
  align: "center",
  fill: 0xffffff,
  fontFamily: "Courier New",
  fontSize: 12
});
loadText.x = x * 0.5;
loadText.y = y * 0.5 - 22;
loadText.anchor.set(0.5);
loadPageContainer.addChild(loadText);

//add front bar and load text as variable of loadPageContainer
//to change them anywhere
loadPageContainer.counter = graphic1;
loadPageContainer.text = loadText;

//pixi loader mechanism
//first add spritesheet and load it
//after load proccess invoke setup function
//delete loadPageContainer
loader
    .add([
      spritePath + "microbasic0sheet.json",
      spritePath + "microbasic1sheet.json",
      spritePath + "microcavesheet.json",
      spritePath + "microcharactersheet.json",
      spritePath + "microcitysheet.json",
      spritePath + "microcoloredsheet.json",
      spritePath + "microindoorsheet.json",
      spritePath + "micromonochromesheet.json",
      spritePath + "bg.png",
      spritePath + "shield1.png",
    ])
    .on("progress", loadProgressHandler)
    .load(loadPageHandler);

function loadProgressHandler(loader, resource){
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
    loadPageContainer.counter.width = loader.progress;
    loadPageContainer.text.text = "loading: " + Math.floor(loader.progress) + "%";
}

function loadPageHandler(){
  setTimeout(function(){
    app.stage.removeChild(loadPageContainer);
    setup();
  }, 1000);
}

//functions for randomly spawning enemies and bonuses
function spawnEnemy(className) {
	var enemy;
	if (window[className+"Types"]) {
		var typeInt = randomInt(0,window[className+"Types"].length-1);
		enemy = new window[className](window[window[className+"Sheets"][typeInt]][window[className+"Textures"][typeInt]], window[className+"Types"][typeInt]);
	} else {
		enemy = new window[className](window[window[className+"Sheets"][0]][window[className+"Textures"][0]]);
	}
	enemy.x = randomInt(containerBounds.x, containerBounds.width);
	enemy.y = randomInt(containerBounds.y, containerBounds.height);
	enemy.width = step;
	enemy.height = step;
	enemy.id = window[className+"NextId"]++;
  enemy.radar = enemy.createRadar();
	enemyList.push(enemy);
	camera.addChild(enemy);
	return enemy;
	/*var enemy = new window[className](Math.floor(Math.random()*x),Math.floor(Math.random()*y));
	enemyList.push(enemy);
	return enemy;*/
}
function spawnBonus(className) {
	var bonus;
	if (window[className+"Types"]) {
		var typeInt = randomInt(0,window[className+"Types"].length-1);
		bonus = new window[className](window[window[className+"Sheets"][typeInt]][window[className+"Textures"][typeInt]], window[className+"Types"][typeInt]);
	} else {
		bonus = new window[className](window[window[className+"Sheets"][0]][window[className+"Textures"][0]]);
	}
	bonus.x = randomInt(containerBounds.x, containerBounds.width);
	bonus.y = randomInt(containerBounds.y, containerBounds.height);
	bonus.width = step;
	bonus.height = step;
	treeList.push(bonus);
	camera.addChild(bonus);
	return bonus;
}
function spawn(n=10) {
	if (enemyList.length < maxEnemy) {
		var time = Math.floor((Date.now() - startingTime)/difficultyRate);
		var difficulty = time / (time+difficultyMod);
		var spawns = [];
		for (var i = 0; i < n; i++) {
			spawns.push(Math.random());
		}
		for (var i = 0; i < n; i++) {
			if (spawns[i] < difficulty) {
				spawns[i] = spawnEnemy(enemyTypeList[Math.floor(Math.random()*enemyTypeList.length)]);
			} else {
				spawns[i] = spawnBonus(bonusTypeList[Math.floor(Math.random()*bonusTypeList.length)]);
			}
		}
	}
}

function setup(){
  //define global variable spritesheet
  //it is reference to reach texture from cache
  //microcolored    ---> kenney_microroguelike_1.2 colored
  //microbasic0     ---> roguelike-pack splitted png from 0 to 960
  //microbasic1     ---> roguelike-pack splitted png from 960 to last
  //microcave       ---> roguelike-cave-pack
  //microcharacter  ---> roguelike-characters-pack
  //microindoor     ---> roguelikeindoor_updated
  //micromonochrome ---> kenney_microroguelike_1.2 micromonochrome
  microcoloredsheet = resources[spritePath + "microcoloredsheet.json"].textures;
  microbasic0sheet = resources[spritePath + "microbasic0sheet.json"].textures;
  microbasic1sheet = resources[spritePath + "microbasic1sheet.json"].textures;
  microcavesheet = resources[spritePath + "microcavesheet.json"].textures;
  microcharactersheet = resources[spritePath + "microcharactersheet.json"].textures;
  microcitysheet = resources[spritePath + "microcitysheet.json"].textures;
  microindoorsheet = resources[spritePath + "microindoorsheet.json"].textures;
  micromonochromesheet = resources[spritePath + "micromonochromesheet.json"].textures;
  radarTexture = resources[spritePath + "shield1.png"].texture;

  gameContainer = new Container();
  gameContainer.x = 0;
  gameContainer.y = 0;
  gameContainer.width = x;
  gameContainer.height = y;
  app.stage.addChild(gameContainer);

  camera = new PIXI.Container();
  gameContainer.addChild(camera);

  bg = new Sprite(resources[spritePath + "bg.png"].texture);
  bg.anchor.set(0.5);
  bg.x = x/2;
  bg.y = y/2;
  bg.width = 7680;
  bg.height = 4320;
  camera.addChild(bg);

  containerBounds.x = bg.x - (3840-step);
  containerBounds.y = bg.y - (2160-step);
  containerBounds.width = bg.x + (3840-step);
  containerBounds.height = bg.y + (2160-step);

  player = new Player(microcharactersheet["tile378.png"]);
  player.x = x * 0.5;
  player.y = y * 0.5;
  player.width = step;
  player.height = step;
  camera.addChild(player);

  sickP = new Sprite(microcharactersheet["tile379.png"]);
  sickP.x = x * 0.5;
  sickP.y = y * 0.5;
  sickP.width = step;
  sickP.height = step;
  sickP.alpha = 0;
  sickP.anchor.set(0.5);
  camera.addChild(sickP);

  //create load page container
  var playerHealContainer = new Container();
  app.stage.addChild(playerHealContainer);

  //add progress bar(back bar)
  var bhg = new PIXI.Graphics();
  bhg.beginFill(0xc7fd09, 0.2);
  bhg.lineStyle(4, 0x9f9f9f, 1);
  bhg.drawRoundedRect(0, 0, 5 * step, step, 5);
  bhg.endFill();
  playerHealContainer.addChild(bhg);

  //add progress bar(front bar)
  var fhg = new PIXI.Graphics();
  fhg.beginFill(0xc7fd09, 0.4);
  fhg.drawRoundedRect(0, 0, 5 * step, step, step * 0.2);
  fhg.endFill();
  playerHealContainer.addChild(fhg);

  player.healBar = fhg;
  player.healBarStep = fhg.width * 0.01;

  timer = new PixiStopWatch(x - 3 * step, 2 * step, 2 * step, {"animStyle" : "fluid", "colorAnim" : false, "backColor" : 0xc66527, "frontColor" :  0xc7fd09, "fontColor" : 0xc7fd09});
  timer.drawBack();
  timer.start(600);
  timer.alpha = 0.5;
  playerHealContainer.addChild(timer);

  killSymbol = new Sprite(microcavesheet["tile060.png"]);
  killSymbol.x = x * 0.5;
  killSymbol.y = 0.5 * step;
  killSymbol.width = 2 * step;
  killSymbol.height = 2 * step;
  killSymbol.alpha = 0.8;
  killSymbol.anchor.set(0.5);
  playerHealContainer.addChild(killSymbol);

  killText = new Text("x0", {"fontSize" : 1.5 * step, "fill" : 0xe7dbc0, "fontFamily": "Courier New"});
  killText.x = x * 0.5 + step;
  killText.y = -0.5 * step;
  killText.alpha = 0.5;
  playerHealContainer.addChild(killText);

  playerHealContainer.x = step * 0.5;
  playerHealContainer.y = step * 0.5;

  cursor = new Sprite(microcavesheet["tile363.png"]);
  cursor.x = x * 0.5;
  cursor.y = y * 0.5;
  cursor.width = 1.5 * step;
  cursor.height = 1.5 * step;
  cursor.anchor.set(0.5);
  cursor.interactive = true;
  cursor.buttonMode = true;
  cursor.on('pointerdown', function(){console.log("Fire in the hole");if(!player.trigger){player.fireUtil(calculateSlope(player, cursor)+Math.PI*1.5)}});
  camera.addChild(cursor);

  /*var enemy = new Enemy(microcharactersheet["tile055.png"]);
  enemy.x = x * 0.5;
  enemy.y = y * 0.2;
  enemy.width = step;
  enemy.height = step;
  enemy.id = 1;
  enemyList.push(enemy);
  app.stage.addChild(enemy);

  var enemy1 = new Enemy(microcharactersheet["tile055.png"], 2);
  enemy1.x = x * 0.7;
  enemy1.y = y * 0.8;
  enemy1.width = step;
  enemy1.height = step;
  enemy1.id = 2;
  enemyList.push(enemy1);
  app.stage.addChild(enemy1);

  var enemy2 = new Enemy(microcharactersheet["tile055.png"], 2);
  enemy2.x = x * 0.6;
  enemy2.y = y * 0.8;
  enemy2.width = step;
  enemy2.height = step;
  enemy2.id = 3;
  enemyList.push(enemy2);
  app.stage.addChild(enemy2);

  for(var i = 0; i < 20; i++){
    var tree = new Tree(microcitysheet["tile517.png"]);
    tree.x = randomInt(step * 0.5, x - step * 0.5);
    tree.y = randomInt(step * 0.5, y - step * 0.5);
    tree.width = step;
    tree.height = step;
    treeList.push(tree);
    app.stage.addChild(tree);
  }*/

  app.ticker.add(function(){
    player.move();
    player.dealTreeCrash();
    player.dealHealBar();
    enemyList = enemyList.filter(function(enemy){
      var ret = true;
      enemy.move();
      enemy.dealTeamCrash();
      enemy.dealTreeCrash();
      enemy.dealBulletCrash();
      ret = enemy.dealPlayerCrash();
      if(enemy.heal <= 0){
        enemy.death();
        ret = false;
      }
      return ret;
    });

    treeList = treeList.filter(function(tree){
      var ret = true;
      if(tree.heal <= 0){
        tree.death();
        ret = false;
      }
      return ret;
    });

    bulletList = bulletList.filter(function(bullet){
      var ret = true;
      bullet.x = bullet.x + (vFactor * 3 * Math.cos(bullet.rotation - Math.PI / 2));
      bullet.y = bullet.y + (vFactor * 3 * Math.sin(bullet.rotation - Math.PI / 2));
      if( bullet.x < bg.x - (3840+step) || bullet.y < bg.y - (2160+step) || bullet.x > bg.x + (3840+step) || bullet.y > bg.y + (2160+step)){
        ret = false;
        camera.removeChild(bullet);
      }
      if(bullet.status == "hit"){
        ret = false;
        camera.removeChild(bullet);
      }
      return ret;
    });
    killText.text = "x" + player.kills;
  });

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  document.onmousemove = function handlemousemove(event){
    event = event || window.event;
    cursor.x = event.x-camera.x;
    cursor.y = event.y-camera.y;
  }

  setInterval(spawn,spawnInterval);
  player.intervalFunc();
}
