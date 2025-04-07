import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { pathToArray } from 'graphql/jsutils/Path';
import { Employee } from '../models/Employee';

const queryStr = gql`
  query GetEmployeeById($id: ID!) {
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
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
})
export class ViewEmployeeComponent implements OnInit {
  employee!: Employee
  date_of_joining!: string;

  constructor(private apollo: Apollo, private router: Router) {}
  ngOnInit(): void {
    const path = this.router.url;
    this.date_of_joining = '';
    console.log(path)
    const idl = path.replace("/view/", "")
    console.log("iid:",idl)
    console.log(path)
    console.log(this.employee)

    this.apollo
      .watchQuery<any>({
        query: queryStr,
        variables: {
          id: idl
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        console.log('bbb')
        console.log(loading);
        console.log(data.getEmployeeById.employee)

        console.log("ddata:",)
        this.employee = data.getEmployeeById.employee;
        this.date_of_joining = new Date(Number(this.employee.date_of_joining)).toISOString();
        
      });
      console.log(this.employee)
      
  }
}
