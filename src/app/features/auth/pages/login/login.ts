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
import { Router } from '@angular/router';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  
  constructor(
    public fb: FormBuilder, 
    public httpHelper:HttpHelper, 
    public authService:AuthService, 
    public language:Language,
    public route:Router,
    public matSnackBar:MatSnackBar,
  ) { 
    this.form = this.fb.group({
      phonenumber:[
        '0999999990',
        [Validators.required, Validators.pattern('^09\\d{8}$')]
      ],
      password:[
        'Wesam@204',
        [Validators.required,Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^\\w\\s]).{8,20}$')]
      ]
    });
  }

  get phonenumber() {
    return this.form.get('phonenumber');
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
      phonenumber:this.phonenumber?.value,
      password:this.password?.value
    }).subscribe({
      next:(response)=>{
        this.authService.setAuth(response);
        this.loading.set(false);
        this.route.navigate(['']); 
        this.matSnackBar.open(this.language.transform("success"), this.language.transform('close'), successMatSnackbarConfig(this.language));
      },
      error:(error)=>{
        this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    })
  }
}