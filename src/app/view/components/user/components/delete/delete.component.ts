import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  userId: any;
  userDetail: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService
  ) { 
    this.userId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUser(this.userId).subscribe(response => {
      this.userDetail = response['data'];
    }, error => {
      throw error;
    })
  }

  deleteUser() {
    this.userService.deleteUser(this.userId).subscribe(response => {
      if (response['data']) {
        this.toastrService.info('User deleted successfully', 'info');
        this.getList();
      }
    }, error => {
      if (error && error.error && error.error.status_code && error.error.status_code.includes('400') || error.error.status_code.includes('206')) {
        this.toastrService.error(error.error.status_message, 'error')
      } else {
        this.toastrService.error('Something went wrong', 'error')
      }
      throw error;
    })
  }

  getList() {
    this.router.navigate(['/list']);
  }

}
