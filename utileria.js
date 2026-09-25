function validarCorreo(c) {
    let correo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return correo.test(c);
}

function solo_letras(palabra){
    let soloLetras =  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return soloLetras.test(palabra);
}

function validarLongitud(entrada,longitud){
    return entrada.toString().length === Number(longitud);
}

function calcularEdad(fechaNacimiento_e){
    let fechaNacimiento = new Date(fechaNacimiento_e);
    let fechaActual = new Date();

    let edad= fechaActual.getFullYear()- fechaNacimiento.getFullYear();
    let mes= fechaActual.getMonth() -fechaNacimiento.getMonth();

    if(mes < 0 || (mes === 0 && fechaActual.getDate()< fechaNacimiento.getDate())){
        edad--;
    }
    return edad;
}

function esMayorEdad(edad){
    return calcularEdad(edad)>=18;
}

function validarPassword(e_password){
    let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;
    return password.test(e_password);
}

function validarCodigoPostal(e_cd_postal){
    let codigo_Postal = /^\d{5}$/;
}

function contarCaracteres(e_texto){
    return e_texto.length;
}

function contieneTexto(texto, palabra) {
    return texto.toLowerCase().includes(palabra.toLowerCase());
}

function solo_numeros(entrada) {
    let soloNumeros = /^\d+$/;
    return soloNumeros.test(Number(entrada));
}

function validarTelefono(e_telefono) {
   

    let telefono = e_telefono.toString();
    if (telefono.substring(0, 2) === "55") {
        return telefono+"es de: Ciudad de México (CDMX)";
    }

    if (telefono.substring(0, 3) === "442" || telefono.substring(0, 3) === "446") {
        return  telefono+"es de: Querétaro" ;
    }

    if (telefono.substring(0, 3) === "951") {
        return telefono+"es de: Oaxaca" ;
    }

    return "No se identifica la LADA del número";
}

