let canvas = null;
let context = null;
let pieces = [];
let board = [];
let pzlSize = {x:0,y:0,width:768,height:768,rows:4,columns:4};
var puzzleImg = new Image();
var selectedPiece = null;
var pzlPosition = {x:100,y:100};
var correctCount = 0;
var puzzleImages = [
    "./images/pp1.jpg",
    "./images/pp2.jpg",
    "./images/pp3.jpg",
    "./images/pp4.jpg",
    "./images/sky.jpg",
    "./images/chase.jpg",
    "./images/zuma.jpg",
    "./images/everest.jpg",
    "./images/marshall.jpg"
]

// TODO: need to work out how to place canvas anywhere I want and mouse coordinates update with it


function randomImg() {
    var randIndex = Math.floor(Math.random() * (puzzleImages.length));
    console.log(randIndex);
    puzzleImg.src = puzzleImages[randIndex];
    return;
}

class Piece{
    constructor(rowIndex, colIndex) {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        //get width/height of pieces
        this.width = pzlSize.width / pzlSize.columns;
        this.height = pzlSize.height / pzlSize.rows;
        //set size of pieces
        this.x = pzlSize.x + (this.width * this.colIndex);
        this.y = pzlSize.y + (this.height * this.rowIndex);
        this.occupied = 0;
        this.correct = 0;
    }
    draw(context) {
        context.beginPath();

        //draw puzzle pieces
        context.drawImage(puzzleImg,
            this.colIndex * puzzleImg.width/pzlSize.columns,
            this.rowIndex * puzzleImg.height/pzlSize.rows,
            puzzleImg.width / pzlSize.columns,
            puzzleImg.height / pzlSize.rows,
            this.x,
            this.y,
            this.width,
            this.height);

        context.rect(this.x,this.y,this.width,this.height);
        context.stroke();
    }
}

window.onload = function() {    
    $( "#dialog" ).hide();
    canvas = document.getElementById("puzzleCanvas");
    canvas.width = pzlSize.width + 200;
    canvas.height = pzlSize.height + 200;
    context = canvas.getContext("2d");
    addEventListeners();
    correctCount = 0;

    randomImg();
    pzlSize.x = pzlPosition.x;
    pzlSize.y = pzlPosition.y;
    initPieces();
    updateCanvas();
    randomPieces();

    $('#genBtn').on('click',runGame);
    // 
    $('#seeBtn').on('click', function(){
        $( "#pzlPic" ).attr("src",puzzleImg.src);
        $( function() {
            $( "#dialog" ).dialog({width: 545, modal: true, });
          } );
    });
    return;
}



function runGame() {
    correctCount = 0;

    randomImg();
    pzlSize.x = pzlPosition.x;
    pzlSize.y = pzlPosition.y;
    initPieces();
    updateCanvas();
    randomPieces();
}

function addEventListeners() {
    canvas.addEventListener("mousedown",onMouseDown);
    canvas.addEventListener("mousemove",onMouseMove);
    canvas.addEventListener("mouseup",onMouseUp);
    canvas.addEventListener("touchstart",onTouchStart);
    canvas.addEventListener("touchmove",onTouchMove);
    canvas.addEventListener("touchend",onTouchEnd);
}

function onTouchStart(event) {
    let loc = {x:event.touches[0].clientX,
                y:event.touches[0].clientY};
    onMouseDown(loc);  
}

function onTouchMove(event) {
    let loc = {x:event.touches[0].clientX,
                y:event.touches[0].clientY};
    onMouseMove(loc);  
}

function onTouchEnd(event) {
    onMouseUp();
}

function onMouseDown(event) {
    selectedPiece = getPressedPiece(event);
    if (selectedPiece != null) {
        for (var i = 0; i < board.length; i++) {
            if (selectedPiece.x == board[i].x &&
                selectedPiece.y == board[i].y &&
                board[i].occupied == 1) {
                    board[i].occupied = 0;
                    if (board[i].correct == 1) {
                        board[i].correct = 0;
                        correctCount--;
                        $('#score').text("Score: " + correctCount);
                    }
            }
        }
        selectedPiece.offset = {
            x:event.x - selectedPiece.x,
            y:event.y - selectedPiece.y
        }
    }
}

function onMouseMove(event) {
    if (selectedPiece != null) {
        const index = pieces.indexOf(selectedPiece);
        if (index > -1) {
            pieces.splice(index, 1);
            pieces.push(selectedPiece);
        }
        selectedPiece.x = event.x - selectedPiece.offset.x;
        selectedPiece.y = event.y - selectedPiece.offset.y;
    }
}

function onMouseUp() {
    for (var i = 0; i < board.length; i++) {
        if (selectedPiece.x + selectedPiece.offset.x > board[i].x && 
            selectedPiece.x + selectedPiece.offset.x < board[i].x + board[i].width &&
            selectedPiece.y + selectedPiece.offset.y > board[i].y &&
            selectedPiece.y + selectedPiece.offset.y < board[i].y + board[i].height &&
            board[i].occupied == 0) {
                selectedPiece.x = board[i].x;
                selectedPiece.y = board[i].y;
                board[i].occupied = 1;
                if(selectedPiece.rowIndex == board[i].rowIndex &&
                    selectedPiece.colIndex == board[i].colIndex) {
                        correctCount++;
                        board[i].correct = 1;
                        $('#score').text("Score: " + correctCount);
                    }
            }
    }
    selectedPiece = null;

}

function getPressedPiece(loc) {
    for (var i = pieces.length - 1; i >= 0; i--) {
        if (loc.x > pieces[i].x && loc.x < pieces[i].x + pieces[i].width &&
            loc.y > pieces[i].y && loc.y < pieces[i].y + pieces[i].height) {
                return pieces[i];
            }
    }
    return null;
}

function updateCanvas() {
    context.clearRect(0,0,canvas.width,canvas.height);

    context.strokeRect(pzlPosition.x, pzlPosition.y,
                pzlSize.width, pzlSize.height);
    

    for (var i=0; i < pieces.length; i++) {
        pieces[i].draw(context);
    }
    window.requestAnimationFrame(updateCanvas);
    
}

function initPieces() {
    pieces = [];
    board = [];

    for(var i=0; i < pzlSize.rows; i++) {
        for(var j=0; j < pzlSize.columns; j++) {
            pieces.push(new Piece(i,j));
            board.push(new Piece(i,j));
        }
    }
}

function randomPieces() {
    for (var i = 0; i < pieces.length; i++) {
        let loc = {
            x:Math.random() * (canvas.width - pieces[i].width),
            y:Math.random() * (canvas.height - pieces[i].width)
        }
        pieces[i].x = loc.x;
        pieces[i].y = loc.y;
    }
}