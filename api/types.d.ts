import {RowDataPacket} from 'mysql2';

export interface Product extends RowDataPacket {
    id: number;
    category_id: number;
    location_id: number;
    title: string;
    description: string;
    image_url: string | null;
    created_at: string;
}

export interface ProductWithoutId {
    category_id: number;
    location_id: number;
    title: string;
    description: string;
    image_url: string | null;
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

export interface Locations extends RowDataPacket {
    id: number;
    title: string;
    description: string | null;
}

export interface LocationWithoutId {
    title: string;
    description: string;
}