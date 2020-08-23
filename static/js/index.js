//get screen sizes and ratio
var x = window.innerWidth,
    y = window.innerHeight,
    ratio = x / y,
    spritePath = "./assets/img/";

var step = x < y ? x * 0.05 : y * 0.05;

if (typeof(Storage) !== "undefined") {
    if(!localStorage.getItem("maxScore")){
	    localStorage.setItem("maxScore", JSON.stringify(0));
	}
} else {
	console.log("No local storage.")
}

//create application
var app = new PIXI.Application({
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

var bgTexture    = PIXI.Texture.fromImage(spritePath + "bg.png");
var logoTexture  = PIXI.Texture.fromImage(spritePath + "logo.png");
var playTexture  = PIXI.Texture.fromImage(spritePath + "play1.png");
var instrTexture = PIXI.Texture.fromImage(spritePath + "instr.png");

var bg = new PIXI.Sprite(bgTexture);
bg.x = x * 0.5;
bg.y = y * 0.5;
bg.width = x;
bg.height = y;
bg.anchor.set(0.5);
app.stage.addChild(bg);

var logo = new PIXI.Sprite(logoTexture);
logo.x = x * 0.5;
logo.y = 6 * step;
logo.width = 8 * step;
logo.height = 7 * step;
logo.anchor.set(0.5);
app.stage.addChild(logo);

var play = new PIXI.Sprite(playTexture);
play.x = x * 0.5;
play.y = 12 * step;
play.width = 5 * step;
play.height = 2.5 * step;
play.anchor.set(0.5);
play.interactive = true;
play.buttonMode = true;
play.on("pointerdown", function(){window.location.assign("./html/game.html");});
app.stage.addChild(play);

var instr = new PIXI.Sprite(instrTexture);
instr.x = x * 0.5;
instr.y = 17 * step;
instr.width = 6 * step;
instr.height = 6 * step;
instr.anchor.set(0.5);
app.stage.addChild(instr);
