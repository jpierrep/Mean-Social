import { Component,OnInit,DoCheck } from '@angular/core';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService]
})
export class AppComponent implements OnInit,DoCheck{
  public title = 'NG-SOCIAL';
  public identity;

  constructor(
    private _userService:UserService
  ){
    
  }

  ngOnInit(){
      this.identity=this._userService.getIdentity();
      console.log("el identity");
      console.log(this.identity);
  }
 // cada vez que se produzca un cambio en el componente
  ngDoCheck(){
    this.identity=this._userService.getIdentity();
  
  }

}
