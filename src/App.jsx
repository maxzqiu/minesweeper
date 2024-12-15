import "./cell.css";
import {useState} from 'react'
import {useRef} from 'react'

// homework: 1. if there are 0 neighbors, we don't want to display anything
// 2. mines might overlap, when we set the bomb, we didn't check if a bomb was already there

// next week: Hidden and Flagged props in JSON 

function Cell({onContextMenu,onClick, state}){
  let className="cell" 
  if (state.isHidden===true){
    className="cell hidden"
  }
  return (
    // Ternary chaining: if elif then...
  <div className={className}  onClick={onClick} onContextMenu={onContextMenu}> 
  {
    state.isFlagged
    ? " 🚩 "
    : state.isHidden
    ? ""
    : state.isMine
    ? "B"
    : state.neighbors == 0 
    ? "":state.neighbors}

  </div> );
}

function Board({ nrows, ncols, nmines }) {
  // let toggle99=false
  let [tiledRevealed,setTiledRevealed]=useState(false)
  let [minesLeft,setMinesLeft]=useState(nmines)
  let [rules,setRules]=useState(false)
  let [isGameOver,setIsGameOver] = useState(false);
  let [board, setBoard] = useState(initBoard());
  // returns a list of indices of neighbors of board [x][y]
  function neighbors(x,y){
    let cells=[];
    for (let dx of [-1,0,1]){
      for (let dy of [-1,0,1]){
        let i=x+dx;
        let j=y+dy
        if (0 <= i && i <nrows && 0 <= j && j <ncols){ // not backwards arrow notation! it is less than or equal sign
          cells.push([i,j])
        }
      }
    }
      return cells 

  }
 
  // Initialize `nrows` by `ncols` board with `nmines` mines
  function initBoard() {
    const board = [...Array(nrows).keys()].map(i => (
      [...Array(ncols).keys()].map(j => null)
    ));
 
    for (let i = 0; i < nrows; i += 1) {
      for (let j = 0; j < ncols; j += 1) {
        board[i][j] = {
          pos: [i, j],
          isMine: false,
          neighbors: 0,
          isFlagged:false,
          isHidden:true,
        }
      }
    
    }
    // Set neighbors

    // function chooseBombs(){
    //   let x = Math.floor(Math.random() * nrows) // random number from 0 to nrows
    //   let y = Math.floor(Math.random() * ncols) // random number from 0 to ncols
    //   return [x,y]
    // }
    
    // let mine_positions=[]
    // Sorry my code is very complicated.
    // It probably isn't (not even close) the fastest way to do the job.
    // for (let i = 0; i < nmines; i += 1) {
    //   let bombPositions=chooseBombs()
    //   for (let j=0;j<mine_positions.length;j+=1){
    //     if (mine_positions[j]===bombPositions){
    //       for (let k=0;k<5;k+=0){
    //         check=0
    //         bombPositions=chooseBombs()
    //         for (let l=0;l<mine_positions.length;l+=1){
    //           if (mine_positions[l]!==bombPositions){
    //             check+=1
    //           }
    //           if (check===mine_positions.length){
    //             break
    //           }
    //         }
    //       }
    //     }
    //   }
    //   console.log(bombPositions)
    //   board[parseInt(bombPositions[0]),parseInt(bombPositions[1])].isMine = true;
    //   for (let [xn,yn] of neighbors(bombPositions[0],bombPositions[1])){
    //     board[xn][yn].neighbors+=1;
    //   }
    // }
 
    // console.log(board);
    let mines_remaining=nmines
    while (mines_remaining>0){
      let x = Math.floor(Math.random() * nrows); // random number from 0 to nrows
      let y = Math.floor(Math.random() * ncols); // random number from 0 to ncols
      if (board[x][y].isMine===true){ // continue will break out of while loop, but continue on next one
        continue;
      }
      
      board[x][y].isMine = true;

      for (let [xn, yn] of neighbors(x, y)) {
        board[xn][yn].neighbors += 1;
      }
      mines_remaining-=1
    }
    
    return board;  
      

  }
 
  // [...Array(10).keys()]
  // List of [0 to 9]

  // Game over when you click on a bomb
  // - Reveals position of all bombs


  function reveal(i,j){
    if (!tiledRevealed){
      while (board[i][j].isMine){
        board=initBoard()
      }
    }
    setTiledRevealed(true)
    if (board[i][j].isFlagged===true || !board[i][j].isHidden){
      return;
    }
    board[i][j].isHidden=false;
    if (board[i][j].isMine) {
      gameOver();
    }
    setBoard([...board])
    if (board[i][j].neighbors==0){ // flood-fill ideas 
      for (let[x,y] of neighbors(i,j)){
        reveal(x,y) // recursion!!!! :D :D :D
      }
    }
  }
  function toggleFlag(i,j){
    if (board[i][j].isFlagged){
      null
    } else if (minesLeft===0){
      return;
    }
    
    board[i][j].isFlagged=!(board[i][j].isFlagged) // sets board to the other true/false.
    if (board[i][j].isFlagged){
      setMinesLeft(minesLeft-1)
    } else {
      setMinesLeft(minesLeft+1)
    }
    setBoard([...board])
  }

  // function displayRules(){
  //   console.log(rules)
  //   console.log("Hi")
  //   if (rules===true){
      
  //     toggle99=true;
  //     console.log("Max")
  //   } else{
  //     toggle99=false;
  //     console.log("Eric")
  //   }
  //   console.log(toggle99)
  // }

   function gameOver(){
     for (let i = 0; i < nrows; i += 1) {
       for (let j = 0; j < nrows; j += 1) {
         board[i][j].isHidden=false;
       }
     }
     setIsGameOver(true);

  }
  // let rules1=<h3>How to Play</h3>
  // let rules2=<p>Click on the squares to reveal how many bombs it has neighboring it</p>
  // let rules3=<p>But be careful! Bombs are placed across the board. If you think there is a bomb there, flag it by right click. </p>
  // let rules4=<p>You lose when you click on a bomb. You win when you have successfully identified all bombs and revealed all other squares</p>
  
  return (
    <div className="board-container">
    <p>Flags Remaining: {minesLeft}</p>
    {board.map((row, i) => (
      <div className="row" key={i}>
        {row.map((state, j) => <Cell 
        key={j} 
        onClick={(e)=>{
          e.preventDefault();
          reveal(i,j)
        }} 
        onContextMenu={(e)=>{
          e.preventDefault();
          toggleFlag(i,j);
        }} 

        state={state} />)}
      </div>
  ))}
  {
    isGameOver
      ? <button onClick={()=>{setIsGameOver(false); setBoard(initBoard()); setMinesLeft(7)}}>Reset</button> 
      :<></>}
  {/* <button onClick={()=>{rules ? setRules(false): setRules(true);displayRules()}}>Toggle Rules</button>
  {console.log(toggle99)}
  {
    toggle99
      ? console.log("Displayed!"):console.log("Not Displayed")} */}
  </div>
  )
}
function App(){
   // modal.current = the <dialog> element
  // document.querySelector("dialog")
  const modal = useRef();
   //AAAAAAAAAAaaaaaAAAAaaaAaaaaa
  const [settings, setSettings] = useState({
    nrows: 8,
    ncols: 10,
    nmines: 10,
  });

  const onSubmit = (e) => {
    e.preventDefault();

    // Parse into an integer
    // Verify that everything is a postiive number
    for (let key in settings) {
      settings[key] = parseInt(settings[key]);
      if (isNaN(settings[key]) || settings[key] < 1) {
        alert(key + " < 1");
        return;
      }
    }

    // Make sure the mines fit into the board
    if (settings.nmines >= settings.nrows * settings.ncols) {
      alert("Too many mines! Board size is not big enough.");
      return;
    }

    console.log(settings);
    setSettings({ ...settings });
  };

  const setInput = (name) => (e) => {
    settings[name] = e.target.value;
  };

  return (
    <>
    <h1>MINESWEEPER</h1>
    <h3>By Eric and Max</h3>
      <form onSubmit={onSubmit}>
        <label htmlFor="nrows"> Number of Rows: </label>
        <input type="number" id="nrows" onChange={setInput("nrows")} />

        <label htmlFor="ncols"> Number of Cols: </label>
        <input type="number" id="ncols" onChange={setInput("ncols")} />

        <label htmlFor="nmines"> Number of Mines: </label>
        <input type="number" id="nmines" onChange={setInput("nmines")} />

        <input type="submit" value="submit" />
      </form>

      <Board
        key={Date.now() /* Or replace with `counter += 1` */}
        nrows={settings.nrows}
        ncols={settings.ncols}
        nmines={settings.nmines}
      />
      <dialog ref={modal}>
        <p>
          Minesweeper is a game where mines are hidden in a grid of squares.
          Safe squares have numbers telling you how many mines touch the square.
          You can use the number clues to solve the game by opening all of the
          safe squares. If you click on a mine you lose the game!
        </p>
        <p>
          Windows Minesweeper always makes the first click safe. You open
          squares with the left mouse button and put flags on mines with the
          right mouse button. Pressing the right mouse button again changes your
          flag into a questionmark. When you open a square that does not touch
          any mines, it will be empty and the adjacent squares will
          automatically open in all directions until reaching squares that
          contain numbers. A common strategy for starting games is to randomly
          click until you get a big opening with lots of numbers.
        </p>
        <p>
          If you flag all of the mines touching a number, chording on the number
          opens the remaining squares. Chording is when you press both mouse
          buttons at the same time. This can save you a lot of work! However, if
          you place the correct number of flags on the wrong squares, chording
          will explode the mines.
        </p>
        <form method="dialog">
          <button>x</button>
        </form>
      </dialog>
      <button onClick={() => modal.current.showModal()}>Show the instuctions</button>
    </>
  );
}

// function App(){ //AAAAAAAAAAaaaaaAAAAaaaAaaaaa
//   let [showModal,setshowModal]=useState(false);
//   return (
//     <>
//       <h1 className="title">MINESWEEPER!</h1>
//       <h3>By Eric and Max</h3>
      
//       <Board nrows={7} ncols={7} nmines={7}></Board>
//       {showModal // You can replace with &&
//         ? <dialog open>
//             <p>Greetings, one and all!</p>
//             <form method="dialog">
//               <button>OK</button>
//             </form>
//           </dialog>: <></>}
//       <button onClick={()=>setshowModal(!showModal)}>Show the dialog</button>
      
      
//       <p><b>How to Play:</b></p>
//       <p>Click on the boxes to reveal how many bombs it neighbors. </p>
//       <p>Be careful though! If you click on a bomb, you lose</p>
//       <p>If you believe there is a bomb in a cell, flag it by right clicking.</p>
//     </>
      

// )
// }

// I'm dumb
export default App

