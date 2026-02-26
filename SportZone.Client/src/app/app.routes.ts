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
import { OrderProcessing } from './features/order-processing/order-processing';
import { OrderUser } from './shared/components/order-user/order-user';
import { PaymentFail } from './shared/components/payment-fail/payment-fail';
import { OrderDetail } from './shared/components/order-detail/order-detail';
import { CheckoutSuccess } from './shared/components/checkout-success/checkout-success';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'category/:id', component: ProductList },
    { path: 'product-detail/:id', component: ProductDetail},
    { path: 'payment-fail/:orderId', component: PaymentFail},
    { path: 'checkout-success/:orderId', component: CheckoutSuccess},



    
     
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'my-account/profile', component: AccountProfile },
            { path: 'cart', component: Cart},
            { path: 'product-manager', component: ProductManager, canActivate: [adminGuard] },
            { path: 'order-processing', component: OrderProcessing },
            { path: 'order-user', component: OrderUser },
            { path: 'order-detail/:orderId', component: OrderDetail }



        ]

    }
];