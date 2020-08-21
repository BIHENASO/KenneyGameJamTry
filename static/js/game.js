//get screen sizes and ratio
var x = window.innerWidth,
    y = window.innerHeight,
    ratio = x / y,
    spritePath = "../assets/img/";

//global spritesheet declarations
var microcoloredsheet,
    microbasic0sheet,
    microbasic1sheet,
    microcavesheet,
    microcharactersheet,
    microcitysheet,
    microindoorsheet,
    micromonochromesheet,
    player,
    enemyList = [],
    treeList = [],
    container = {"x" : 0, "y" : 0, "width" : x, "height" : y},
    step = calculateStep();


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

  player = new Player(microcharactersheet["tile378.png"]);
  player.x = x * 0.5;
  player.y = y * 0.5;
  player.width = step;
  player.height = step;
  app.stage.addChild(player);

  var enemy = new Enemy(microcharactersheet["tile055.png"]);
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
  }

  app.ticker.add(function(){
    player.move();
    player.dealTreeCrash();
    enemyList = enemyList.filter(function(enemy){
      var ret = true;
      enemy.move();
      enemy.dealTeamCrash();
      enemy.dealTreeCrash();
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
  });

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

}
