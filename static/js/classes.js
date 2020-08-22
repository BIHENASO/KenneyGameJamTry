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
  this.trigger = false;
  this.move = function move(){
    var angle = this.directionList[this.moveDirection];
    var x_diff = this.moveFactor * this.moveVelocity * this.moveStatus * Math.cos(angle - Math.PI/2);
    var y_diff = this.moveFactor * this.moveVelocity * this.moveStatus * Math.sin(angle - Math.PI/2);
    camera.x = camera.x - x_diff;
    camera.y = camera.y - y_diff;
    this.x = this.x + x_diff;
    this.y = this.y + y_diff;
    sickP.x = this.x;
    sickP.y = this.y;
    if(camera.x <= cameraBounds.x+step/2 || camera.y <= cameraBounds.y+step/2 || camera.x >= cameraBounds.x+cameraBounds.width-step/2 || camera.y >= cameraBounds.y+cameraBounds.height-step/2){
    	camera.x = camera.x + x_diff;
		camera.y = camera.y + y_diff;
		this.x = this.x - x_diff;
		this.y = this.y - y_diff;
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
    camera.removeChild(this);
    camera.removeChild(sickP);
  }
  this.fire = function fire(angle){
    var fire = new Sprite(microbasic1sheet["tile1353.png"]);
    fire.x = this.x; //+ (step * Math.cos(angle));
    fire.y = this.y; //+ (step * Math.sin(angle));
    fire.width = 1.25 * step;
    fire.height = 1.25 * step;
    fire.anchor.set(0.5);
    fire.damage = this.damage;
    fire.rotation = angle;
    console.log(fire.rotation);
    camera.addChild(fire);
    bulletList.push(fire);
  }
  this.fireUtil = function fireUtil(angle){
    this.alpha = 0.5;
    this.trigger = true;
    animUtil(500, 5, function(){sickP.alpha += 0.1}.bind(this), function(){this.alpha = 1; sickP.alpha = 0; this.fire(angle); this.trigger = false;}.bind(this));
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
    if( this.x <= containerBounds.x || this.y <= containerBounds.y || this.x >= containerBounds.width || this.y >= containerBounds.height || this.range <= 0){
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
  this.dealBulletCrash = function dealBulletCrash(){
    bulletList.forEach(function(bullet){
      if(hitTestRectangle(this, bullet)){
        bullet.status = "hit";
        this.heal -= bullet.damage;
        this.alpha = 0.5
        animUtil(500, 5, function(){this.alpha += 0.1;}.bind(this), function(){this.alpha = 1;}.bind(this));
      }
    }.bind(this));
  }
  this.death = function death(){
    this.x = -50 * x;
    this.y = -50 * y;
    this.radar.x = this.x;
    this.radar.y = this.y;
    camera.removeChild(this);
    camera.removeChild(this.radar);
  }

  this.createRadar = function createRadar(){
    var sprite = new Sprite(radarTexture);
    sprite.x = this.x;
    sprite.y = this.y;
    sprite.width = 3 * step;
    sprite.height = 3 * step;
    sprite.anchor.set(0.5);
    camera.addChild(sprite);
    return sprite;
  }
  this.dealPlayerCrash = function dealPlayerCrash(){
    if(hitTestRectangle(this, player)){
      animUtil(1000, 5, function(){player.alpha -= 0.2}.bind(this), function(){player.death();}.bind(this));
      animUtil(1000, 5, function(){this.alpha -= 0.2}.bind(this), function(){this.death();}.bind(this));
      return false;
    }
    return true;
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
    camera.removeChild(this);
  }
}

//Prototype new playership class based on PIXI.Sprite
Tree.prototype = Object.create(Sprite.prototype);
Object.defineProperty(Tree.prototype, 'constructor', {
  value: Tree,
  enumarable: false,
  writable: true
});
