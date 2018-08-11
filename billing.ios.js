import _assign from 'lodash/assign';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import Billing from 'react-native-in-app-utils';
import verify from 'react-native-billing-verifier/ios';


let products = {},
    connect_key;


export default {

    init(prods, subs, key) {
        connect_key = key;

        return Billing.loadProducts([...prods, ...subs])
            .catch((err) => {
                console.log('billing error: ' + (err ? err.message : ''));
                return [];
            })
            .then((res) => {
                console.log('products');
                console.log(JSON.stringify(res, null, '\t'));
                products = _keyBy(res, 'identifier');
            });
    },

    isAvailable() {
        return Billing.canMakePayments()
            .catch(() => false);
    },

    getProductDetails(productId) {
        var p = products[productId];
        return p ? {
            ...p,
            productId: p.identifier,
            priceText: p.priceString,
            priceValue: p.price,
            currency: p.currencyCode,
        } : null;
    },

    purchase(productId) {
        return Billing.loadProducts([productId])
            .then((res) => {
                products = _assign(products, _keyBy(res, 'identifier'));
                return Billing.purchaseProduct(productId);
            })
            .then((response) => ({
                ...response,
                productId: response.productIdentifier,
                orderId: response.transactionIdentifier,
            }))
            .then((res) => {
                return this.verify(res);
            });
    },

    subscribe(productId) {
        return this.purchase(productId);
    },

    restorePurchases() {
        return Billing.restorePurchases()
            .then((arr) => {
                return _map(arr, details => ({
                    ...details,
                    productId: details.productIdentifier,
                    orderId: details.transactionIdentifier,
                }));
            });
    },

    verify(details) {
        return verify(details, connect_key);
    },

    verifyPurchases(purchases) {
        return Promise.all(
            _map(purchases, p => this.verify(p).catch(() => null))
        )
            .then(purchases => _filter(purchases, p => !!p));
    },

};
