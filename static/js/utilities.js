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
