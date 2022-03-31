var time = 0;
var levels = {
    easy: {
        id: 1,
        rows: 9,
        cols: 9,
        mins: 10
    },
    medium: {
        id: 2,
        rows: 16,
        cols: 16,
        mins: 40
    },
    hard: {
        id: 3,
        rows: 16,
        cols: 30,
        mins: 99
    }
}
var defaultLevel = 'easy';
var cells = [];
var safeCells = [];
var mineCells = null;
var rightClickFlag = 0;
var endGameFlag = true;
var flagMineCount=0;

function startGame() {
    rightClickFlag = 0;
    endGameFlag = false;
    flagMineCount = 0;
    timeValue=0;
    document.getElementById("timer").innerHTML = 0;
    document.getElementById("Mines").innerHTML = levels[defaultLevel]['mins'] - flagMineCount;
    document.getElementById("smiley").classList.remove('lose_flag');
    document.getElementById("smiley").classList.remove('face_win');
    buildGrid();
}

function buildGrid() {
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";
    this.cells = new Array(this.levels[this.defaultLevel]['rows']);   
    for (var i = 0; i < this.levels[this.defaultLevel]['rows']; i++ ) {
        this.cells[i] = new Array(this.levels[this.defaultLevel]['cols']);
    }
    var tile;
    for (var y = 0; y < this.levels[this.defaultLevel]['rows']; y++) {
        for (var x = 0; x < this.levels[this.defaultLevel]['cols']; x++) {
            tile = createTile(x,y, y*(this.levels[this.defaultLevel]['cols'])+x);
            grid.appendChild(tile);
            this.cells[y][x] = {
                tile: tile,
                y: y,
                x: x,
                covered: false,
                hasMine: false,
                numSurroundingMines: 0,
                flagStateIndex: 0
            }
            tile.addEventListener("auxclick", function(e) { e.preventDefault(); });
            tile.addEventListener("contextmenu", function(e) { e.preventDefault(); });
            tile.addEventListener("mouseup", handleTileClick);
            tile.addEventListener("mousedown", function onClick(){
                document.getElementById("smiley").classList.add('face_limbo');
            });
        }
    } 
    var style = window.getComputedStyle(tile);
    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    grid.style.width = (this.levels[this.defaultLevel]['cols'] * width) + "px";
    grid.style.height = (this.levels[this.defaultLevel]['rows'] * height) + "px";
}

function handleTileClick(event) {
    var y = Math.floor(event.target.id / (levels[defaultLevel]['cols']));
    var x = Math.floor(event.target.id % (levels[defaultLevel]['cols']));
    if(!endGameFlag)
    {
        if (event.which === 1) {
            if(!cells[y][x].covered){
                if(rightClickFlag === 0){
                    rightClickFlag = 1;
                    while(true){
                        layMines(x*y);
                        if(!cells[y][x].hasMine) break;
                        else{
                            for (var y1 = 0; y1 < levels[defaultLevel]['rows']; y1++) {
                                for (var x1 = 0; x1 < levels[defaultLevel]['cols']; x1++) {
                                    cells[y1][x1].hasMine = false;
                                }
                            }
                        }
                    }
                }
                if(cells[y][x].flagStateIndex === 0){
                    var around = [];
                    var i, k;
                    var dy = [-1, -1, -1, 0, 0, 1, 1, 1];
                    var dx = [-1, 0, 1, -1, 1, -1, 0, 1];
                    var cx, cy, minecount=0;

                    if(cells[y][x].hasMine)
                    {
                        cells[y][x].tile.classList.add('hit_flag');
                        cells[y][x].covered = true;
                        document.getElementById("smiley").classList.add('lose_flag');
                        endGameFlag = true;
                        for (var y1 = 0; y1 < levels[defaultLevel]['rows']; y1++) {
                            for (var x1 = 0; x1 < levels[defaultLevel]['cols']; x1++) {
                                if(!cells[y1][x1].covered)
                                {
                                    if(cells[y1][x1].flagStateIndex === 1){
                                        if(!cells[y1][x1].hasMine){
                                            cells[y1][x1].tile.classList.add('marked_flag');
                                        }
                                    }else{
                                        if(cells[y1][x1].hasMine){
                                            cells[y1][x1].tile.classList.add('mine_nothit_flag');
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        var selcel;
                        around.push(y);
                        around.push(x);
                        for(k=0; k<around.length; k+=2)
                        {
                            minecount = 0;
                            for(i=0;i<8;i++){
                                cy = around[k] + dy[i];
                                cx = around[k+1] + dx[i];
                                if(cy<0 || cx<0 || cy>=(levels[defaultLevel]['rows']) || cx >=(levels[defaultLevel]['cols'])) continue;
                                if(cells[cy][cx].covered) continue;
                                if(cells[cy][cx].hasMine) minecount++;
                            }
                            selcel = cells[around[k]][around[k+1]];
                            switch(minecount){
                                case 0: selcel.tile.classList.add('clear_flag');
                                        for(i=0;i<8;i++){
                                            cy = around[k] + dy[i];
                                            cx = around[k+1] + dx[i];
                                            if(cy<0 || cx<0 || cy>=(levels[defaultLevel]['rows']) || cx >=(levels[defaultLevel]['cols'])) continue;
                                            if(cells[cy][cx].covered) continue;
                                            around.push(cy); around.push(cx);
                                        }
                                        selcel.covered = true;
                                    break;
                                case 1: selcel.tile.classList.add('a1_flag'); selcel.covered = true; break;
                                case 2: selcel.tile.classList.add('a2_flag'); selcel.covered = true; break;
                                case 3: selcel.tile.classList.add('a3_flag'); selcel.covered = true; break;
                                case 4: selcel.tile.classList.add('a4_flag'); selcel.covered = true; break;
                                case 5: selcel.tile.classList.add('a5_flag'); selcel.covered = true; break;
                                case 6: selcel.tile.classList.add('a6_flag'); selcel.covered = true; break;
                                case 7: selcel.tile.classList.add('a7_flag'); selcel.covered = true; break;
                                case 8: selcel.tile.classList.add('a8_flag'); selcel.covered = true; break;
                            } 
                        }
                    }
                }
            }
        }
        else if (event.which === 3) {
            if(!cells[y][x].covered){
                if(cells[y][x].flagStateIndex === 0){
                    cells[y][x].tile.classList.add("mine_flag");
                    cells[y][x].flagStateIndex = 1;
                    flagMineCount++;
                    if(flagMineCount === levels[defaultLevel]['mins']){
                        var corectcount = 0;
                        for (var y1 = 0; y1 < levels[defaultLevel]['rows']; y1++) {
                            for (var x1 = 0; x1 < levels[defaultLevel]['cols']; x1++) {
                                if(cells[y1][x1].flagStateIndex === 1 && cells[y1][x1].hasMine === true) corectcount++;
                            }
                        }
                        if(corectcount === flagMineCount){
                            endGameFlag = true;
                            document.getElementById("smiley").classList.add('face_win');
                        }                        
                    }
                }else{
                    cells[y][x].tile.classList.remove("mine_flag");
                    cells[y][x].flagStateIndex = 0;
                    flagMineCount--;
                }
                document.getElementById("Mines").innerHTML = levels[defaultLevel]['mins'] - flagMineCount;
            }
        }
    }
    document.getElementById("smiley").classList.remove('face_limbo');
}

function layMines(v) {
    designateMineSpots(v);
    var numMines = levels[defaultLevel]['mins'];
    var i, rowCol, cell;
    for ( i = 0; i < numMines; i++ ) {
        rowCol = numToRowCol( mineCells[i] );
        cell = cells[ rowCol[1]-1 ][ rowCol[0]-1 ];          
        cell.hasMine = true;
    }
}

function numToRowCol(num){
    return [ Math.ceil(num/(levels[defaultLevel]['rows'])), (num % (levels[defaultLevel]['rows'])) || (levels[defaultLevel]['rows']) ];
}

function designateMineSpots(v) {
    safeCells = [];
    mineCells = [];
    var numCells = (levels[defaultLevel]['rows']) * (levels[defaultLevel]['cols']);
    while ( numCells-- ) {
        safeCells.push( numCells + 1 );
    }
    var numMines = levels[defaultLevel]['mins'];
    var randIndex;
    while ( numMines-- ) {
        randIndex = -~( Math.random() * safeCells.length ) - 1;
        if(v === randIndex){ numMines++; continue; }
        mineCells.push( safeCells[randIndex] );
        safeCells.splice( randIndex, 1 ); // remove cell from array of safe cells
    } 
}

function createTile(x,y,c) {
    var tile = document.createElement("div");
    tile.classList.add("tile");
    tile.classList.add("hidden");
    tile.setAttribute("id", c);
    return tile;
}

function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

function setDifficulty() {
    var smiley = document.getElementById("difficult");
    this.defaultLevel = smiley.value;
    startGame();
}

function startTimer() {
    timeValue = 0;
    window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    if(endGameFlag == false)
        document.getElementById("timer").innerHTML = timeValue;
}