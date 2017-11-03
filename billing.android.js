import _find from 'lodash/find';
import _map from 'lodash/map';


import Billing from 'react-native-billing';
import verify from 'react-native-billing-verifier/android';


let products,
    subscriptions,
    googleplay_public_key = '';


export default {

    init(prods, subs, key) {
        googleplay_public_key = key;

        return Billing.close()
            .catch((err) => { })
            .then(() => {
                return Billing.open();
            })
            .catch((err) => { })
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
                products = res;
                return Billing.getSubscriptionDetailsArray(subs);
            })
            .catch((err) => {
                console.log('billing: ' + err);
                return [];
            })
            .then((res) => {
                console.log('subscriptions');
                console.log(JSON.stringify(res, null, '\t'));
                subscriptions = res;
            });
    },

    getProductDetails(productId) {
        var p = _find(products, { productId, }) || _find(subscriptions, { productId, });
        return p ? {
            ...p,
            title: p.title.replace(/\(.*\)$/, ''), // remove app name
        } : null;
    },

    purchase(productId) {
        return Billing.close()
            .catch((err) => { })
            .then(() => {
                return Billing.open();
            })
            .catch((err) => { })
            .then(() => {
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
            .catch((err) => { })
            .then(() => {
                return Billing.open();
            })
            .catch((err) => { })
            .then(() => {
                return Billing.subscribe(productId);
            })
            .then((res) => {
                return this.verify(res);
            });
    },

    restorePurchases(presented) {
        return Billing.close()
            .catch((err) => { })
            .then(() => {
                return Billing.open();
            })
            .catch((err) => { })
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

};
