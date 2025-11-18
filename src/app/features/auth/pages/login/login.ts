import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from "@angular/material/icon";
import { HttpHelper } from '../../../../core/services/http-helper';
import { AuthModel } from '../../../../core/model/auth-model';
import { AuthService } from '../../../../core/services/auth-service';
import { Language } from '../../../../core/services/language';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loading = signal<boolean>(false);

  passwordvisibile = false;
  form!: FormGroup;
  
  constructor(public fb: FormBuilder, public httpHelper:HttpHelper, public authService:AuthService, public language:Language) { 
    this.form = this.fb.group({
      name:[
        'Wesam',
        [Validators.required, Validators.minLength(4), Validators.maxLength(20)]
      ],
      password:[
        'Wesam@204',
        [Validators.required,Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^\\w\\s]).{8,20}$')]
      ]
    });
  }
  
  get name() {
    return this.form.get('name');
  }
  
  get password() {
    return this.form.get('password');
  }

  
  login(){
    if(this.form.invalid){
        return;
    }
    
    this.loading.set(true);
    
    this.httpHelper.post<AuthModel>('account/sign-in',{
      username:this.name?.value,
      password:this.password?.value
    }).subscribe({
      next:(response)=>{
        this.authService.setAuth(response);
        this.loading.set(false);
      },
      error:(error)=>{
        console.log(JSON.stringify(error));
        this.loading.set(false);
      }
    })
  
    
  }
}