import _assign from 'lodash/assign';
import _map from 'lodash/map';
import _keyBy from 'lodash/keyBy';

import Billing from 'react-native-billing';
import verify from 'react-native-billing-verifier/android';


let products = [],
    subscriptions = [],
    index = {},
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
                return [];
            })
            .then((res) => {
                products = _map(res, mapProduct);
                index = _assign(index, _keyBy(products, 'productId'));
                return Billing.getSubscriptionDetailsArray(subs);
            })
            .catch((err) => {
                return [];
            })
            .then((res) => {
                subscriptions = _map(res, mapProduct);
                index = _assign(index, _keyBy(subscriptions, 'productId'));
            })
            .then(() => ({
                products,
                subscriptions,
            }));
    },

    isAvailable() {
        return Billing.close()
            .catch(() => { })
            .then(() => {
                return Billing.open();
            })
            .catch(() => { })
            .then(() => {
                return Billing.isOneTimePurchaseSupported();
            })
            .catch(() => false);
    },

    getProductDetails(productId) {
        return index[productId] || null;
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
                index = _assign(index, _keyBy(_map(res, mapProduct), 'productId'));
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
                index = _assign(index, _keyBy(_map(res, mapProduct), 'productId'));
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

function mapProduct(product) {
    return {
        productId: product.productId,
        title: product.title,
        description: product.description,
        currency: product.currency,
        priceValue: product.priceValue,
        priceText: product.priceText,
    };
};