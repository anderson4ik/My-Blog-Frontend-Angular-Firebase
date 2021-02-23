import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';
import {HomePageComponent} from './home-page/home-page.component';
import {PostPageComponent} from './post-page/post-page.component';

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      // to redirect to home page, angular don't understand that
      // should load HomePageComponent, we should to write directive
      // if path = '', redirect to '/' -> home page
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {path: '', component: HomePageComponent},
      {path: 'post/:id', component: PostPageComponent}
    ]
  },
  {
    path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule) // dynamic import
    // loadChildren -> lazy-loading of this module
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules  // provides background loading of admin modules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
