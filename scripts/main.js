/* CREATION OF FUNCTIONS */

var xAxis = 40;
var yAxis = 25;
var cellCount = xAxis * yAxis;
var alive = true;
var dead = false;
var active = false;
var runGame = false;
var filler = dead;
var gameBoard = [];
var iteration = 0;
var iterationSpeed = 100;

var oneIterationButton;
var switchIterationButton;
var pauseIterationButton;
var resetIterationButton;
var clearFieldButton;

function CellFactory(id) {
    return {
        id          : id,
        $element    : null,
        initialGen  : dead,
        currentGen  : dead,
        nextGen     : dead,
        cellN       : null,
        cellNE      : null,
        cellE       : null,
        cellSE      : null,
        cellS       : null,
        cellSW      : null,
        cellW       : null,
        cellNW      : null,
    };
}

function CreateGameBoard() {
    for (var x = 0; x < cellCount; x++) {
        gameBoard[x] = CellFactory(x);
    }
    for (var x = 0; x < cellCount; x++) {
        gameBoard[x].cellW = (x % xAxis !== 0) ? gameBoard[x - 1] : gameBoard[x + xAxis - 1];
        gameBoard[x].cellE = (x % xAxis !== xAxis - 1) ? gameBoard[x + 1] : gameBoard[x - xAxis + 1];
        gameBoard[x].cellN = (x >= xAxis) ? gameBoard[x - xAxis] : gameBoard[cellCount - xAxis + x];
        gameBoard[x].cellS = (x < cellCount - xAxis) ? gameBoard[x + xAxis] : gameBoard[x - cellCount + xAxis];
        gameBoard[x].cellNW = (gameBoard[x].cellN.id % xAxis !== 0) ? gameBoard[gameBoard[x].cellN.id - 1] : gameBoard[gameBoard[x].cellN.id + xAxis - 1];
        gameBoard[x].cellNE = (gameBoard[x].cellN.id % xAxis !== xAxis - 1) ? gameBoard[gameBoard[x].cellN.id + 1] : gameBoard[gameBoard[x].cellN.id - xAxis + 1];
        gameBoard[x].cellSW = (gameBoard[x].cellS.id % xAxis !== 0) ? gameBoard[gameBoard[x].cellS.id - 1] : gameBoard[gameBoard[x].cellS.id + xAxis - 1];
        gameBoard[x].cellSE = (gameBoard[x].cellS.id % xAxis !== xAxis - 1) ? gameBoard[gameBoard[x].cellS.id + 1] : gameBoard[gameBoard[x].cellS.id - xAxis + 1];
    }
}

function applyFiller(element) {
    if (filler && $(element).hasClass('alive')) {
        $(element).removeClass('alive');
    }
    else if (!filler && !$(element).hasClass('alive')) {
        $(element).addClass('alive');
    }
}

function DrawGameBoard() {
    for (var x = 0; x < cellCount; x++) {
        $('.main').append('<div id="cell-' + gameBoard[x].id + '" class="cell" style="width: ' + (960/xAxis) + 'px; height: ' + (960/xAxis) + 'px;"></div>');
        gameBoard[x].$element = $('#cell-' + gameBoard[x].id);
        gameBoard[x].$element.hover(function (e) {
            if (!active) {
                $(this).addClass('hovered');
                if (e.which === 1) {
                    applyFiller(this);
                }
            }
        }, function (e) {
            if (!active) {
                $(this).removeClass('hovered');  
            }
        }).on('mousedown', function() {
            if ($(this).hasClass('alive')) {
                filler = alive;
            } else {
                filler = dead;
            }
            applyFiller(this);
        });
    }
    $('.main').append('<div class="clear"></div>');
}

function DefineButtons()    {
    oneIterationButton = document.getElementById('iterate-once');
    switchIterationButton = document.getElementById('switch-iteration');
    resetIterationButton = document.getElementById('reset-iteration');
    clearFieldButton = document.getElementById('clear-field');
    
    oneIterationButton.addEventListener('click', IterateGameBoard);
    switchIterationButton.addEventListener('click', SwitchIterating);
    resetIterationButton.addEventListener('click', ResetIterations);
    clearFieldButton.addEventListener('click', ClearField);
}

function SwitchIterating()   {
    if (active) {
        active = false;
        clearInterval(runGame);
    }
    else {
        active = true;
        runGame = setInterval(IterateGameBoard, iterationSpeed);
    }
    
    if (!active) {  
        $('#switch-iteration').text('START ITERATING');
    }
    else {
        $('#switch-iteration').text('STOP ITERATING');
    }
}

function ResetIterations()  {
    clearInterval(runGame);
    for (x = 0; x < cellCount; x++) {
        gameBoard[x].currentGen = gameBoard[x].initialGen;
        if (gameBoard[x].currentGen) {
            gameBoard[x].$element.addClass('alive');
        }
        else {
            gameBoard[x].$element.removeClass('alive');
        }
    }
    iteration = 0;
    active = false;
}

function ClearField()   {
    clearInterval(runGame);
    for (x = 0; x < cellCount; x++) {
        gameBoard[x].currentGen = dead;
        gameBoard[x].$element.removeClass('alive');
    }
    iteration = 0;
    active = false;
}

function CountNeighbors(x) {
    var liveNeighbors = 0;
    if (gameBoard[x].cellE.currentGen === alive)   {   liveNeighbors++;    }
    if (gameBoard[x].cellSE.currentGen === alive)     {   liveNeighbors++;    }
    if (gameBoard[x].cellS.currentGen === alive)   {   liveNeighbors++;    }
    if (gameBoard[x].cellSW.currentGen === alive)     {   liveNeighbors++;    }
    if (gameBoard[x].cellW.currentGen === alive)     {   liveNeighbors++;    }
    if (gameBoard[x].cellNW.currentGen === alive)   {   liveNeighbors++;    }
    if (gameBoard[x].cellN.currentGen === alive)     {   liveNeighbors++;    }
    if (gameBoard[x].cellNE.currentGen === alive)   {   liveNeighbors++;    }
                    
    if (liveNeighbors === 0 || liveNeighbors === 1)
    {return dead;}
    else if (liveNeighbors === 4 || liveNeighbors === 5 || liveNeighbors === 6 || liveNeighbors === 7 || liveNeighbors === 8)
    {return dead;}
    else if (liveNeighbors === 2 && gameBoard[x].currentGen === alive)
    {return alive;}
    else if (liveNeighbors === 3)
    {return alive;}
    else if (liveNeighbors === 2)
    {return dead;}
}

function IterateGameBoard() {
    for (x = 0; x < cellCount; x++) {
        if (gameBoard[x].$element.hasClass('alive')) {
            gameBoard[x].currentGen = alive;
        }
        else if (!gameBoard[x].$element.hasClass('alive')) {
            gameBoard[x].currentGen = dead;
        }
    }
    if (    iteration === 0) {
        for (x = 0; x < cellCount; x++) {
            gameBoard[x].initialGen = gameBoard[x].currentGen;
        }
    }
    for (x = 0; x < cellCount; x++)    {
         gameBoard[x].nextGen = CountNeighbors(x);
    }
    for (x = 0; x < cellCount; x++) {
        gameBoard[x].currentGen = gameBoard[x].nextGen;
        if (gameBoard[x].currentGen) {
            gameBoard[x].$element.addClass('alive');
        }
        else {
            gameBoard[x].$element.removeClass('alive');
        }
    }
    iteration++;
}

function Initialize() {
    CreateGameBoard();
    DrawGameBoard();
    DefineButtons();
}