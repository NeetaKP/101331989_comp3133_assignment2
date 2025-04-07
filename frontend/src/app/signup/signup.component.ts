import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';

const signup = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      status
      message
      user {
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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  error: any;
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log(`aaaa-${this.form.value.username}, ${this.form.value.password}, ${this.form.value.email}`)
    this.apollo
      .mutate<any>({
        mutation: signup,
        variables: {
          username: this.form.value.username,
          password: this.form.value.password,
          email: this.form.value.email,
        },
      })
      .pipe(
        catchError((error) => {
          console.log("bbbbb")
          this.error = error.message;
          console.log(this.error)
          if (error.networkError.status === 400)
            this.error = 'Something went wrong (Bad Request)';
          return of({ error: error });
        })
      )
      .subscribe({
        next: (val: any) => {     
          console.log("cccccc")
          if (val.data.status == false) {
           alert(val.data.message)
         } else {
           this.router.navigate(["/login"])
         }          
        },       
      });
  }
}
