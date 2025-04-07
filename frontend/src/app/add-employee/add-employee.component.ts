import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { Employee } from '../models/Employee';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const add_employee = gql`
  mutation AddEmployee(
    $first_name: String!
    $last_name: String!
    $email: String!
    $gender: String!
    $salary: Float!
    $designation: String!
    $date_of_joining: String!
    $department: String!
    $employee_photo: String!
  ) {
    addNewEmployee(
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      salary: $salary
      designation: $designation
      date_of_joining: $date_of_joining
      department: $department
      employee_photo: $employee_photo
    ) {
      status
      message
      employee {
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
        created_at
        updated_at
      }
    }
  }
`;

const edit_employee = gql`
  mutation UpdateEmployee(
    $id: ID!
    $first_name: String!
    $last_name: String!
  ) {
    updateEmployeeById(
      id: $id
      first_name: $first_name
      last_name: $last_name
    ) {
      status
      message
      employee {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
            created_at
            updated_at
      }
    }
  }
`;

const get_employee_by_id = gql`
  query Query($id: ID!) {
    getEmployeeById(id: $id) {
      status
      message
      employee {
        id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
        created_at
        updated_at
      }
    }
  }
`;


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  form!: FormGroup;
  employee: Employee = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    designation: '',
    salary: 0,
    date_of_joining: '',
    department: '',
    employee_photo: '',
    created_at: '',
    updated_at: ''
  };
  error: any;
  tempEmployee: any;
  path = this.router.url;
  id = this.path.replace('/edit/', '');
  isUpdate = this.path.includes('edit');

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
  


  }

  ngOnInit(): void {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      date_of_joining: [''],
      department: ['', Validators.required],
      employee_photo: [''],
      salary: ['', Validators.required],
    });
    if (this.isUpdate) {
      this.apollo
        .watchQuery<any>({
          query: get_employee_by_id,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe(({ data, loading }) => {
          console.log(data)
          this.form.setValue({
            first_name: data.getEmployeeById.employee.first_name,
            last_name: data.getEmployeeById.employee.last_name,
            email: data.getEmployeeById.employee.email,
            gender: data.getEmployeeById.employee.gender,
            salary: data.getEmployeeById.employee.salary,
            designation: data.getEmployeeById.employee.designation,
            date_of_joining: data.getEmployeeById.employee.date_of_joining,
            department: data.getEmployeeById.employee.department,
            employee_photo: '',
          });
        });
    }
  }

  onSubmit() {
    if (this.isUpdate) {
      this.editEmployee(this.id);
    } else if (this.isUpdate == false) {
      this.addNewEmployee();
    }
  }

  addNewEmployee() {
    this.apollo
      .mutate<any>({
        mutation: add_employee,
        variables: {
          first_name: this.form.value.first_name,
          last_name: this.form.value.last_name,
          email: this.form.value.email,
          gender: this.form.value.gender,
          salary: this.form.value.salary,
          designation: this.form.value.designation,
          date_of_joining: this.form.value.date_of_joining,
          department: this.form.value.department,
          employee_photo: this.form.value.employee_photo,
        },
      })
      .pipe(
        catchError((error) => {
          this.error = error.message;
          console.log(error)
          if (error.networkError.status === 400)
            this.error = 'Something went wrong (Bad Request)';
          return of({ error: error });
        })
      )
      .subscribe({
        next: (val: any) => {
          console.log(val.data.addNewEmployee.employee)
          if (val.data.addNewEmployee.status == true) {
            alert('Employee saved successfully.')
            window.location.href = '/list';
          } else if (val.data.addEmployee.status == false) {
            alert(val.data.addEmployee.message)
          }
        },
      });
  }

  editEmployee(id: string) {
    this.employee = {
      id: '',
      first_name: "A",
      last_name: '',
      email: '',
      gender: '',
      designation: '',
      salary: 0,
      date_of_joining: '',
      department: '',
      employee_photo: '',
      created_at: '',
      updated_at: ''
    };

    console.log(this.form.value)
    this.apollo
      .mutate<any>({
        mutation: edit_employee,
        variables: {
          id: id,
          first_name: this.form.value.first_name?this.form.value.first_name:'',
          last_name: this.form.value.last_name,
          email: this.form.value.email,
          gender: this.form.value.gender,
          salary: this.form.value.salary,
          designation: this.form.value.designation,
          date_of_joining: this.form.value.date_of_joining,
          department: this.form.value.department,
          employee_photo: this.form.value.employee_photo,
        },
      })
      .pipe(
        catchError((error) => {
          this.error = error.message;
          if (error.networkError.status === 400)
            this.error = 'Something went wrong (Bad Request)';
          return of({ error: error });
        })
      )
      .subscribe({
        next: (val: any) => {
          console.log(val.data)
          if (val.data.updateEmployeeById.status == true) {
            alert('Employee updated successfully.')
            window.location.href = '/list';
          } else if (val.data.updateEmployee.status == false) {
            alert(val.data.updateEmployee.message)
          }
        },
      });
  }
}
