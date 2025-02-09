//Aquí irán la definición de las variables desde las que podremos acceder al html: a elementos del DOM
//para ello podremos usar querySelector(selector) o getElementById / getElementsByClassName / getElementsByTagName

const start = document.querySelector("#start");
const startForm = document.querySelector("#start-form");
const players = document.querySelector(".players");
const buttons = document.querySelectorAll(".cell");
const grid = document.querySelector("#grid");
const clear = document.querySelector("#clear")
const playersScore = document.querySelector(".players-score");
const score1 = document.querySelector(".score-1");
const score2 = document.querySelector(".score-2");
let numberOfPlays = 0; //contador cada vez que se hace click en un botón, si es par en el grid se añadirá una cosa, si es impar otra
let results = [[0,0,0],[0,0,0],[0,0,0]];
let score = JSON.parse(localStorage.getItem("score"))||[0,0]; //definimos score como si fueran daros guradados del localStorage o si no hay en su defecto [0,0]

//Aquí añadiremos las funciones necesarias para que el juego funcione

const startGame = (e) =>{
    e && e.preventDefault();   //todos los formularios recargan la página, con esto lo evitamos, por si a caso aún que no haya un form
    startForm.classList.add('inv'); //al empezar la partida añadimos a start la clase inv para que no se muestre
    players.classList.remove('inv');
    grid.classList.remove('inv');
    clear.classList.remove('inv');
    playersScore.classList.remove('inv');
    score1.innerHTML = `Player ⭕: ${score[0]}`;
    score2.innerHTML = `Player ❌: ${score[1]}`;

}

const addPiece = (element, x, y) => {
    if (results[x - 1][y - 1] !== 0) return; // Evita sobreescribir jugadas

    if (numberOfPlays % 2 === 0) { //si la jugada es par entonces añade 1 a la matriz(tablero)
        element.textContent = "⭕";
        results[x - 1][y - 1] = 1;
    } else {
        element.textContent = "❌"; //si la jugada es impar entonces añade 2 a la matriz(tablero)
        results[x - 1][y - 1] = 2;
    }

    element.classList.add("taken"); // Añade la clase para deshabilitar clics
    numberOfPlays++; //contador de jugadas realizadas
    winnerOrLooser(); //llama a la función que comprueba quien ha ganado
};

// Evento para cada celda
buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
        const x = Math.floor(index / 3) + 1;  //la fila en la que está la celda, se obtiene usando Math.floor(index/3) + 1, que convierte el índice en una coordenada de fila.
                                            //Si el índice es 0, x será 1 (primer fila); si es 3, x será 2 (segunda fila), etc.
        const y = (index % 3) + 1;          //La columna en la que está la celda. Se obtiene usando (index % 3) + 1, que toma el índice de la celda y calcula la columna correspondiente.
                                            //Si el índice es 0, y será 1 (primera columna); si es 1, y será 2 (segunda columna), etc.
        
        addPiece(this, x, y); //el this se refiere al elemento DOM que ha sido clickeado, en este caso, a la celda en la que el jugador ha hecho clic.
    });
});

const winnerOrLooser = () =>{

    let win = false;
    let player = 0;
    //comprobar si ha hecho 3 en raya o no, cada vez que se añadee una ficha se debe comprobar que los botones no contengan carácteres iguales alineados de cualquier forma
    //comporbación de filas y columnas
    for(let i = 0; i <= 2; i++){
        if((results[i][0] === results[i][1] && results[i][0] === results[i][2])&& results[i][0] != 0){
            win = true;
            player = results[i][0];
            break;
        }
        else if((results[0][i] === results[1][i] && results[0][i] === results[2][i])&& results[0][i] != 0){
            win = true;
            player = results[0][i];
            break;
        }
    }

    //Comprobación de diagonales
    if((results[0][0] === results[1][1] && results[0][0] === results[2][2])&& results[0][0] != 0 ){
        win = true;
        player = results[0][0];
    }
    else if((results[0][2] === results[1][1] && results[0][2] === results[2][0])&& results[0][2] != 0){
        win = true;
        player = results[0][2];
    }

    //comporbación de empate
    let counter = 0; 
    results.forEach((array)=>{
    const newArray = array.filter(function (number){
            return number === 0; //filtramos los 0 en el array, si no hay 0 es que se han puesto todas las piezas
        })

        if(newArray.length === 0){ //si en el array no hay 0, es decir todo el array son 1 y 2 entonces añade 1 al contador
            counter += 1;
        }
    })

    //dentro de la función winnerOrLooser parte del código que devuelve quién ha ganado
    
    if(counter === 3 || win === true ){ //si los 3 arrays dentro del array están llenos, la partida ha acabado 
        document.querySelector("#restart").classList.remove("inv"); 
        console.log(player);
// document.querySelectorAll(".cell").disabled = true; no se puede usar porque devuelve un  NodeList, que es como un array, y no puedes deshabilitarlo directamente. 
        buttons.forEach(button => { //hay que usar un forEach para recorrer el array de botones y deshabilitarlos 1 por 1
            button.classList.add("disabled"); // Agrega la clase para deshabilitar clics
        });

        if(player === 1){
            document.querySelector('.player1').classList.remove('inv');
            score[0] += 1;
            console.log(score);
            score1.innerHTML = `Player ⭕: ${score[0]}`;
        } 
        else if (player === 2){
            document.querySelector('.player2').classList.remove('inv');
            score[1] += 1;
            console.log(score);
            score2.innerHTML = `Player ❌: ${score[1]}`;
        } else{
            document.querySelector('.tie').classList.remove('inv');
        }
        localStorage.setItem("score", JSON.stringify(score)); //se actualiza el valor asociado a la key "taskArray" 
    }
    
}

//función para resetear la partida
const reset = ()=>{
    location.reload();
};

//añadiremos aquí los addEventListeners, llaman a las funciones necesarias al interactuar con el dom

start.addEventListener('click', startGame); //cuando clickamos en start, empezará la aprtida
clear.addEventListener('click', ()=>{
    localStorage.removeItem("score");
    score1.innerHTML = `Player ⭕: ${0}`;
    score2.innerHTML = `Player ❌: ${0}`;
})
//añadir addEventListener para cada botón dentro del grid
buttons.forEach((button, index)=>{
    button.addEventListener('click', function(){
        button.disabled = true; //al clickarlo que se deshabilite el botón 
        switch (index){
            case 0: 
                addPiece('.grid11', 1, 1);
                break;
            case 1: 
                addPiece('.grid12', 1, 2);
                break;
            case 2: 
                addPiece('.grid13', 1, 3);
                break;
            case 3: 
                addPiece('.grid21', 2, 1);
                break;
            case 4: 
                addPiece('.grid22', 2, 2);
                break;
            case 5: 
                addPiece('.grid23', 2, 3);
                break;
            case 6: 
                addPiece('.grid31', 3, 1);
                break;
            case 7: 
                addPiece('.grid32', 3, 2);
                break;
            case 8: 
                addPiece('.grid33', 3, 3);
                break;
        }
    })
})

/* grid.addEventListener('click', function(event){
    if(event.target.classList.contains("cell")){
        addPiece();
    }
}) */