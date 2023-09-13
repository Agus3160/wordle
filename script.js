let diccionario = ['APPLE', 'HURLS', 'WINGS', 'YOUTH', 'SPIDERMAN', 'COMIC', 'CURE', 'DESTRUCTION', 'CHAYANNE']
const palabra = diccionario[Math.floor(Math.random() * diccionario.length)];

/********************************* V A R I A B L E S **********************************************/
//Guarda el elemento boton y se le carga la funcion de intentar, para poder jugar.
const button = document.getElementById("guess-button");
button.addEventListener("click", intentar);

//Guarda el elemento boton de ayuda y se le carga la funcion de obtener ayuda, para obtener una letra al azar de la fila actual
const helpButton = document.getElementById('get-help-button')
helpButton.addEventListener('click', (e)=>{obtenerAyuda(e)})

//Guarda el elemento input donde el usuario ingresa la palabra y se configura para que al presionar enter, el intento se de
const input = document.getElementById('guess-input')
input.addEventListener('keypress', (e) =>{   
    if(e.key === 'Enter'){
        intentar()
    }
})

const spanRows = [] //Guarda en un array, los Node List de cada fila.
let intentos = 4    //Los intentos que posse el usuario, son representados por la cant de filas que hay en pantalla
let fila = 0        //La fila en la cual se encuentra el usuario actualmente.

/******************************* F U N C I O N E S **********************************************/
//Permite cargar las filas en pantalla cuando la pagina es cargada totalmente
window.onload = rellenarSpan(palabra)
function rellenarSpan(palabra){
    const GRID = document.getElementById("grid"); //Se accede al div Grid
    
    //Se generan filas igual a la cant de intentos que tiene el usuario
    for(let j = 0; j<intentos; j++){
        const ROW = document.createElement('div');
        ROW.setAttribute('class', `row`);
        //Se generan la cant. de span igual a la cant. de letras de la palabra
        for (let i in palabra){
            const SPAN = document.createElement('span');
            SPAN.className = 'letter';
            SPAN.innerHTML = ' '
            SPAN.style.backgroundColor = 'grey';
            ROW.appendChild(SPAN)
        }
        GRID.appendChild(ROW)   //Se agrega la fila al div Grid
        spanRows.push(ROW.childNodes)   //Se agrega el Node List de cada fila al array.
    }
}

//Permite al usuario intentar adivinar la palabra
function intentar(){
    const INTENTO = leerIntento()           //Se obtiene la palabra utilizada por el usuario
    if(!esIntentoValido(INTENTO)) return    //Se verifica si la palabra ingresada es valida
    let celda = null                        //Variable donde se guarda la celda 
    let contadorAcertadas = 0               //Variable que indica la cant de palabras acertadaas
    //Se verifica letra por letra y se modifican las casillas correspondientes
    for (let i in palabra){     
        celda = spanRows[fila][i]
        if (INTENTO[i]===palabra[i]){   
            celda.innerHTML = INTENTO[i];
            celda.style.backgroundColor = 'rgb(28, 145, 50)';  //Caso Verde
            contadorAcertadas++ //La cant. de palabras acertadas incrementa
        } else if( palabra.includes(INTENTO[i]) ) { 
            celda.innerHTML = INTENTO[i];
            celda.style.backgroundColor = 'rgb(175, 175, 36)';  //Caso Amarillo
        } else {    
            celda.innerHTML = INTENTO[i];
            celda.style.backgroundColor = 'grey';               //Caso Gris
        }
    }
    //En caso de haber acertado a la palabra o de faltar solo una letra, la ayuda se deshabilita
    if(contadorAcertadas >= palabra.length-1){
        helpButton.disabled = true
    }
    //Si la palabra es acertada, el usuario gana
    if (INTENTO === palabra ) {
        document.body.setAttribute('class', 'win-animation')
        terminar("<h2>GANASTE!😀</h2>")
        return
    }
    //En caso de fallar, los intentos disminuyen y la fila es movida a la sgte.
	intentos--
    fila++
    //Si los intentos llegan a 0, el usuario pierde
    if (intentos==0){
        document.body.setAttribute('class', 'lost-animation')
        terminar("<h2>PERDISTE!😖</h2>")
    }
}

//Verificar si el intento del usuario es valido y desplegando un mensaje por pantalle en caso de no serlo
function esIntentoValido(intento){
    if(intento.length == palabra.length) return true    //En caso de ser valida la palabra, entonces devulve true
    
    //Se obtiene el div de mensajes y se refresca su contenido:
    MSG_DIV = document.getElementById('message-div')    
    MSG_DIV.innerHTML = ''

    //Creamos y modificamos el elmento p del mensaje, dependiendo del error:
    ERR_MSG_ELEMENT = document.createElement('p')
    if(intento.length < palabra.length){
        ERR_MSG_ELEMENT.innerText = ("La palabra es mas larga")
    }else if(intento.length > palabra.length){
        ERR_MSG_ELEMENT.innerText = ("La palabra es mas corta")
    }

    //Creamos y modificamos el boton del mensaje de error
    ERR_BUTTON = document.createElement('img')
    ERR_BUTTON.setAttribute('src', './img/1200px-Flat_cross_icon.svg.png')
    ERR_BUTTON.onclick = ()=>{displayNoneElement(MSG_DIV)}
    
    MSG_DIV.appendChild(ERR_MSG_ELEMENT)    //Se agrega el mensaje
    MSG_DIV.appendChild(ERR_BUTTON)         //Se agrega el boton
    MSG_DIV.style.display = 'flex'          //Se despliega el mensaje
    MSG_DIV.setAttribute('class', 'message-div-error')  //Se le asigna la clase para su diseño
    return false    //Retorna false puesto que el intento es invalido
}

//Funcion que se llama al terminar el juego y despliega un mensaje por pantalla
function terminar(mensaje){
    //Se deshabilitan los inputs:
    input.disabled = true
    button.disabled = true
    helpButton.disabled = true

    let MSG_DIV = document.getElementById('message-div')//Se obtiene el div de mensajes
    MSG_DIV.setAttribute('class', '')                   //Se quita su clase
    input.value = ""                                    //Se vacia el campo de texto
    MSG_DIV.innerHTML = mensaje;                        //Se despliega el mensaje
    MSG_DIV.style.display = 'flex'
}

//Retorna lo escrito como intento del usuario
function leerIntento(){
    let intento = document.getElementById("guess-input");
    intento = intento.value;
    intento = intento.toUpperCase(); 
    return intento;
}

//Permite obtener una letra de la fila actual como pista, solo puede usarse una vez
function obtenerAyuda(e){
    let posRandom = Math.floor(Math.random() * spanRows[fila].length)
    let celda = spanRows[fila][posRandom]
    //Si es un intento mayor al primero, se verifica que la ayuda no sea en una letra ya acertada
    if(fila > 0){
        while(spanRows[fila-1][posRandom].style.backgroundColor == 'rgb(28, 145, 50)'){
            posRandom = Math.floor(Math.random() * spanRows[fila].length)
        }
    }
    //Se obtiene el span y se rellena con la letra correcta y se configura su estilo
    celda = spanRows[fila][posRandom]
    celda.innerHTML = palabra[posRandom]
    celda.style.backgroundColor = 'rgb(28, 145, 50)';

    e.target.disabled = true    //La opcion ayuda solo puede ser usada una sola vez por palabra
}

//Funciion auxiliar que permite quitar de la vista un elemento
function displayNoneElement(e){
    e.style.display='none'
}