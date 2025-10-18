import { Routes } from '@angular/router';
import { Table } from './pages/table/table';

export const routes: Routes = [
    {
        path: 'table',
        component: Table
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'table'
    }
];
