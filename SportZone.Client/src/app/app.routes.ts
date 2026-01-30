import { Routes } from '@angular/router';
// SỬA DÒNG NÀY:
import { Home } from './features/home/home';
import { Nav } from './features/nav/nav';
import { authGuard } from './core/guards/auth-guard';
import { AccountProfile } from './shared/components/account-profile/account-profile';
import { ProductList } from './shared/components/product-list/product-list';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'category/:id', component: ProductList }, 
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'my-account/profile', component: AccountProfile}
            
        ]
    }
    
];