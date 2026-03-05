import {RowDataPacket} from 'mysql2';

export interface Product {
    id: string;
    category_id: number;
    title: string;
    price: number;
    description: string;
    image_url: string | null;
    created_at: string;
}

export interface Categories extends RowDataPacket {
    id: number;
    title: string;
    description: string;
}

export interface CategoryWithoutId {
    title: string;
    description: string;
}