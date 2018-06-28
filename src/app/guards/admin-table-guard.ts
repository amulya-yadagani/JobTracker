import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AdminTablesComponent } from '../components/admin/admin-tables.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<AdminTablesComponent> {
  canDeactivate(
    component: AdminTablesComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ):boolean {
    return confirm("Are you sure you want to leave the tab?");
  }
}
