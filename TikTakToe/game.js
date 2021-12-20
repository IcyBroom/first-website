const settings = {
    width : 500,
    height : 500,
    columns: 3,
    rows: 3,
    connectNum: 3,
}

let canvas  = document.getElementById('canvas')
canvas.width = settings.width;
canvas.height = settings.height;
const context = canvas.getContext('2d');

const fillCircle = (x,y,r) => {
    context.beginPath();
    context.arc(x,y,r,0,Math.PI*2,false);
    context.fill();
}
const fillRect = (x,y,w,h)=>{
    context.fillRect(x,y,w,h)
}

const fill = (r,g,b) => {
    context.fillStyle = 'rgb('+r+','+g+','+b+')'
}
const fillLine = (x1,y1,x2,y2)=>{
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
}
const fillEllipse = (x,y,w,h)=>{
    context.beginPath();
    context.ellipse(x,y,w,h,0,0,Math.PI*2);
    context.fill();
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

class Board {
    turn = 0; 
    winner = 0;

    constructor(rows,columns,width,height, connectNum){
        this.rows = rows;
        this.columns = columns;
        this.width = width;
        this.height = height;
        this.connectNum = connectNum;
        this.board = this.createBoard();
    }
    createBoard(){
        let board = []
        for(let i = 0; i < this.rows; i++){
            board[i] = []
            for(let j = 0; j < this.columns; j++){
                board[i][j] = 0
            }
        }
        return board;
    }
    drawBoard(){
        fill(255,255,255);
        fillRect(0,0,this.width,this.height)

        let pieceWidth = this.width / this.columns
        let pieceHeight = this.height / this.rows
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                if(this.board[i][j] == 1){
                    fill(255,0,0)
                    fillEllipse(j*pieceWidth + pieceWidth/2,i*pieceHeight + pieceHeight/2,pieceWidth/2-2,pieceHeight/2-2)
                }
                else if(this.board[i][j] == 2){
                    fill(0,0,255)
                    fillEllipse(j*pieceWidth + pieceWidth/2,i*pieceHeight + pieceHeight/2,pieceWidth/2-2,pieceHeight/2-2)

                }
                
            }
        }
        this.drawGridLines();;    
    }
    drawGridLines(){
        let pieceWidth = this.width / this.columns
        let pieceHeight = this.height / this.rows
        for(let i = 0; i < this.rows; i++){
            fillLine(0,i*pieceHeight,this.width,i*pieceHeight)
        }
        for(let i = 0; i < this.columns; i++){
            fillLine(i*pieceWidth,0,i*pieceWidth,this.height)
        }
    }
    makeMove(rowNum, colNum){
        if(this.winner != 0){ return;}
        if(this.board[rowNum][colNum] != 0){ return;}
        this.board[rowNum][colNum] = (this.turn % 2) + 1
        if(this.checkWin()){
            this.winner = (this.turn % 2) + 1
            this.message();
        }
        if(this.checkTie()){
            this.winner = 3;
            this.message();
        }
        this.turn++;
    }
    checkTie(){
        let tie = true;
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                if(this.board[i][j] == 0){
                    tie = false;
                }
                else if(this.checkWin() == true){
                    tie = false;
                }
            }
        }
        return tie;
    }
    checkWin(){
        let win = false;
        let piece = this.turn % 2 + 1;

        if(this.checkHorizontal(piece)){
            win = true;
        }
        if(this.checkVertical(piece)){
            win = true;
        }
        if(this.checkDiagonal(piece)){
            win = true;
        }
        return win;
    }
    checkHorizontal(piece){
        let win = false;
        for(let i = 0; i < this.rows; i++){
            let count = 0;
            for(let j = 0; j < this.columns; j++){
                if(this.board[i][j] == piece){
                    count++;
                }
                else{
                    count = 0;
                }
                if(count == this.connectNum){
                    win = true;
                }
            }
        }
        return win;
    }
    checkVertical(piece){
        let win = false;
        for(let i = 0; i < this.columns; i++){
            let count = 0;
            for(let j = 0; j < this.rows; j++){
                if(this.board[j][i] == piece){
                    count++;
                }
                else{
                    count = 0;
                }
                if(count == this.connectNum){
                    win = true;
                }
            }
        }
        return win;
    }
    checkDiagonal(piece){
        let win = false;
        // top left to bottom right
        for(let i = 0; i < this.rows - this.connectNum + 1; i++){
            for(let j = 0; j < this.columns - this.connectNum + 1; j++){
                let count = 0;
                for(let k = 0; k < this.connectNum; k++){
                    if(this.board[i+k][j+k] == piece){
                        count++;
                    }
                    else{
                        count = 0;
                    }
                    if(count == this.connectNum){
                        win = true;
                    }
                }
            }
        }
        // top right to bottom left
        for(let i = 0; i < this.rows - this.connectNum + 1; i++){
            for(let j = this.columns - 1; j >= this.connectNum - 1; j--){
                let count = 0;
                for(let k = 0; k < this.connectNum; k++){
                    if(this.board[i+k][j-k] == piece){
                        count++;
                    }
                    else{
                        count = 0;
                    }
                    if(count == this.connectNum){
                        win = true;
                    }
                }
            }
        }
        return win;
    }
    message(){
        if(this.winner == 1 || this.winner == 2){
        document.querySelector("#message").innerHTML = "Player " + this.winner + " wins!"
        }
        else if(this.winner == 3){
            document.querySelector("#message").innerHTML = "Tie!"
        }
    }
    reset(){
        this.board = this.createBoard();
        this.turn = 0;
        this.winner = 0;
        document.querySelector("#message").innerHTML = "";
    }
}


let game = new Board(settings.rows,settings.columns,settings.width,settings.height,settings.connectNum);
game.createBoard();

document.onclick = (event) => {
    if(mouse.x > 0 && mouse.x < settings.width && mouse.y > 0 && mouse.y < settings.height){
        let colNum = Math.floor(mouse.x / (settings.width / settings.columns));
        let rowNum = Math.floor(mouse.y / (settings.height / settings.rows));
        game.makeMove(rowNum,colNum);
    }
}
document.onkeydown = (event) => {
    if(event.key == "r"){
        game.reset();
    }
}
let resetButton = document.querySelector("#reset");
resetButton.onclick = () => { game.reset()}

window.setInterval(()=>{
    game.drawBoard();
},1000/30)