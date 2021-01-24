import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ngOnInit(): void {
  }
  name:string;
  password:string;
  constructor(private rt:Router)
  {
  }
  validate()
  {
    if (this.name=="Admin" && this.password=="Admin")
    {
      this.rt.navigate(['/home']);
      
    }
    else{
      alert(this.name);
    }
  }

}
