export interface Product {
    id: string;
    category_id: number;
    title: string;
    price: number;
    description: string;
    image_url: string | null;
    created_at: string;
}