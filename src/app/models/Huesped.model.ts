export interface HuespedRequest{
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    email: string,
    telefono: string,
    tipoDocumento: string,
    numeroDocumento: string,
    nacionalidad: string

}

export interface HuespedResponse{
    id: number,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    email: string,
    telefono: string,
    tipoDocumento: string,
    numeroDocumento: string,
    nacionalidad: string,
    estadoRegistro: string

}