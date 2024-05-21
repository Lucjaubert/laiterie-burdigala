export interface ProductCategory {
    term_id: number;
    name: string;
  }
  
export interface ProductData {
    acf_fields: {
        product_title: string;
        product_image: string;
        description: string;
        price: string;
        weight: string;
        default_quantity: number;
        product_category: ProductCategory[];
    };
}