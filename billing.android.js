import _assign from 'lodash/assign';
import _map from 'lodash/map';
import _keyBy from 'lodash/keyBy';

import Billing from 'react-native-billing';
import verify from 'react-native-billing-verifier/android';


let products = {},
    subscriptions = {},
    googleplay_public_key = '';


export default {

    init(prods, subs, key) {
        googleplay_public_key = key;

        return Billing.close()
            .catch(() => { })
            .then(() => {
                return Billing.open();
            })
            .catch(() => { })
            .then(() => {
                return Billing.getProductDetailsArray(prods);
            })
            .catch((err) => {
                console.log('billing: ' + err);
                return [];
            })
            .then((res) => {
                console.log('products');
                console.log(JSON.stringify(res, null, '\t'));
                products = _keyBy(res, 'productId');
                return Billing.getSubscriptionDetailsArray(subs);
            })
            .catch((err) => {
                console.log('billing: ' + err);
                return [];
            })
            .then((res) => {
                console.log('subscriptions');
                console.log(JSON.stringify(res, null, '\t'));
                subscriptions = _keyBy(res, 'productId');
            });
    },

    getProductDetails(productId) {
        var p = products[productId] || subscriptions[productId];
        return p ? {
            ...p,
            title: p.title.replace(/\(.*\)$/, ''), // remove app name
        } : null;
    },

    purchase(productId) {
        return Billing.close()
            .catch(() => { })
            .then(() => {
                return Billing.open();
            })
            .catch(() => { })
            .then(() => {
                return Billing.getProductDetailsArray([productId]);
            })
            .catch(() => {
                return [];
            })
            .then((res) => {
                products = _assign(products, _keyBy(res, 'productId'));
                return Billing.purchase(productId);
            })
            .then((res) => {
                return this.verify(res);
            })
            .then((res) => {
                return Billing.consumePurchase(productId)
                    .then(() => res);
            });
    },

    subscribe(productId) {
        return Billing.close()
            .catch(() => { })
            .then(() => {
                return Billing.open();
            })
            .catch(() => { })
            .then(() => {
                return Billing.getSubscriptionDetailsArray([productId]);
            })
            .catch(() => {
                return [];
            })
            .then((res) => {
                subscriptions = _assign(subscriptions, _keyBy(res, 'productId'));
                return Billing.subscribe(productId);
            })
            .then((res) => {
                return this.verify(res);
            });
    },

    restorePurchases() {
        return Billing.close()
            .catch(() => { })
            .then(() => {
                return Billing.open();
            })
            .catch(() => { })
            .then(() => {
                return Billing.loadOwnedPurchasesFromGoogle();
            })
            .then(() => {
                return Billing.listOwnedSubscriptions();
            })
            .then(arr => {
                return Promise.all(_map(arr, productId => Billing.getSubscriptionTransactionDetails(productId)));
            })
            .then((purchases) => {
                return Promise.all(_map(purchases, purchase => this.verify(purchase)));
            });
    },

    verify(details) {
        return verify(details, googleplay_public_key);
    },

    verifyPurchases() {
        return this.restorePurchases();
    },

};
