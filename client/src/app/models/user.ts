export class User{

    //si defino propiedad en constructor me evito tener que definirla
    //me evito tener que inicializarla y asignarle valor
constructor(
    public name:string,
    public surname:string,
    public nick:string,
    public email:string,
    public password:string,
    public role:string,
    public image:string

){}

}