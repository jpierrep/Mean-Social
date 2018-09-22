export class User{

    //si defino propiedad en constructor me evito tener que definirla
    //me evito tener que inicializarla y asignarle valor
constructor(
    public _id:string,
    public text:string,
    public viewed:string,
    public created_at:string,
    public emitter:string,
    public receiver:string,
){}

}