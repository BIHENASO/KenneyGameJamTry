function Player(texture){
  Sprite.call(this, texture); //constructor call PIXI.Sprite class
  this.anchor.set(0.5);
  this.heal = hFactor * 2;
  this.moveDirection = 0;
  this.moveVelocity = vFactor * 2;
  this.damage = dFactor * 5;
  this.moveStatus = 0;
  this.moveFactor = 1;
  this.fireID = 0;
  this.directionList = [0, Math.PI * 0.5, Math.PI, 1.5 * Math.PI];
  this.intervalID = 0;
  this.move = function move(){
    if(!contain(this, container)){
      var angle = this.directionList[this.moveDirection];
      this.x = this.x + (this.moveFactor * this.moveVelocity * this.moveStatus * Math.cos(angle - Math.PI/2))
      this.y = this.y + (this.moveFactor * this.moveVelocity * this.moveStatus * Math.sin(angle - Math.PI/2));
      sickP.x = this.x;
      sickP.y = this.y;
    }
  }
  this.dealTreeCrash = function dealTreeCrash(){
    treeList.forEach(function(tree){
      if(hitTestRectangle(this, tree)){
        console.log("player hit tree");
        this.heal += tree.heal * 0.1;
        if(this.heal > 100) this.heal = 100;
        tree.heal = 0;
      }
    }.bind(this));
  }
  this.dealHealBar = function dealHealBar(){
    if(this.healBar != undefined && this.healBarStep != undefined){
      if(this.heal > 100) this.heal = 100;
      this.healBar.width = this.heal * this.healBarStep;
    }
  }
  this.death = function death(){
    this.x = -50 * x;
    this.y = -50 * y;
    clearInterval(this.intervalID);
    gameContainer.removeChild(this);
    gameContainer.removeChild(sickP);
  }
  this.intervalFunc = function intervalFunc(){
    this.intervalID = setInterval(function(){
      if(this.heal > 0){
        this.heal -= 5;
        this.alpha = 0;
        animUtil(1000, 5, function(){sickP.alpha += 0.2}.bind(this), function(){this.alpha = 1; sickP.alpha = 0}.bind(this));
      }
      if(this.heal <= 0){
        animUtil(1000, 5, function(){this.alpha -= 0.2}.bind(this), function(){this.death();}.bind(this));
      }
    }.bind(this), 5000)
  }
}

//Prototype new playership class based on PIXI.Sprite
Player.prototype = Object.create(Sprite.prototype);
Object.defineProperty(Player.prototype, 'constructor', {
  value: Player,
  enumarable: false,
  writable: true
});

function Enemy(texture, type = 1){
  Sprite.call(this, texture); //constructor call PIXI.Sprite class
  this.anchor.set(0.5);
  this.type = type;
  this.heal = hFactor * enemyTypesDict[this.type]["h"];
  this.moveAngle = degrees_to_radians(randomInt(0, 360));
  this.moveVelocity = vFactor * enemyTypesDict[this.type]["v"];
  this.damage = dFactor * enemyTypesDict[this.type]["d"];
  this.range = 5 * step;
  this.move = function move(){
    if(contain(this, container) || this.range <= 0){
      this.moveAngle += Math.PI;
      this.range = 5 * step;
    }
    if(hitTestCircle(this.radar, player)){
      this.moveAngle = calculateSlope(this.radar, player) - Math.PI/2;
      this.range = 5 * step;
    }
    this.x = this.x + (this.moveVelocity * Math.cos(this.moveAngle - Math.PI/2))
    this.y = this.y + (this.moveVelocity * Math.sin(this.moveAngle - Math.PI/2));
    this.radar.x = this.x;
    this.radar.y = this.y;
    this.range -= this.moveVelocity;
  }
  this.dealTeamCrash = function dealTeamCrash(){
    enemyList.forEach(function(enemy){
      if(hitTestRectangle(this, enemy) && this.id != enemy.id){
        this.moveAngle += Math.PI;
        this.range = 5 * step;
        enemy.moveAngle += Math.PI;
        enemy.range = 5 * step;
      }
    }.bind(this));
  }
  this.dealTreeCrash = function dealTreeCrash(){
    treeList.forEach(function(tree){
      if(hitTestRectangle(this, tree)){
        console.log("hit tree");
        tree.heal -= this.damage;
        this.moveAngle += Math.PI;
        this.range = 5 * step;
      }
    }.bind(this));
  }
  this.death = function death(){
    this.x = -50 * x;
    this.y = -50 * y;
    this.radar.x = this.x;
    this.radar.y = this.y;
    gameContainer.removeChild(this);
    gameContainer.removeChild(this.radar);
  }

  this.createRadar = function createRadar(){
    var sprite = new Sprite(radarTexture);
    sprite.x = this.x;
    sprite.y = this.y;
    sprite.width = 3 * step;
    sprite.height = 3 * step;
    sprite.anchor.set(0.5);
    gameContainer.addChild(sprite);
    return sprite;
  }

}

//Prototype new playership class based on PIXI.Sprite
Enemy.prototype = Object.create(Sprite.prototype);
Object.defineProperty(Enemy.prototype, 'constructor', {
  value: Enemy,
  enumarable: false,
  writable: true
});

function Tree(texture, type = 1){
  Sprite.call(this, texture); //constructor call PIXI.Sprite class
  this.anchor.set(0.5);
  this.type = type;
  this.heal = this.type * hFactor * 2;
  this.death = function death(){
    this.x = -50 * x;
    this.y = -50 * y;
    gameContainer.removeChild(this);
  }
}

//Prototype new playership class based on PIXI.Sprite
Tree.prototype = Object.create(Sprite.prototype);
Object.defineProperty(Tree.prototype, 'constructor', {
  value: Tree,
  enumarable: false,
  writable: true
});
