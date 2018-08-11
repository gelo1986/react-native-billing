import _find from 'lodash/find';
import _filter from 'lodash/filter';


import Billing from './billing';


export default {

    init(products, subscriptions, key) {
        return Billing.init(products, subscriptions, key);
    },

    isAvailable() {
        return Billing.isAvailable();
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

    restorePurchases() {
        return Billing.restorePurchases();
    },

    verifyPurchases(purchases) {
        return Billing.verifyPurchases(purchases);
    },

};
