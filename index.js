import _find from 'lodash/find';
import _filter from 'lodash/filter';


import Billing from './billing';


export default {

    init(products, subscriptions, key) {
        return Billing.init(products, subscriptions, key);
    },

    getProductDetails(productId) {
        return Billing.getProductDetails(productId);
    },

    purchase(productId) {
        return Billing.purchase(productId);
    },

    subscribe(productId) {
        return Billing.subscribe(productId);
    },

    restorePurchases(presented) {
        return Billing.restorePurchases()
            .then(arr => {
                return _filter(arr, productId => !_find(presented, { productId }));
            });
    },

    verifyPurchases(purchases) {
        return Billing.verifyPurchases(purchases);
    },

};
