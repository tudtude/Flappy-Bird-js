let bird, degree, display, floor, frame, gameView, gameStatus, gravity, ground, init, initGame, score, sprite

frame = 0
score = 0
degree = Math.PI/180
gameStatus = 'init'
gravity = 0.15    
display = document.getElementById('display')
display.width = 320
display.height = 480
gameView = display.getContext('2d')

// load image

sprite = new Image()
sprite.src = 'sprite.png'

// --------------- Start Setup object
background = {
    x: 0,
    spriteX : 0,
    spriteY : 0,
    width: 275,
    height: 225,
    speedX: 2,
    show : function(){
        gameView.fillStyle = 'lightblue'
        gameView.fillRect(0, 0, 600, 600)
        gameView.drawImage(sprite, background.spriteX, background.spriteY, background.width, background.height, background.x, display.height - background.height , background.width, background.height)
        
        gameView.drawImage(sprite, background.spriteX, background.spriteY, background.width, background.height, background.width + background.x, display.height - background.height , background.width, background.height)          
        gameView.drawImage(sprite, background.spriteX, background.spriteY, background.width, background.height, background.width * 2 + background.x, display.height - background.height , background.width, background.height)
    },
    update: function(){
        if( background.x < - background.width ){
            background.x = 0
        }
        background.x = background.x - 2
    }
}

ground = {
    spriteX : 276,
    spriteY : 0,
    width : 224,
    height: 112,
    x: 0,
    y: display.height - 112,
    speedX : 2,
    
    show : function(){
        gameView.drawImage( sprite, ground.spriteX, ground.spriteY, ground.width, ground.height, ground.x, ground.y, ground.width, ground.height)
        
        gameView.drawImage( sprite, ground.spriteX, ground.spriteY, ground.width, ground.height, ground.x + ground.width, ground.y, ground.width, ground.height)
        
        gameView.drawImage( sprite, ground.spriteX, ground.spriteY, ground.width, ground.height, ground.x + ground.width * 2, ground.y, ground.width, ground.height)
    },
    update : function(){
        if( ground.x < - ground.width ){
            ground.x = 0
        }
        ground.x = ground.x - 2
    }
        
}

bird = {
    animate: [
        { spriteX: 276, spriteY: 112 },
        { spriteX: 276, spriteY: 139 },
        { spriteX: 276, spriteY: 164 },
        { spriteX: 276, spriteY: 139 }
    ],
    x : 50,
    y : 150,
    frame: 0,
    width : 34,
    height : 26,
    speedY : 0,
    rotation: 0,
    show : function(){
        let birdAnimate = this.animate[this.frame % 4]
        gameView.save();
        gameView.translate( this.x ,this.y )
        gameView.rotate( this.rotation * Math.PI/180)
        gameView.drawImage( sprite, birdAnimate.spriteX, birdAnimate.spriteY, this.width, this.height, 0, 0, this.width, this.height )
        gameView.restore();
    },
    update : function(){
        
        
        // bird rotation
        if( this.speedY < 0 ){
            this.rotation = -25
        }else if( this.speedY == 0 || this.speedY == 0.2){
            this.rotation = 0
        }else{
            this.rotation = 25
        }
        
        if( gameStatus == 'init'){
            // animate bird
            this.frame += frame % 10 == 0 ? 1 : 0
        }
        
        if (gameStatus == 'running' ){
            // animate bird
            this.frame += frame % 5 == 0 ? 1 : 0
            
            // check border Y
            if( this.y < 0){
                this.y = 0      
            }
            if(this.y > display.height - ground.height - bird.height - 5 ) {
                this.speedY = 0     
                this.y = display.height - ground.height - bird.height
                gameStatus = 'gameOver'    
            }
            
            // bird move down
            this.speedY += gravity
            this.y += this.speedY
        }
    },
    flap : function(){
        this.speedY = -3
    }
}

pipes = {
    bottom : {
        spriteX: 502,
        spriteY: 0
    },
    top: {
        spriteX: 553,
        spriteY: 0
    },
    gap: 85,
    width: 53,
    height: 400,
    speedX: 1.5,
    x: display.width,
    maxY: - 150,
    list: [],
    show: function(){
        for( let i = 0; i < pipes.list.length; i ++){
            
            gameView.drawImage( sprite, pipes.top.spriteX, pipes.top.spriteY, pipes.width, pipes.height, pipes.list[i].x, pipes.list[i].y, pipes.width, pipes.height )
            
            gameView.drawImage( sprite, pipes.bottom.spriteX, pipes.bottom.spriteY, pipes.width, pipes.height, pipes.list[i].x, pipes.list[i].y + pipes.height + pipes.gap , pipes.width, pipes.height )
        }
    },
    update: function(){
        
        // add new pipe
        if( frame%120 == 0 ){
            pipes.list.push({ 
                x: display.width,
                y: pipes.maxY * (Math.random() + 1)
            })
        }
        
        // update pipe position X
        for ( let i = 0; i < pipes.list.length; i ++ ){
            pipes.list[i].x -= pipes.speedX 
            
            let pipeX = pipes.list[0].x
            let topY = pipes.list[0].y + pipes.height 
            let bottomY = pipes.list[0].y + pipes.height + pipes.gap
            
            if( pipes.list[0].x + pipes.width <= 0 ){
                score ++ 
                pipes.list.shift()
            }
            
            // checked impact x
            if( bird.x + bird.width - 8 > pipeX && pipeX > bird.x && ( bird.y < topY || bird.y > bottomY ) ){
                gameStatus = 'gameOver'
            }
            // checked impact y
            if(( bird.y + bird.height > bottomY || bird.y < topY ) && ( bird.x > pipeX && bird.x < pipeX + pipes.width )){
                gameStatus = 'gameOver'
            }
            
        }
    }
    
}

button = {
    x: display.width / 2 - 50,
    y: display.height / 2 - 15,
    width: 100,
    height: 30,
    key: 'Game Start',
    show: function () {
        gameView.fillStyle = 'darkred'
        gameView.fillRect(this.x, this.y, this.width, this.height)
        gameView.font = '15px Verdana'
        gameView.fillStyle = 'white'
        gameView.fillText(this.key, this.x + 7, this.y + 20)
    }
}
 
// --------------- End Setup object

// --------------- Start setup input

document.onkeydown = function( event ){
    if( event.keyCode == 32 && gameStatus == 'running'){
        bird.flap()                   
    }
}

display.addEventListener('click', function( event) {
    if( gameStatus == 'running' ) {
        bird.flap()
    }else{
        let adjust = display.getBoundingClientRect()
        if((event.clientX - adjust.left > button.x 
            && event.clientX - adjust.left < button.x + button.width 
            ) && ( 
            event.clientY - adjust.top > button.y 
            && event.clientY - adjust.top < button.y + button.height)){

            cancelAnimationFrame(init)
            gameStatus = 'running'
            gameStart()

        }
    }
})



// --------------- End setup input


initConfig()
initGameView()

function initConfig() {
    background.show()
    bird.show()
    pipes.show()
    ground.show()
    frame = frame == 0 ? 0 : frame
}

function initGameView() {
    initConfig()
    bird.update()
    button.show()
    frame ++
    score = score == 0 ? 0 : score
    gameView.fillStyle = 'black'
    gameView.fillText('Score: ' + score, 5, display.height - 5 )
    init = requestAnimationFrame( initGameView )
}

function gameStart(){
    initConfig()
    frame ++
    bird.update()
    ground.update()
    background.update()
    pipes.update()
    gameView.fillStyle = 'black'
    gameView.fillText('Score: ' + score, 5, display.height - 5 )
    if( gameStatus == 'gameOver' ) {
        gameOver()
        return
    }
    requestAnimationFrame( gameStart )
}

function gameOver(){
    gameStatus = 'gameOver'
    frame = 0
    bird.y = 150
    pipes.list = []
    gameView.fillStyle = 'rgba(0, 0, 0, 0.5)'
    gameView.fillRect(0, 0, display.width, 512)
    gameView.fillStyle = 'white'
    gameView.fillText("Game Over", display.width / 2 - 42, display.height / 2 - button.height + 5)
    button.show()
    score = 0
}