
// FYI, this is just a sligthy modified version of this tutorial https://www.youtube.com/watch?v=rAUn1Lom6dw

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    var gameOverVar = false
    let nextRandom = 0
    let timerID
    let score = 0
    const colors = [
        '#02f0f1'
    ]

    console.log("hi there :D")
  
    //The Tetrominoes
  
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]
  
    const theTetrominoes = [iTetromino]
  
    let currentPosition = 4
    let currentRotation = 0
    
    //randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
  
    //draw the Tetromino
    function draw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
      })
    }
  
    //undraw the Tetromino
    function undraw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
  
      })
    }
  
    //assign functions to keyCodes
    function control(event) {
        if (event.keyCode == 32) {
            if (timerID) {
                clearInterval(timerID)
                timerID = null
            } else {
                draw()
                timerID = setInterval(moveDown, 1000)
                nextRandom = Math.floor(Math.random()*theTetrominoes.length)
                displayShape()
            }
        }

        if (timerID) {
            if (!gameOverVar) {
                if(event.keyCode === 37) {
                    moveLeft()
                } else if (event.keyCode == 38) {
                    rotate()
                } else if (event.keyCode == 39) {
                    moveRight()
                } else if (event.keyCode == 40) {
                    moveDown()
                }
            }
        }
    }
    document.addEventListener('keydown', control)
  
    //move down function
    function moveDown() {
      undraw()
      currentPosition += width
      draw()
      freeze()
    }
  
    //freeze function
    function freeze() {
      if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
      }
    }
  
    //move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft() {
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
      if(!isAtLeftEdge) currentPosition -=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
      }
      draw()
    }
  
    //move the tetromino right, unless is at the edge or there is a blockage
    function moveRight() {
      undraw()
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
      if(!isAtRightEdge) currentPosition +=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
      }
      draw()
    }
  
    
    ///FIX ROTATION OF TETROMINOS A THE EDGE 
    function isAtRight() {
      return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
    
    function isAtLeft() {
      return current.some(index=> (currentPosition + index) % width === 0)
    }
    
    function checkRotatedPosition(P){
      P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
      if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
        if (isAtRight()){            //use actual position to check if it's flipped over to right side
          currentPosition += 1    //if so, add one to wrap it back around
          checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
          }
      }
      else if (P % width > 5) {
        if (isAtLeft()){
          currentPosition -= 1
        checkRotatedPosition(P)
        }
      }
    }
    
    //rotate the tetromino
    function rotate() {
      undraw()
      currentRotation ++
      if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
        currentRotation = 0
      }
      current = theTetrominoes[random][currentRotation]
      checkRotatedPosition()
      draw()
    }
    /////////
  
    
    
    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
  
  
    //the Tetrominos without rotations
    const upNextTetrominoes = [
      [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]
  
    //display the shape in the mini-grid display
    function displayShape() {
      //remove any trace of a tetromino form the entire grid
      displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
      })
      upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
      })
    }
  
    //add functionality to the button
    startBtn.addEventListener('click', () => {
      if (timerID) {
        clearInterval(timerID)
        timerID = null
      } else {
        draw()
        timerID = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
      }
    })
  
    //add score
    function addScore() {
      for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
  
        if(row.every(index => squares[index].classList.contains('taken'))) {
          score += 1
          scoreDisplay.innerHTML = score
          row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
          })
          const squaresRemoved = squares.splice(i, width)
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
        }
      }
    }
  
    //game over
    function gameOver() {
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        gameOverVar = true
        alert("gameover! press f5 to restart lmfao")
        clearInterval(timerID)
      }
    }
  
  })
  