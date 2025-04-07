import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { Employee } from '../models/Employee';

const get_employees = gql`
  query {
    getAllEmployees {
      status
      message
      employees{
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

const delete_employee = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployeeById(id: $id) {
      status
      message
      employee{
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
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  isLoading!: boolean;
  title = '101340403_comp3133_assig2';
  error: any;
  constructor(private apollo: Apollo) {}
  ngOnInit(): void {
    console.log("gemp",get_employees)
    this.apollo
      .watchQuery<any>({
        query: get_employees,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        console.log("data",data.getAllEmployees.employees)
        this.isLoading = loading
        console.log(this.isLoading);
        this.employees = data.getAllEmployees.employees;
      });
  }

  onDeletemployeeButtonClick (id: string) {
    this.apollo
      .mutate<any>({
        mutation: delete_employee,
        variables: {
          id: id,
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
      .subscribe((data) => {
        alert('Employee deleted successfully')
        window.location.href = '/list';
      });
  }

}
