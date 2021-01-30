import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../../user/user.service';
import { Router } from '@angular/router';
import { User } from '../../user';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  public addUserForm: FormGroup;
  public userId: String;
  public success: string;
  public fail: string;
  public userDetail: any;
  public user: User;
  public images: File[] = [];
  public selectedImage: File[] = [];
  public valueImage: any;
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) { this.userId = this.route.snapshot.paramMap.get('id'); }


  ngOnInit(): void {
    this.getUser();
    this.addUserForm = this.formBuilder.group({
      first_name: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[a-zA-Z \-\']+')
      ]],
      last_name: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[a-zA-Z \-\']+')
      ]],
      phone_number: [null, [
        Validators.required
      ]],
      email: [null, [
        Validators.required,
        Validators.maxLength(100),
        Validators.email
      ]],
      image: [null, [
        Validators.required
      ]],
      profile_image: [null]
    });
  }

  get first_name() { return this.addUserForm.get('first_name'); }
  get email() { return this.addUserForm.get('email'); }
  get phone_number() { return this.addUserForm.get('phone_number'); }
  get last_name() { return this.addUserForm.get('last_name'); }
  get profile_image() { return this.addUserForm.get('profile_image'); }
  get image() { return this.addUserForm.get('image'); }

  getUser() {
    this.userService.getUser(this.userId).subscribe(response => {
      this.userDetail = response['data'];
      this.assignValues();
    }, error => {
      throw error;
    })
  }

  assignValues() {
    this.user = {
      first_name: this.userDetail.first_name,
      last_name: this.userDetail.last_name,
      email: this.userDetail.email,
      phone_number: this.userDetail.phone_number,
      profile_image: this.userDetail.profile_image
    }
    this.images.push(this.userDetail.profile_image);
  }

  onSubmit() {
    this.success = null;
    this.fail = null;

    // Mark all fields as touched to check if we have missed any field
    this.addUserForm.markAllAsTouched();
    
    if (this.addUserForm.valid) {
      const formData: any = new FormData();
      formData.append('first_name', this.addUserForm.get('first_name').value);
      formData.append('last_name', this.addUserForm.get('last_name').value);
      formData.append('email', this.addUserForm.get('email').value);
      formData.append('phone_number', this.addUserForm.get('phone_number').value);
      for (const img of this.selectedImage) {
        formData.append('profile_image', img, img.name);
      }

      this.userService.updateUser(formData, this.userId).subscribe(response => {
        if (response && response['data']) {
          if (response && response['data']) {
            this.toastrService.info('User updated successfully', 'info');
          }
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
  }

  getList() {
    this.router.navigate(['/list']);
  }

  // Image Preview
  onFileChange(event) {
    this.images = [];
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (const file of event.target.files) {
        const reader = new FileReader();
        reader.onload = (events: any) => {
          this.images.push(events.target.result);
          this.selectedImage.push(file);
          this.addUserForm.patchValue({
            profile_image: this.images
          });
          this.addUserForm.get('profile_image').updateValueAndValidity();
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
