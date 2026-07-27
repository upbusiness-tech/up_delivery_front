export interface ProductRestaurant {
  id: string;
  restaurantName: string;
}
export interface ProductCategory {
  id: string;
  categoryName: string;
}
export interface Adicionais {
  name: string,
  price: number
}




export interface Product {
  id: string;
  productName: string;
  productActive: boolean;
  productCategory: ProductCategory;
  sizes: ProducSize[];
  restaurant: ProductRestaurant;
  created_at: Date;
}

export interface ProducSize {
  id: string; 
  price: number;
  size: Size
}

export interface Size {
  id: string;
  name: string;
  limitFlavors: number;
}








//Posso aproveitar a infomação que o size me dá


// -----------------PRODUCT_BAG-----------------
//PIZZA P 1 SABOR
// productName: PIZZA P 1 SABOR,
// productCategory: pizzas,
// price: 28,
// quantity: 1,
// flavors: [uuid-235]

//PIZZA P 2 SABORES
// productName: PIZZA P 2 SABORES,
// productCategory: pizzas,
// price: 36,
// quantity: 1,
// flavors: [uuid-235, uuid-125]

// -----------------ORDER_ITEM-----------------

// name: PIZZA P 1 SABOR,
// quantity: 1,
// price: 28,
// flavors:[uuid-235]

export interface ProductBag {
  id: string;
  productName: string;
  productCategory: ProductCategory;
  price: number,
  quantity: number,
  flavors: string[];
}

// export function toProductBag(product: Product, flavors: Fla): ProductBag {
//   return {
//     id: product.id,
//     productName: product.productName,
//     productCategory: product.productCategory,
//     size: product.sizes[0].size.name,
//     price: product.sizes[0].price,
//     quantity: 1,
//     addons: [],
//     flavors: []
//   };
// }

//Nos cards mostrar as informações do produto usando o tipo Product
//Nos cards mostrar as informações do produto usando o tipo Product




