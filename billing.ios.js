import _find from 'lodash/find';
import _map from 'lodash/map';

import Billing from 'react-native-in-app-utils';
import verify from 'react-native-billing-verifier/ios';


let products,
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
                products = res;
            });
    },

    getProductDetails(productId) {
        var p = _find(products, { identifier: productId, });
        return p ? {
            ...p,
            priceText: p.priceString,
            priceValue: p.price,
            currency: p.currencyCode,
        } : null;
    },

    purchase(productId) {
        return Billing.loadProducts([productId])
            .then((res) => {
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

    restorePurchases(presented) {
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

};