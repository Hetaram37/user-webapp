import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public httpClient: HttpClient
  ) { }

  linkGeneration(param1, param2) {
    const host = window.location.hostname;
    return param1.protocol + '://' + host + ':' + param1.port + param1.apiPrefix + param2;
  }

  userList() {
    const url = this.linkGeneration(environment.userMgmtService, environment.userMgmtService.userList);
    return this.httpClient.get(url, { responseType: 'json'});
  }

  getUser(id) {
    const url = this.linkGeneration(environment.userMgmtService, environment.userMgmtService.getUser).replace(':id', id);
    return this.httpClient.get(url, { responseType: 'json'});
  }

  addUser(body) {
    const url = this.linkGeneration(environment.userMgmtService, environment.userMgmtService.addNewUser);
    return this.httpClient.post(url, body, { responseType: 'json'});
  }

  deleteUser(id) {
    const url = this.linkGeneration(environment.userMgmtService, environment.userMgmtService.removeUser).replace(':id', id);
    return this.httpClient.delete(url, { responseType: 'json'});
  }

  updateUser(body, id) {
    const url = this.linkGeneration(environment.userMgmtService, environment.userMgmtService.updateUser).replace(':id', id);
    return this.httpClient.put(url, body, { responseType: 'json'});
  }
}
