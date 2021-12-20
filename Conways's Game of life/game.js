const settings = {
    width : 400,
    height : 400,
    columns: 20,
    rows: 20,
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


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
let mouse = {x: 0, y: 0};
document.addEventListener("mousemove", (e) => {
    mouse = getMousePos(canvas, e);
});

rowSlider = document.getElementById('boardSizeSlider')
speedSlider = document.getElementById('speedSlider')



class gameOfLife{
    constructor(size,width,height){
        this.size = size;
        this.width = width;
        this.height = height;
        this.board = this.createBoard();
    }
    createBoard(){
        let board = []
        for(let i = 0; i < this.size; i++){
            board[i] = []
            for(let j = 0; j < this.size; j++){
                board[i][j] = 0
            }
        }
        return board
    }
    drawBoard(){
        fill(255,255,255);
        fillRect(0,0,this.width,this.height)

        let pieceWidth = this.width / this.size
        let pieceHeight = this.height / this.size

        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                if(this.board[i][j] == 1){
                    fill(255,0,0)
                    fillRect(j*pieceWidth,i*pieceHeight,pieceWidth,pieceHeight)                }
                else if(this.board[i][j] == 2){
                    fill(255,255,0)
                    fillRect(j*pieceWidth,i*pieceHeight,pieceWidth,pieceHeight)
                }
                else{
                    fill(255,255,255)
                    fillRect(j*pieceWidth,i*pieceHeight,pieceWidth,pieceHeight)                }
            }
        }
        fill(0,0,0)
        this.gridLines()
    }
    gridLines(){
        for(let i = 0; i < this.size; i++){
            fillLine(0,i*this.height/this.size,this.width,i*this.height/this.size)
            fillLine(i*this.width/this.size,0,i*this.width/this.size,this.height)
        }
    }



    update(){
        let newBoard = this.createBoard()
        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                let neighbors = this.getNeighbors(i,j)
                if(this.board[i][j] == 1){
                    if(neighbors < 2 || neighbors > 3){
                        newBoard[i][j] = 0
                    }
                    else{
                        newBoard[i][j] = 1
                    }
                }
                else if(this.board[i][j] == 0){
                    if(neighbors == 3){
                        newBoard[i][j] = 1
                    }
                }
            }
        }
        this.board = newBoard
    }
    getNeighbors(i,j){
        let neighbors = 0
        for(let x = -1; x < 2; x++){
            for(let y = -1; y < 2; y++){
                if(x == 0 && y == 0){
                    continue
                }
                if(i+x < 0 || i+x >= this.size || j+y < 0 || j+y >= this.size){
                    continue
                }
                if(this.board[i+x][j+y] == 1){
                    neighbors++
                }
            }
        }
        return neighbors
    }
}

let game = new gameOfLife(settings.rows,settings.width,settings.height)

rowSlider.oninput = ()=>{
    settings.rows = rowSlider.value
    settings.columns = rowSlider.value
    document.getElementById('size').innerHTML = "Size: "+ rowSlider.value
    game = new gameOfLife(settings.rows,settings.width,settings.height)
    game.drawBoard()
}

document.onclick = ()=>{
    if(mouse.x < settings.width && mouse.y < settings.height && mouse.x > 0 && mouse.y > 0){
        if( game.board[parseInt(mouse.y/settings.height*settings.rows)][parseInt(mouse.x/settings.width*settings.columns)] == 1){
            game.board[parseInt(mouse.y/settings.height*settings.rows)][parseInt(mouse.x/settings.width*settings.columns)] = 0
        }
        else{
            game.board[parseInt(mouse.y/settings.height*settings.rows)][parseInt(mouse.x/settings.width*settings.columns)] = 1
        }
        if(document.getElementById('startButton').innerHTML == "Stop"){
            window.clearInterval(intervalId)
            intervalId = window.setInterval(()=>{
                game.drawBoard()
            },1000/settings.speed)
            document.getElementById('startButton').innerHTML = "Start"
        }
    }
    game.drawBoard()
}
    

let intervalId = window.setInterval(()=>{
    game.drawBoard()
},1000/30)

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

speedSlider.oninput = ()=>{
    document.getElementById('speed').innerHTML = "Speed: "+ speedSlider.value
    settings.speed = speedSlider.value
    window.clearInterval(intervalId)
        intervalId = window.setInterval(()=>{
            game.drawBoard()
            game.update()
        },1000/settings.speed)
}