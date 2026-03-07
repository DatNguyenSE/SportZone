import { Routes } from '@angular/router';
// SỬA DÒNG NÀY:
import { Home } from './features/home/home';
import { Nav } from './features/nav/nav';
import { authGuard } from './core/guards/auth-guard';
import { AccountProfile } from './features/account-profile/account-profile';
import { ProductList } from './features/product-list/product-list';
import { ProductManagement } from './features/admin/product-management/product-management';
import { ProductDetail } from './features/product-detail/product-detail';
import { adminGuard } from './core/guards/admin-guard';
import { Cart } from './features/cart/cart';
import { OrderProcessing } from './features/order-processing/order-processing';
import { OrderUser } from './features/order-user/order-user';
import { PaymentFail } from './shared/components/payment-fail/payment-fail';
import { OrderDetail } from './features/order-detail/order-detail';
import { CheckoutSuccess } from './shared/components/checkout-success/checkout-success';
import { FeatureProducts } from './shared/campaign/feature-products/feature-products';
import { FeatureBannerManagement } from './features/admin/feature-banner-management/feature-banner-management';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'category/:id', component: ProductList },
    { path: 'product-detail/:id', component: ProductDetail},
    { path: 'payment-fail/:orderId', component: PaymentFail},
    { path: 'checkout-success/:orderId', component: CheckoutSuccess},
    { path: 'feature-products/:id', component: FeatureProducts },



    
     
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'my-account/profile', component: AccountProfile },
            { path: 'cart', component: Cart},
            { path: 'product-management', component: ProductManagement, canActivate: [adminGuard] },
            { path: 'feature-banner-management', component: FeatureBannerManagement, canActivate: [adminGuard] },
            { path: 'order-processing', component: OrderProcessing },
            { path: 'order-user', component: OrderUser },
            { path: 'order-detail/:orderId', component: OrderDetail }



        ]

    }
];