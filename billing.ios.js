import _assign from 'lodash/assign';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import Billing from 'react-native-in-app-utils';
import verify from 'react-native-billing-verifier/ios';


let products = [],
    subscriptions = [],
    index = {},
    connect_key;


export default {

    init(prods, subs, key) {
        connect_key = key;

        return Billing.loadProducts(prods)
            .catch((err) => {
                return [];
            })
            .then((res) => {
                products = _map(res, mapProduct);
                index = _assign(index, _keyBy(products, 'productId'));
                return Billing.loadProducts(subs);
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
        return Billing.canMakePayments()
            .catch(() => false);
    },

    getProductDetails(productId) {
        return index[productId] || null;
    },

    purchase(productId) {
        return Billing.loadProducts([productId])
            .then((res) => {
                index = _assign(index, _keyBy(_map(res, mapProduct), 'productId'));
                return Billing.purchaseProduct(productId);
            })
            .then(mapTransaction)
            .then((res) => {
                return this.verify(res);
            });
    },

    subscribe(productId) {
        return this.purchase(productId);
    },

    restorePurchases() {
        return Billing.restorePurchases()
            .then((arr) => _map(arr, mapTransaction));
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

function mapProduct(product) {
    return {
        productId: product.identifier,
        title: product.title,
        description: product.description,
        currency: product.currencyCode,
        priceValue: product.price,
        priceText: product.priceString,
        countryCode: product.countryCode,
    };
};

function mapTransaction(transaction) {
    return {
        ...transaction,
        productId: transaction.productIdentifier,
        orderId: transaction.transactionIdentifier,
    };
};
