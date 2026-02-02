import { Routes } from '@angular/router';
// SỬA DÒNG NÀY:
import { Home } from './features/home/home';
import { Nav } from './features/nav/nav';
import { authGuard } from './core/guards/auth-guard';
import { AccountProfile } from './shared/components/account-profile/account-profile';
import { ProductList } from './shared/components/product-list/product-list';
import { ProductManager } from './shared/components/product-manager/product-manager';
import { ProductDetail } from './shared/components/product-detail/product-detail';
import { adminGuard } from './core/guards/admin-guard';
import { Cart } from './features/cart/cart';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'category/:id', component: ProductList },
    { path: 'product-detail/:id', component: ProductDetail},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'my-account/profile', component: AccountProfile },
            { path: 'cart', component: Cart},
            { path: 'product-manager', component: ProductManager, canActivate: [adminGuard] }
        ]

    }
];