const settings = {
    width : 400,
    height : 400,
    columns: 21,
    rows: 21,
    speed: 10
}


let canvas  = document.getElementById('canvas')
canvas.width = settings.width;
canvas.height = settings.height;
const context = canvas.getContext('2d');

let fill = (r,g,b) => {
    context.fillStyle = 'rgb('+r+','+g+','+b+')'
}
let fillRect = (x,y,w,h)=>{
    context.fillRect(x,y,w,h)
}
let fillText = (text,x,y,size) => {
    context.font = `${size}px Arial`;
    context.fillText(text,x,y);
}
let fillLine = (x1,y1,x2,y2)=>{
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
}


class Snake{
    score = 0;
    darkmode = true;
    snake = {
        x: [],
        y: [],
        direction: 'right',
        length: 5,
        initialize(rows,columns){
            for(let i = 0; i < this.length; i++){
                this.y.push(parseInt(rows/2))
                this.x.push(parseInt(columns/2)-i)
            }
        }
       }
    constructor(rows, columns,width,height){
        this.rows = rows;
        this.columns = columns;
        this.width = width;
        this.height = height;
        this.snake.initialize(rows,columns);
        this.board = this.createBoard();
    }
    createBoard(){
        let board = []
        for(let i = 0; i < this.rows; i++){
            board[i] = []
            for(let j = 0; j < this.columns; j++){
                board[i][j] = 0
                // if(i == 0 || j == 0 || i == this.size-1 || j == this.size-1){
                //     board[i][j] = 2
                // }
                for(let k = 0; k < this.snake.x.length; k++){
                    if(j == this.snake.x[k] && i == this.snake.y[k]){
                        board[i][j] = 1
                    }
                }
            }
        }
        board[this.createApple(board).y][this.createApple(board).x] = 2
        return board
    }
    drawBoard(){
        let pieceWidth = this.width / this.columns
        let pieceHeight = this.height / this.rows

        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                if(this.board[i][j] == 1){
                    if(this.darkmode){ fill(0,100,150) }
                    else{ fill(0,255,0) }
                    
                    if(i == this.snake.y[0] && j == this.snake.x[0]){
                        fill(0,200,255)
                    }
                    fillRect(j*pieceWidth,i*pieceHeight,pieceWidth,pieceHeight)
                }else if(this.board[i][j] == 2){
                    if(this.darkmode){ fill(255,0,0) }
                    else{ fill(255,0,0) }
                    fillRect(j*pieceWidth,i*pieceHeight,pieceWidth,pieceHeight)  
                }
                else{
                    if(this.darkmode){fill(0,0,0)}
                    else{fill(255,255,255)}
                    fillRect(j*pieceWidth,i*pieceHeight,pieceWidth,pieceHeight)                }
            }
        }
        
        if(this.darkmode){context.strokeStyle = 'rgb(75,75,75)'; fill(255,255,255)}
        else{context.strokeStyle = 'rgb(0,0,0)'; fill(0,0,0)}
        fillText(this.score,30,50,50)
        
    }
    gridLines(){
        for(let i = 0; i < this.rows; i++){
            fillLine(0,i*this.height/this.rows,this.width,i*this.height/this.rows)
        }
        for(let i = 0; i < this.columns; i++){
            fillLine(i*this.width/this.columns,0,i*this.width/this.columns,this.height)
        }
    }
    refreshBoard(){
        let newBoard = JSON.parse(JSON.stringify(this.board));
        for(let i = 0; i < this.rows; i++){
            this.board[i] = []
            for(let j = 0; j < this.columns; j++){
                this.board[i][j] = 0
                // if(i == 0 || j == 0 || i == this.size-1 || j == this.size-1){
                //     this.board[i][j] = 2
                // }
                if(newBoard[i][j] == 2){
                    this.board[i][j] = 2
                }
                for(let k = 0; k < this.snake.x.length; k++){
                    if(j == this.snake.x[k] && i == this.snake.y[k]){
                        this.board[i][j] = 1
                    }
                }
            }
        }
    }
    createApple(board){
        let apple = {
            x: parseInt(Math.random()*this.columns),
            y: parseInt(Math.random()*this.rows)
        }
        while(board[apple.y][apple.x] != 0){
            apple.x = parseInt(Math.random()*this.columns)
            apple.y = parseInt(Math.random()*this.rows)
        }
        return apple
    }
    update(){
        this.moveSnake()
        this.checkAppleCollision()
        this.refreshBoard()
        if(this.checkCollision()){
            this.gameOver()
        }
    }
    moveSnake(){
        let head = {
            x: this.snake.x[0],
            y: this.snake.y[0]
        }
        switch(this.snake.direction){
            case 'right':
                head.x++
                break;
            case 'left':
                head.x--
                break;
            case 'up':
                head.y--
                break;
            case 'down':
                head.y++
                break;
        }
        this.snake.x.unshift(head.x)
        this.snake.y.unshift(head.y)
        if(this.snake.x.length > this.snake.length){
            this.snake.x.pop()
            this.snake.y.pop()
        }
    }
    checkAppleCollision(){
        if(this.checkCollision()){return}
        if(this.board[this.snake.y[0]][this.snake.x[0]] == 2){
            this.snake.length++
            this.board[this.createApple(this.board).y][this.createApple(this.board).x] = 2
            this.score++
        }
    }
    checkCollision(){
        let head = {
            x: this.snake.x[0],
            y: this.snake.y[0]
        }
        if(head.x < 0 || head.x >= this.columns || head.y < 0 || head.y >= this.rows){
            return true
        }
        for(let i = 1; i < this.snake.x.length; i++){
            if(head.x == this.snake.x[i] && head.y == this.snake.y[i]){
                return true
            }
        }
        return false
    }
    gameOver(){
        clearInterval(intervalId)
        if(this.darkmode){context.strokeStyle = 'rgb(75,75,75)'; fill(255,255,255)}
        else{context.strokeStyle = 'rgb(0,0,0)'; fill(0,0,0)}
        fillText("Game Over",70,380,50)
    }

}

let game = new Snake(settings.rows,settings.columns,settings.width,settings.height)

document.getElementById('easyButton').onclick = () => {
    settings.speed = 5
    settings.rows = 10
    settings.columns = 10
    game = new Snake(settings.rows,settings.columns,settings.width,settings.height)
    game.drawBoard()
    if(document.getElementById('startButton').innerHTML == 'Stop'){
        document.getElementById('startButton').click()  
    }
};
document.getElementById('mediumButton').onclick = () => {
    settings.speed = 10
    settings.rows = 20
    settings.columns = 20
    game = new Snake(settings.rows,settings.columns,settings.width,settings.height)
    game.drawBoard()
    if(document.getElementById('startButton').innerHTML == 'Stop'){
        document.getElementById('startButton').click()  
    }
};
document.getElementById('hardButton').onclick = () => {
    settings.speed = 15
    settings.rows = 30
    settings.columns = 30
    game = new Snake(settings.rows,settings.columns,settings.width,settings.height)
    game.drawBoard()
    if(document.getElementById('startButton').innerHTML == 'Stop'){
        document.getElementById('startButton').click()  
    }
};
document.onkeydown = (e) => {
    switch(e.key){
        case 'ArrowLeft':
            if(game.snake.direction != 'right'){
                game.snake.direction = 'left'
            }
            break;
        case 'ArrowUp':
            if(game.snake.direction != 'down'){
                game.snake.direction = 'up'
            }
            break;
        case 'ArrowRight':
            if(game.snake.direction != 'left'){
                game.snake.direction = 'right'
            } 
            break;
        case 'ArrowDown':
            if(game.snake.direction != 'up'){
                game.snake.direction = 'down'
            }
            break;
    }
}
document.getElementById('resetButton').onclick = ()=>{
    game = new Snake(settings.rows,settings.columns,settings.width,settings.height)
    game.drawBoard()
    if(document.getElementById('startButton').innerHTML == 'Stop'){
        document.getElementById('startButton').click()  
    }
}

game.drawBoard()
let intervalId

document.getElementById('startButton').onclick = ()=>{
    if(document.getElementById('startButton').innerHTML == "Start"){
        window.clearInterval(intervalId)
        intervalId = window.setInterval(()=>{
            game.drawBoard()
            game.update()
        },1000/settings.speed)
        document.getElementById('startButton').innerHTML = "Stop"
    }else{
        window.clearInterval(intervalId)
        intervalId = window.setInterval(()=>{
            game.drawBoard()
        },1000/settings.speed)
        document.getElementById('startButton').innerHTML = "Start"
    }
}
document.getElementById('darkmodeButton').onclick = ()=>{
    if(document.getElementById('darkmodeButton').innerHTML == "Darkmode"){
        document.getElementById('darkmodeButton').innerHTML = "Lightmode"
        game.darkmode = true
        game.drawBoard()
    }else{
        document.getElementById('darkmodeButton').innerHTML = "Darkmode"
        game.darkmode = false
        game.drawBoard()
    }
}