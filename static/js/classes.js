function Player(texture){
  Sprite.call(this, texture); //constructor call PIXI.Sprite class
  this.anchor.set(0.5);
  this.heal = 100;
  this.moveDirection = 0;
  this.moveVelocity = step * 0.02;
  this.moveStatus = 0;
  this.moveFactor = 1;
  this.fireID = 0;
  this.directionList = [0, Math.PI * 0.5, Math.PI, 1.5 * Math.PI];
  this.move = function move(){
    if(!contain(this, container)){
      var angle = this.directionList[this.moveDirection];
      this.x = this.x + (this.moveFactor * this.moveVelocity * this.moveStatus * Math.cos(angle - Math.PI/2))
      this.y = this.y + (this.moveFactor * this.moveVelocity * this.moveStatus * Math.sin(angle - Math.PI/2));
    }
  }
  this.dealTreeCrash = function dealTreeCrash(){
    treeList.forEach(function(tree){
      if(hitTestRectangle(this, tree)){
        console.log("player hit tree");
        this.heal += tree.heal * 0.01;
        if(this.heal > 100) this.heal = 100;
        tree.heal = 0;
      }
    }.bind(this));
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
  this.heal = 100;
  this.type = type;
  this.moveAngle = (this.type-1) * Math.PI * 0.5;
  this.moveVelocity = step * 0.02;
  this.moveFactor = 1;
  this.range = 200;
  this.move = function move(){
    if(contain(this, container) || this.range <= 0){
      this.moveAngle += Math.PI;
      this.range = 200;
    }
    this.x = this.x + (this.moveFactor * this.moveVelocity * Math.cos(this.moveAngle - Math.PI/2))
    this.y = this.y + (this.moveFactor * this.moveVelocity * Math.sin(this.moveAngle - Math.PI/2));
    this.range -= this.moveFactor * this.moveVelocity;
  }
  this.dealTeamCrash = function dealTeamCrash(){
    enemyList.forEach(function(enemy){
      if(hitTestRectangle(this, enemy) && this.id != enemy.id){
        this.moveAngle += Math.PI;
        this.range = 200;
        enemy.moveAngle += Math.PI;
        enemy.range = 200;
      }
    }.bind(this));
  }
  this.dealTreeCrash = function dealTreeCrash(){
    treeList.forEach(function(tree){
      if(hitTestRectangle(this, tree)){
        console.log("hit tree");
        tree.heal -= this.heal * 0.1;
        this.moveAngle += Math.PI;
        this.range = 200;
      }
    }.bind(this));
  }
  this.death = function death(){
    this.x = -50 * x;
    this.y = -50 * y;
    app.stage.removeChild(this);
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
  this.heal = type * 100;
  this.death = function death(){
    this.x = -50 * x;
    this.y = -50 * y;
    app.stage.removeChild(this);
  }
}

//Prototype new playership class based on PIXI.Sprite
Tree.prototype = Object.create(Sprite.prototype);
Object.defineProperty(Tree.prototype, 'constructor', {
  value: Tree,
  enumarable: false,
  writable: true
});
