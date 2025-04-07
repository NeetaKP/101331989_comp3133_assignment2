import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const login = gql`
  query Query($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      status
      message
      user{
        id
        username
        email
        password
        created_at
        updated_at
      }
    }
  }
`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [true],
    });
  }

  onSubmit() {
    console.log(`aaa: ${this.form.value.email}, ${this.form.value.password}`)
    this.apollo
      .watchQuery<any>({
        query: login,
        variables: {
          email: this.form.value.email,
          password: this.form.value.password,
        },
      })
      .valueChanges.subscribe(({ data, loading }) => {
        console.log('bbb')
        let button = document.getElementById('submit') as HTMLButtonElement;        
        while (loading != false) {
          button!.textContent = '';
          button!.disabled = true;
          button!.innerHTML =
            "<div class='d-flex justify-content-center align-items-center'><div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>&nbsp; &nbsp;Please Wait...</div>";
        }
        if (data.login.status == true) {
          const user = {
            email: this.form.value.email,
            password: this.form.value.password,
          };
          if (this.form.value.rememberMe == true) {
            localStorage.setItem('employee-system', JSON.stringify(user));
          } else if (this.form.value.rememberMe == false) {
            sessionStorage.setItem('employee-system', JSON.stringify(user));
          }
          this.router.navigate(['/list']);
        } else {
          alert(data.login.message);
        }
        button!.disabled = false;
        button!.innerHTML = 'LOGIN';
      });
  }
}
