# @wowmaking/react-native-billing

[![npm](https://img.shields.io/npm/v/@wowmaking/react-native-billing.svg)](https://npmjs.com/package/@wowmaking/react-native-billing)

## API

### init(products, subscriptions, key)

#### Parameter(s)

* **products:** Array of String
* **subscriptions:** Array of String
* **key:** String - Android Billing API key or iTunesConnect key

#### Returns Promise

```javascript
Billing.init(['com.wowapp.no_ads'], ['com.wowapp.full.weekly'], 'wowappkey')
    .then(() => {
        console.log('initialized');
    });
```

### getProductDetails(productId)

#### Parameter(s)

* **productId:** String

#### Returns [Product details](#product-details)

```javascript
Billing.getProductDetails('com.wowapp.full.weekly')
    .then(details => {
        console.log(details);
    });
```

### purchase(productId)

#### Parameter(s)

* **productId:** String

#### Returns Promise of [Transaction details](#transaction-details)

```javascript
Billing.purchase('com.wowapp.no_ads')
    .then(details => {
        console.log(details);
    });
```

### subscribe(productId)

#### Parameter(s)

* **productId:** String

#### Returns Promise of [Transaction details](#transaction-details)

```javascript
Billing.purchase('com.wowapp.full.weekly')
    .then(details => {
        console.log(details);
    });
```

### restorePurchases(presented)

#### Parameter(s)

* **presented:** Array of [Transaction details](#transaction-details) - known transactions

#### Returns Promise of Array of [Transaction details](#transaction-details):
 
```javascript
Billing.restorePurchases(known)
    .then(unknown => {
        console.log(unknown);
    });
```

### verifyPurchases(purchases)

#### Parameter(s)

* **purchases:** Array of [Transaction details](#transaction-details) - known transactions

#### Returns Promise of Array of [Transaction details](#transaction-details):
 
```javascript
Billing.verifyPurchases(all)
    .then(valid => {
        console.log(valid);
    });
```

## Entities

### Product details:
  * **productId:** String
  * **title:** String
  * **description:** String
  * **currency:** String
  * **priceValue:** Double
  * **priceText:** String

### Transaction details:
  * **productId:** String
  * **orderId:** String
  * **purchaseToken:** String (Android)
  * **purchaseTime:** String (Android)
  * **receiptSignature:** String (Android)
  * **receiptData:** String (Android)
  * **transactionReceipt:** String (iOS)
