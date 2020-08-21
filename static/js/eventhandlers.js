function onKeyDown(event){
  if(event.keyCode == 87 || event.keyCode == 38){
    player.moveStatus = 1;
    player.moveDirection = 0;
  }
  if(event.keyCode == 83 || event.keyCode == 40){
    player.moveStatus = 1;
    player.moveDirection = 2;
  }

  if(event.keyCode == 65 || event.keyCode == 37){
    player.moveStatus = 1;
    player.moveDirection = 3;
  }

  if(event.keyCode == 68 || event.keyCode == 39){
    player.moveStatus = 1;
    player.moveDirection = 1;
  }
}

function onKeyUp(event){
  player.moveStatus = 0;
}
