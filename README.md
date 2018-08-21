# @wowmaking/react-native-billing

[![npm](https://img.shields.io/npm/v/@wowmaking/react-native-billing.svg)](https://npmjs.com/package/@wowmaking/react-native-billing)


## [Usage Example](https://gist.github.com/kurtsergey/ccb51f437787f13448d3c9651e9fabbd)

## Installation

### Install and link
* [react-native-billing](https://npmjs.com/package/react-native-billing) for Android
* [react-native-in-app-utils](https://npmjs.com/package/react-native-in-app-utils) for iOS 

### **Use iOS lib from git branch**:

`npm i react-native-in-app-utils@github:superandrew213/react-native-in-app-utils#listen-for-purchase-event`


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

### isAvailable()

#### Returns Promise

```javascript
Billing.isAvailable()
    .then((isAvailable) => {
        console.log('isAvailable: ', isAvailable);
    });
```

### getProductDetails(productId)

#### Parameter(s)

* **productId:** String

#### Returns [Product details](#product-details)

```javascript
var details = Billing.getProductDetails('com.wowapp.full.weekly');
console.log(details);
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

### restorePurchases()

#### Returns Promise of Array of [Transaction details](#transaction-details):
 
```javascript
Billing.restorePurchases()
    .then(transactions => {
        console.log(transactions);
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
