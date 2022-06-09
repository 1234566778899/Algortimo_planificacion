class Proceso {
    constructor(letra, llegada, duracion) {
        this.letra = letra;
        this.llegada = llegada;
        this.duracion = duracion;
        this.finalizado = false;
        this.contador = 0;
        this.inicio = 0;
        this.fin = 0;
        this.empezo = false;
    }
    reiniciar() {
        this.finalizado = false;
        this.contador = 0;
        this.inicio = 0;
        this.fin = 0;
        this.empezo = false;
    }
}

let arr_procesos = [];
let ayudas = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P15'];
let ct = 0;
let q = 0;

function actualizar() {
    $('.fila').remove();
    for (let i = 0; i < arr_procesos.length; i++) {
        $('.procesos').append(`
        <tr class="fila">
        <td class="text-center">${arr_procesos[i].letra}</td>
        <td class="text-center">${arr_procesos[i].llegada}</td>
        <td class="text-center">${arr_procesos[i].duracion}</td>
        <td class="text-center"><button class="btn" id="eliminar"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`);
    }
}
document.querySelector('#letra').value = ayudas[ct];

function agregar() {
    let letra = document.querySelector('#letra').value;
    let llegada = parseInt(document.querySelector('#llegada').value);
    let duracion = parseInt(document.querySelector('#duracion').value);
    prop = new Proceso(letra, llegada, duracion);
    arr_procesos.push(prop);
    ct++;
    document.querySelector('#letra').value = ayudas[ct];
    actualizar();
}

function existe(arr, valor) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == valor) return true;
    }
    return false;
}

function indice(valor) {
    for (let i = 0; i < arr_procesos.length; i++) {
        if (arr_procesos[i].letra == valor) return i;
    }
    return -1;
}

function fin() {
    for (let i = 0; i < arr_procesos.length; i++) {
        if (!arr_procesos[i].finalizado) return false;
    }
    return true;
}
window.addEventListener('click', () => {
    let botones = document.querySelectorAll('#eliminar');
    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener('click', () => {
            arr_procesos.splice(i, 1);
            ct--;
            document.querySelector('#letra').value = ayudas[ct];
            actualizar();
        })
    }
})



function result() {
    for (let i = 0; i < arr_procesos.length; i++) {
        arr_procesos[i].reiniciar();
    }
    q = parseInt(document.querySelector('#quantum').value);
    let matriz = new Array(arr_procesos.length);

    for (let i = 0; i < arr_procesos.length; i++)
        matriz[i] = new Array(1000);

    for (let i = 0; i < arr_procesos.length; i++) {
        for (let j = 0; j < matriz[0].length; j++) {
            matriz[i][j] = -1;
        }
    }

    let cont = 0;
    let s = 0;
    let cola = [];
    let ultimo = '';

    while (true) {

        if (s >= q) {
            cola.splice(0, 1);
            s = 0;
        }
       
        arr_procesos.forEach(element => {
            if (element.llegada <= cont && !element.finalizado && element.letra != ultimo) {
                if (!existe(cola, element.letra)) {
                    cola.push(element.letra);
                }
            }
        });
        arr_procesos.forEach(element => {
            if (element.letra == ultimo && element.llegada <= cont && !element.finalizado) {
                if (!existe(cola, element.letra)) {
                    cola.push(element.letra);
                }
            }
        });
        let op = 0;
        for (let i = 0; i < cola.length; i++) {
            matriz[indice(cola[i])][cont] = op;
            op++;
        }
        if (cola.length > 0) {
            
             s++;
            ultimo = cola[0];
            arr_procesos[indice(cola[0])].contador += 1;
            if (!arr_procesos[indice(cola[0])].empezo) {
                arr_procesos[indice(cola[0])].inicio = cont;
                arr_procesos[indice(cola[0])].empezo = true;
            }
            if (arr_procesos[indice(cola[0])].contador >= arr_procesos[indice(cola[0])].duracion) {
                arr_procesos[indice(cola[0])].finalizado = true;
                arr_procesos[indice(cola[0])].fin = cont + 1;
                cola.splice(0, 1)
                s = 0;
            }
        }
        cont++;
        if (fin()) break;
    }


    let cadena = '';
    $('#robintable').html('');
    for (let i = 0; i < arr_procesos.length; i++) {
        cadena += `<td class="text-center">${arr_procesos[i].letra}</td>`;
        for (let j = 0; j < cont; j++) {
             for(let k=-1;k<arr_procesos.length;k++){
                if(matriz[i][j]==k && k==-1){
                    cadena += `<td class="text-white">1</td>`;
                }else if(matriz[i][j]==k && k==0){
                    cadena += `<td class="bg-primary text-white text-center">0</td>`;
                }else if(matriz[i][j]==k){
                    cadena += `<td class="text-center">${k}</td>`;
                }
            }
        }
        $('#robintable').append(`<tr>${cadena}</tr>`);
        cadena = "";
    }
    cadena += `<td class="sin-borde text-white">1</td>`;
    for (let i = 0; i < cont; i++) {
        cadena += `<td class="sin-borde">${i}</td>`;
    }
    $('#robintable').append(`<tr>${cadena}</tr>`);

    $('.resultado-robin').css('display', 'block');

}

function promedios() {
    $('#promedios-robin').css('display', 'block');
    $('body div.container,nav').css('opacity', '0.2');

    let suma1 = 0;
    let suma2 = 0;

    $('.filas-promedios').remove();

    for (let i = 0; i < arr_procesos.length; i++) {

        let a, b;
        if (arr_procesos[i].duracion <= q) {
            a = arr_procesos[i].inicio - arr_procesos[i].llegada;
        } else {
            a = arr_procesos[i].fin - arr_procesos[i].llegada - arr_procesos[i].duracion;
        }
        b = arr_procesos[i].fin - arr_procesos[i].llegada;

        suma1 += a;
        suma2 += b;

        $('.tabla-promedios').append(`
        <tr class="filas-promedios">
            <td class="text-center azul">${arr_procesos[i].letra}</td>
            <td class="text-center text-dark">${a}</td>
            <td class="text-center text-dark">${b}</td>
        </tr>`);
    }

    $('.tabla-promedios').append(`
        <tr class="filas-promedios">
            <td class="text-center azul">Tiempo promedio</td>
            <td class="text-center text-dark">${(suma1/arr_procesos.length).toFixed(2)}</td>
            <td class="text-center text-dark">${(suma2/arr_procesos.length).toFixed(2)}</td>
        </tr>`);

}

function esconder() {
    $('#promedios-robin').css('display', 'none');
    $('body div.container,nav').css('opacity', '1');
}
