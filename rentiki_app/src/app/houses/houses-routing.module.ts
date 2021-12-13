import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HousesPage } from './houses.page';

const routes: Routes = [
  {
    path: '',
    component: HousesPage,
  },
  {
    path: 'new-house',
    loadChildren: () => import('./new-house/new-house.module').then( m => m.NewHousePageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'offers',
    children: [
      {
        path: ':userOfferId',
        children: [
          {
            path: ':offerKey',            
            loadChildren: () => import('./house/house.module').then( m => m.HousePageModule),
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HousesPageRoutingModule {}
