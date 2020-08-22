function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function degrees_to_radians(degrees){
  var pi = Math.PI;
  return degrees * (pi/180);
}
function radians_to_degrees(radians){
  var pi = Math.PI;
  return radians * (180/pi);
}

function findAngle(x,y,cX,cY){
  var radian = Math.atan2(y-cY, x-cX);
  var angle = radians_to_degrees(radian);
  if(angle < 0.0){
    angle += 360.0;
  }
  return radian;
}
function calculateStep(){
  var big = x > y ? x : y;
  var small = x > y ? y : x;
  var step = small * 0.05;
  if(step * 40 > big){
    step -= (40 * step - big) / 40;
  }

  return step;
}

function animUtil(duration, maxCount, animfunc, callback = null){
  anim(duration, maxCount, maxCount, animfunc, callback);
}
function anim(duration, maxCount, count, animfunc, callback){
  if(count < 1){
    console.log("finish");
    if(callback != null) return callback();
    else return;
  }else{
    animfunc();
    console.log(count);
    setTimeout(function(){
      anim(duration, maxCount, --count, animfunc, callback);
    }, duration / maxCount);
  }
}

function contain(sprite, container){

	var collision = undefined;

  	if (sprite.x - sprite.width / 2 < container.x) {
		sprite.x = container.x + sprite.width * 0.5;
		collision = "left";
  	}

  	if (sprite.y - sprite.height / 2  < container.y) {
		sprite.y = container.y + sprite.height * 0.5;
		collision = "top";
  	}

  	if (sprite.x + sprite.width / 2 > container.width + container.x) {
		sprite.x = (container.width + container.x) - sprite.width * 0.5;
		collision = "right";
  	}

  	if (sprite.y + sprite.height / 2 > container.height + container.y) {
		sprite.y = (container.height + container.y) - sprite.height * 0.5;
		collision = "bottom";
  	}

  	return collision;
}

function hitTestRectangle(r1, r2) {

	var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

	hit = false;

  	r1.centerX = r1.x;
  	r1.centerY = r1.y;
  	r2.centerX = r2.x;
  	r2.centerY = r2.y;

  	r1.halfWidth = r1.width / 2;
  	r1.halfHeight = r1.height / 2;
  	r2.halfWidth = r2.width / 2;
  	r2.halfHeight = r2.height / 2;

  	vx = r1.centerX - r2.centerX;
  	vy = r1.centerY - r2.centerY;

  	combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  	combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  	if (Math.abs(vx) < combinedHalfWidths){

		if (Math.abs(vy) < combinedHalfHeights){

	  		hit = true;
		}else{

	  		hit = false;
		}
  	}else{

		hit = false;
  	}

  	return hit;
}

function hitTestCircle(c0,c1) {
	var combinedHalfWidths = c0.width/2 + c1.width/2;

	if (calculateDistance(c0,c1) <= combinedHalfWidths) {
		return true;
	}
	return false;
}

function calculateDistance(obj0, obj1){

	var distance, dx, dy, spod;

	dx = obj0.x - obj1.x;
	dy = obj0.y - obj1.y;

	spod = Math.pow(dx,2) + Math.pow(dy,2);
	distance = Math.pow(spod, 0.5);

	return Math.ceil(distance);
}

function calculateSlope(obj, obj1){

	return Math.atan2(obj.y - obj1.y, obj.x - obj1.x);
}
