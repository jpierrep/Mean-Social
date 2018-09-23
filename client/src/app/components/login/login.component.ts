
import{Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';


@Component({
   selector:'login',
   templateUrl: './login.component.html',
   providers:[UserService]

})

export class LoginComponent implements OnInit{

     public title:string;
     public user:User;
     public status:string;
     public identity;
     public token;

constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService
){
    this.title="Identificate";
    this.user=new User(
        "",
        "",
        "",
        "",
        "",
        "ROLE_USER",
        ""
    );
    
}

ngOnInit(){
    console.log("componente cargaado");
}

onSubmit(){
    console.log(this.user);
    this._userService.signup(this.user).subscribe(
     response=>{
         if(response.user){
             console.log(response.user);
             this.identity=response.user;
             if(!this.identity||!this.identity._id){
                 this.status='error';
                }else{
             this.status='success';
             //Persistit datos del usuario
            localStorage.setItem('identity',JSON.stringify(this.identity));
             //conseguir el token de usuario
             this.getToken();
                }
           
         }else{
             this.status='error';
         }
     },error=>{
        console.log(<any>error);
        this.status='error';
     }

    );
}

getToken(){
    console.log(this.user);
    this._userService.signup(this.user,'true').subscribe(
     response=>{
         if(response){
             console.log(response.token);
             this.token=response.token;
             if(this.token.length<=0){
                 this.status='error';
                }else{
             this.status='success';
            
             //Persistit datos del token
             localStorage.setItem('token',JSON.stringify(this.token));

             //conseguir los contadores o estadisticas del usuario

                }
           
         }else{
             this.status='error';
         }
     },error=>{
        console.log(<any>error);
        this.status='error';
     }

    );
}

}
