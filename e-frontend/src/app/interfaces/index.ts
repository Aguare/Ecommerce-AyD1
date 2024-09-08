
    export interface CartResponse {
        data: {
        cart: Array<CartItem>;
        info: Array<Product>;  
        images: Array<ImageProduct>;
        };
    }
    export interface CartItem {
        id: number;
        quantity: number;
        created_at: string;
        FK_Product: number;
        FK_User: number;
        FK_Branch: number;
    }

  
    export interface Product {
        id: number;
        name: string;
        description: string;
        price: number;
        page_information: string;
        isAvailable: boolean;
        created_at: string;
        FK_Branch: number;
    }

    export interface ImageProduct {
        id: number;
        image_path: string;
        FK_Product: number;
        created_at: string;
    }

    export interface Attribute {
        name: string;
        description: string;
    }

    export interface ProductDetail {
        id: number;
        name: string;
        description: string;
        price: number;
        category: string;
        page_information: string;
        isAvailable: boolean;
        created_at: string;
        FK_Branch: number;
        images: Array<ImageProduct>;
        attributes: Array<Attribute>;
    }
  