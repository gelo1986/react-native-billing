declare module "react-native-billing" {

    interface Billing {

        init(products: [string], subscriptions: [string], key: string): Promise<void>,

        getProductDetails(productId: string): {},

        purchase(productId: string): Promise<{}>,

        subscribe(productId: string): Promise<{}>,

        restorePurchases(presented): Promise<[{}]>,

    }

    export default Billing;
}
