import { Routes } from '@angular/router';
import { Table } from './pages/table/table';

export const routes: Routes = [
    {
        path: 'localstorage',
        component: Table
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'localstorage'
    }
];
