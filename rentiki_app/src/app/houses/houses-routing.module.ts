import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HousesPage } from './houses.page';

const routes: Routes = [
  {
    path: '',
    component: HousesPage
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'house',
    loadChildren: () => import('./house/house.module').then( m => m.HousePageModule)
  },
  {
    path: 'new-house',
    loadChildren: () => import('./new-house/new-house.module').then( m => m.NewHousePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HousesPageRoutingModule {}
