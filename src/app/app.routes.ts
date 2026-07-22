import { Routes } from '@angular/router';
import { UserList } from './features/user/user-list/user-list';
import { UserForm } from './features/user/user-form/user-form';
import { Dashboard } from './layout/dashboard/dashboard/dashboard';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { authChildGuard } from './core/guards/auth-child-guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes-guard';
import { authMatchGuard } from './core/guards/auth-match-guard';
export const routes: Routes = [

    {
path:'',
redirectTo:'login',
pathMatch:'full'
},

{
path:'login',
component:Login
},  
{
    path: 'dashboard',

    component: Dashboard,

    canActivate: [authGuard],
    canActivateChild:[authChildGuard],

    children: [

      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },

      {
        path: 'users',
        component: UserList
      },

      {
        path: 'user/add',
        component: UserForm,
        canDeactivate:[unsavedChangesGuard]
      },

      {
        path: 'user/edit/:id',
        component: UserForm,
        canDeactivate:[unsavedChangesGuard]
      }

    ]

  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];