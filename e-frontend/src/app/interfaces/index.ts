
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
        images: Array<string>;
        attributes: Array<Attribute>;
    }

    export interface StockProduct {
        id: number;
        name: string;
        address: string;
        stock: number;
    }

    export interface Order {
        id: number;
        nit_bill: string;
        name_bill: string;
        address_bill: string;
        reference_address: string;
        isDelivery: number;
        delivery_cost: number;
        status: string;
        total_taxes: number;
        total: number;
        quantity_products: number;
        created_at: string;
        FK_User: number;
        FK_Employee_Shipped: number;
        branch_id: number;
        branch_name: string;
    }

    export interface OrderProduct {
        id: number;
        name: string;
        quantity: number;
        price: number;
        taxes: number;
        total: number;
        branch_name: string;
    }

    export const OrderStatus = {
        'PENDING': 'Pendiente',
        'IN_PROCESS': 'En proceso',
        'DELIVERED': 'Enviado',
        'CANCELED': 'Cancelado'
    };

    export interface RolePage {
        id: number;
        name: string;
        isAssigned: number;
    }

    export interface Role {
        id: number;
        name: string;
        description: string;
        created_at: string;
        pages: RolePage[];
    }
  