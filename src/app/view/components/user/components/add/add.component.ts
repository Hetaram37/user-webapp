import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  public addUserForm: FormGroup;
  public success: string;
  public fail: string;
  public valueImage: String;
  public images: File[] = [];
  public selectedImage: File[] = [];
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService
  ) { }


  ngOnInit(): void {
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
      phone_number: [undefined, [
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
      formData.append('phone_number', this.addUserForm.get('phone_number').value.e164Number);
      for (const img of this.selectedImage) {
        formData.append('profile_image', img, img.name);
      }

      this.userService.addUser(formData).subscribe(response => {
        if (response && response['data']) {
          this.toastrService.info('User added successfully', 'info');
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
