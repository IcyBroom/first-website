const WIDTH = 700;
const HEIGHT = 600;

const settings = {
    columns: 7,
    rows: 6,
    connectNum: 4,
}

let canvas  = document.getElementById('canvas')
canvas.width = WIDTH;
canvas.height = HEIGHT;
const context = canvas.getContext('2d');

const fillRect = (x,y,w,h)=>{
    context.fillRect(x,y,w,h)
}
const fillCircle = (x,y,r)=>{
    context.beginPath();
    context.arc(x,y,r,0,Math.PI*2,false);
    context.fill();
}
const fillEllipse = (x,y,w,h)=>{
    context.beginPath();
    context.ellipse(x,y,w,h,0,0,Math.PI*2);
    context.fill();
}

const fill = (r,g,b) => {
    context.fillStyle = 'rgb('+r+','+g+','+b+')'
}


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
        fill(70,70,255);
        fillRect(0,0,this.width,this.height)

        let pieceWidth = parseInt(this.width / this.columns)
        let pieceHeight = parseInt(this.height / this.rows)
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                if(this.board[i][j] == 1){
                    fill(255,0,0)
                    // fillRect(j*pieceWidth,i*pieceHeight,pieceWidth,pieceHeight)
                     // fillCircle(j*pieceWidth + pieceWidth/2,i*pieceHeight + pieceHeight/2,pieceWidth/2)
                    fillEllipse(j*pieceWidth + pieceWidth/2,i*pieceHeight + pieceHeight/2,pieceWidth/2-2,pieceHeight/2-2)
                }
                else if(this.board[i][j] == 2){
                    fill(255,255,0)
                    // fillRect(j*pieceWidth,i*pieceHeight,pieceWidth,pieceHeight)
                    // fillCircle(j*pieceWidth + pieceWidth/2,i*pieceHeight + pieceHeight/2,pieceWidth/2)
                    fillEllipse(j*pieceWidth + pieceWidth/2,i*pieceHeight + pieceHeight/2,pieceWidth/2-2,pieceHeight/2-2)

                }
                else{
                    fill(255,255,255)
                    fillEllipse(j*pieceWidth + pieceWidth/2,i*pieceHeight + pieceHeight/2,pieceWidth/2-2,pieceHeight/2-2)
                    // fill(0,0,0)
                     //fillRect(j*pieceWidth,i*pieceHeight,pieceWidth,pieceHeight)
                }
                
            }
        }
    }
    makeMove(columnNum){
        if(this.winner != 0){ return;}
        let column = parseInt(columnNum)
        let i = this.rows - 1;
        while(this.board[i][column] != 0 && i >= 0){
            i--;
        }
        this.board[i][column] = (this.turn % 2) + 1
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
}

let game = new Board(settings.rows,settings.columns,WIDTH,HEIGHT,settings.connectNum);
game.createBoard();

document.onkeydown = (event) => {
    if (parseInt(event.key)){
    game.makeMove(parseInt(event.key)-1)
    }
}

window.setInterval(()=>{
    game.drawBoard();
},1000/30)
//fillRect(0,0,WIDTH,HEIGHT)
