class PixiStopWatch extends PIXI.Container{
	constructor(x, y, radius, properties = {}){
		super();
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.pivot.x = this.x + this.radius;
		this.pivot.y = this.y + this.radius;
		this.properties = properties;
		this.second = 0;
		this.minute = 0;
		this.hour = 0;
		this.angle = 0;
		this.intervalID = 0;
		this.intervalID1 = 0;
		this.intervalID2 = 0;
		this._angleConst = 6;
		this.interColor = 0;
		this.duration = 0;
		this.callback = null;
		this.setProperties();

	}
	setProperties(){
		
		this.backColor = !this.properties.backColor == 1 ? 0xdcdcdc : this.properties.backColor;
		this.frontColor = !this.properties.frontColor == 1 ? 0x696969 : this.properties.frontColor;
		this.animColor  = !this.properties.animColor == 1 ? 0xE53A1B : this.properties.animColor;
		this.interColor = this.frontColor;
		console.log(this.animColor);
		
		this.backSize = !this.properties.backSize == 1 ? 3 : this.properties.backSize;
		this.frontSize = !this.properties.frontSize == 1 ? 6 : this.properties.frontSize;
		
		this.fontType = !this.properties.fontType == 1 ? "Courier New" : this.properties.fontType;
		this.fontColor = !this.properties.fontColor == 1 ? "0xdcdcdc" : this.properties.fontColor;
		
		this.textStyle = new PIXI.TextStyle( {
			fontFamily: this.fontType,
			fill: this.fontColor,
			fontSize: Math.ceil(this.radius / 4) + "px",
			align: "center"
		});
		
		this.animStyle = !this.properties.animStyle == 1 ? "cursor" : this.properties.animStyle;
		this.colorAnim = !this.properties.colorAnim == 1 ? false : this.properties.colorAnim;
		this._animStep = this.animStyle == "cursor" ? 1 : 30;
		this._graphicsStep = this._angleConst / this._animStep;
		this.colorStep = Math.ceil((this.animColor - this.frontColor) / 10);
	}
	drawBack(){
		this.backGraphics = new PIXI.Graphics();
		this.frontGraphics = new PIXI.Graphics();
		
		this.backGraphics.lineStyle(this.backSize, this.backColor, 0.7);
		this.backGraphics.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2 * Math.PI);
		this.addChild(this.backGraphics);
		this.addChild(this.frontGraphics);
		
		this.text = new PIXI.Text("00:00:00", this.textStyle);
		this.text.x = this.x + this.radius;
		this.text.y =  this.y + this.radius;
		this.text.anchor.set(0.5);
		this.addChild(this.text);
	}
	drawFront(before, now){
		this.frontGraphics.clear();
		this.frontGraphics.lineStyle(this.frontSize, this.interColor, 1);
		this.drawArc(0, now % 360);		
	}
	
	drawArc(before, step, count){
		this.frontGraphics.arc(this.x + this.radius, this.y + this.radius, this.radius, degToRad(before), degToRad(before+step));
	}
	start(sec = 60, callback = function(){return;} ){
		this.duration = sec;
		this.callback = callback;
		this.intervalID = setInterval(function(){
							this.updateSec();
						}.bind(this), 1000);
		this.intervalID1 = setInterval(function(){
							this.updateFront();
						}.bind(this), Math.ceil(1000 / this._animStep));
		if(this.colorAnim){
			this.intervalID2 = setInterval(function(){
								this.updateLineProperties();
							}.bind(this), 6000);
		}
	}
	stop(){
		clearInterval(this.intervalID);
		clearInterval(this.intervalID1);
		if(this.colorAnim){
			clearInterval(this.intervalID2);
		}
		this.second = 0;
		this.duration = 0;
		this.frontGraphics.clear();
		this.angle == 0;
		this.callback();	
	}
	updateSec(){
		if(this.second >= this.duration){
			this.stop();
		}else{
			this.second++;
			this.minute = Math.floor(this.second / 60);
			this.hour = Math.floor(this.minute / 60);
			
			this.text.text = setCharAt(this.text.text, 7, this.second % 10);
			this.text.text = setCharAt(this.text.text, 6, Math.floor(this.second / 10) % 6);
			this.text.text = setCharAt(this.text.text, 4, this.minute % 10);
			this.text.text = setCharAt(this.text.text, 3, Math.floor(this.minute / 10) % 6);
			this.text.text = setCharAt(this.text.text, 1, this.hour % 10);
			this.text.text = setCharAt(this.text.text, 0, Math.floor(this.hour / 10));
		}
	
	}
	updateFront(){
		var before = this.angle;
		this.angle += (6 / this._animStep);
		this.drawFront(before, this.angle);
	}
	updateLineProperties(){
		if(this.second % 60 == 0){
			this.interColor = this.frontColor;
		}else{
			this.interColor = this.interColor + this.colorStep;
		}		
	}
	retime(sec){
		this.second += sec;
		var beforeAngle = this.angle;
		var beforeColor = this.interColor;
		this.angle += sec * (6 / this._animStep);
		this.interColor = 0xFFFFFF;
		this.drawFront(beforeAngle, this.angle);
		setTimeout(function(){
			this.interColor = beforeColor;
		}.bind(this), 100);
		
	}
	wait(){
		clearInterval(this.intervalID);
		clearInterval(this.intervalID1);
		if(this.colorAnim){
			clearInterval(this.intervalID2);
		}
	}
	run(){
		this.intervalID = setInterval(function(){
							this.updateSec();
						}.bind(this), 1000);
		this.intervalID1 = setInterval(function(){
							this.updateFront();
						}.bind(this), 1000 / this._animStep);
		if(this.colorAnim){
			this.intervalID2 = setInterval(function(){
								this.updateLineProperties();
							}.bind(this), 6000);
		}	
	}
	
}

class PixiCountDown extends PIXI.Container{
	constructor(x, y, radius, duration, properties = {}){
		super();
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.pivot.x = this.x + this.radius;
		this.pivot.y = this.y + this.radius;
		this.properties = properties;
		this.duration = duration;
		this.second = 0;
		this.minute = 0;
		this.hour = 0;
		this.angle = 360;
		this.intervalID = 0;
		this.intervalID1 = 0;
		this.intervalID2 = 0;
		this._angleConst = 360 / this.duration;
		this.interColor = 0;
		this.callback = null;
		this.setProperties();
		this.drawBack();

	}
	setProperties(){
		
		this.backColor = !this.properties.backColor == 1 ? 0xdcdcdc : this.properties.backColor;
		this.frontColor = !this.properties.frontColor == 1 ? 0x696969 : this.properties.frontColor;
		this.animColor  = !this.properties.animColor == 1 ? 0xE53A1B : this.properties.animColor;
		this.interColor = this.frontColor;
		console.log(this.animColor);
		
		this.backSize = !this.properties.backSize == 1 ? 3 : this.properties.backSize;
		this.frontSize = !this.properties.frontSize == 1 ? 6 : this.properties.frontSize;
		
		this.fontType = !this.properties.fontType == 1 ? "Courier New" : this.properties.fontType;
		this.fontColor = !this.properties.fontColor == 1 ? "0xdcdcdc" : this.properties.fontColor;
		
		this.textStyle = new PIXI.TextStyle( {
			fontFamily: this.fontType,
			fill: this.fontColor,
			fontSize: Math.ceil(this.radius / 4) + "px",
			align: "center"
		});
		
		this.animStyle = !this.properties.animStyle == 1 ? "cursor" : this.properties.animStyle;
		this.colorAnim = !this.properties.colorAnim == 1 ? false : this.properties.colorAnim;
		this._animStep = this.animStyle == "cursor" ? 1 : 30;
		this._graphicsStep = this._angleConst / this._animStep;
		this.colorStep = Math.ceil((this.animColor - this.frontColor) / 10);
	}
	drawBack(){
		this.backGraphics = new PIXI.Graphics();
		this.frontGraphics = new PIXI.Graphics();
		
		this.backGraphics.lineStyle(this.backSize, this.backColor, 0.7);
		this.backGraphics.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2 * Math.PI);
		this.addChild(this.backGraphics);
		this.addChild(this.frontGraphics);
		
		this.text = new PIXI.Text("00:00:00", this.textStyle);
		this.text.x = this.x + this.radius;
		this.text.y =  this.y + this.radius;
		this.text.anchor.set(0.5);
		this.addChild(this.text);
		
		this.minute = Math.floor(this.duration / 60);
		this.hour = Math.floor(this.minute / 60);
			
		this.text.text = setCharAt(this.text.text, 7, this.duration % 10);
		this.text.text = setCharAt(this.text.text, 6, Math.floor(this.duration / 10) % 6);
		this.text.text = setCharAt(this.text.text, 4, this.minute % 10);
		this.text.text = setCharAt(this.text.text, 3, Math.floor(this.minute / 10) % 6);
		this.text.text = setCharAt(this.text.text, 1, this.hour % 10);
		this.text.text = setCharAt(this.text.text, 0, Math.floor(this.hour / 10));
		
	}
	drawFront(before, now){
		this.frontGraphics.clear();
		this.frontGraphics.lineStyle(this.frontSize, this.interColor, 1);
		this.drawArc(360, now);		
	}
	
	drawArc(before, step, count){
		this.frontGraphics.arc(this.x + this.radius, this.y + this.radius, this.radius, degToRad(before), degToRad(before+step));
	}
	start(callback = function(){return;} ){
		this.second = this.duration;
		this.callback = callback;
		this.intervalID = setInterval(function(){
							this.updateSec();
						}.bind(this), 1000);
		this.intervalID1 = setInterval(function(){
							this.updateFront();
						}.bind(this), Math.ceil(1000 / this._animStep));
		if(this.colorAnim){
			this.intervalID2 = setInterval(function(){
								this.updateLineProperties();
							}.bind(this), 6000);
		}
	}
	stop(){
		clearInterval(this.intervalID);
		clearInterval(this.intervalID1);
		if(this.colorAnim){
			clearInterval(this.intervalID2);
		}
		this.second = 0;
		this.duration = 0;
		this.frontGraphics.clear();
		this.angle == 0;
		this.callback();	
	}
	updateSec(){
		if(this.second <= 0){
			this.stop();
		}else{
			this.second--;
			this.minute = Math.floor(this.second / 60);
			this.hour = Math.floor(this.minute / 60);
			
			this.text.text = setCharAt(this.text.text, 7, this.second % 10);
			this.text.text = setCharAt(this.text.text, 6, Math.floor(this.second / 10) % 6);
			this.text.text = setCharAt(this.text.text, 4, this.minute % 10);
			this.text.text = setCharAt(this.text.text, 3, Math.floor(this.minute / 10) % 6);
			this.text.text = setCharAt(this.text.text, 1, this.hour % 10);
			this.text.text = setCharAt(this.text.text, 0, Math.floor(this.hour / 10));
		}
	
	}
	updateFront(){
		var before = this.angle;
		this.angle -= (this._angleConst / this._animStep);
		this.drawFront(before, this.angle);
	}
	updateLineProperties(){
		if(this.second <= 0){
			this.interColor = this.frontColor;
		}else{
			this.interColor = this.interColor + this.colorStep;
		}		
	}
	retime(sec){
		this.second -= sec;
		var beforeAngle = this.angle;
		var beforeColor = this.interColor;
		this.angle -= sec * (this._angleConst / this._animStep);
		this.interColor = 0xFFFFFF;
		this.drawFront(beforeAngle, this.angle);
		setTimeout(function(){
			this.interColor = beforeColor;
		}.bind(this), 100);
		
	}
	wait(){
		clearInterval(this.intervalID);
		clearInterval(this.intervalID1);
		if(this.colorAnim){
			clearInterval(this.intervalID2);
		}
	}
	run(){
		this.intervalID = setInterval(function(){
							this.updateSec();
						}.bind(this), 1000);
		this.intervalID1 = setInterval(function(){
							this.updateFront();
						}.bind(this), 1000 / this._animStep);
		if(this.colorAnim){
			this.intervalID2 = setInterval(function(){
								this.updateLineProperties();
							}.bind(this), 6000);
		}	
	}
	
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
function radToDeg(rad){
  var pi = Math.PI;
  return Math.ceil(rad * (180/pi));
}
function degToRad(deg){
	var pi = Math.PI;
	return (deg * pi) / 180;
}
function decimalToHexString(number){

  return "0x" + number.toString(16).toUpperCase();
}
