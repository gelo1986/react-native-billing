declare module "@wowmaking/react-native-billing" {

    interface Product {
        productId: String,
        title: String,
        description: String,
        currency: String,
        priceValue: Number,
        priceText: String,
        countryCode: String,
    }

    interface Transaction {
        productId: String,
        orderId: String,
        purchaseToken: String,
        purchaseTime: String,
        receiptSignature: String,
        receiptData: String,
        transactionReceipt: String,
    }

    interface Billing {

        init(products: [string], subscriptions: [string], key: string): Promise<{ products: [Product], subscriptions: [Product], }>,

        isAvailable(): Promise<boolean>,

        getProductDetails(productId: string): Product,

        purchase(productId: string): Promise<Transaction>,

        subscribe(productId: string): Promise<Transaction>,

        restorePurchases(): Promise<[Transaction]>,

        verifyPurchases(purchases): Promise<[Transaction]>,

    }

    export default Billing;
}
