import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "../../api/services/product.service";
import { RestaurantService } from "../../api/services/restaurant.service";
import type {
  AdditionalDTO,
  Additionals,
  ProducSizeDTO,
  Product,
  ProductCategory,
  ProductDTO,
} from "../../types/Product.type";
import { queryKeys } from "./queryKeys";

const MENU_STALE_TIME = 5 * 60 * 1000;

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.list(),
    queryFn: () => RestaurantService.restaurantProducts(),
    staleTime: MENU_STALE_TIME,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => RestaurantService.restaurantCategories(),
    staleTime: MENU_STALE_TIME,
  });
}

export function useAdditionals() {
  return useQuery({
    queryKey: queryKeys.additionals.list(),
    queryFn: () => RestaurantService.restaurantAdditionals(),
    staleTime: MENU_STALE_TIME,
  });
}

export function useSizes() {
  return useQuery({
    queryKey: queryKeys.sizes.list(),
    queryFn: () => RestaurantService.restaurantSizes(),
    staleTime: MENU_STALE_TIME,
  });
}

type CreateProductVariables = {
  product: ProductDTO;
  imageFile?: File;
};

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ product, imageFile }: CreateProductVariables) =>
      ProductService.createProduct(product, imageFile),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}


export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryName: string) =>
      ProductService.createCategory({ categoryName }) as Promise<ProductCategory>,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useCreateAdditional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AdditionalDTO) =>
      ProductService.createAdditional(body) as Promise<Additionals>,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.additionals.all });
    },
  });
}

export function useUpdateProductActive() {
  const queryClient = useQueryClient();
  const productsKey = queryKeys.products.list();

  return useMutation({
    mutationFn: (productId: string) =>
      ProductService.updateActiveProduct(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: productsKey });

      const previousProducts = queryClient.getQueryData<Product[]>(productsKey);

      queryClient.setQueryData<Product[]>(productsKey, (products) =>
        products?.map((product) =>
          product.id === productId
            ? { ...product, productActive: !product.productActive }
            : product,
        ),
      );

      return { previousProducts };
    },
    onError: (_error, _productId, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(productsKey, context.previousProducts);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

type UpdateProductVariables = {
  productId: string;
  body: {
    productName: string;
    productDescription: string;
  };
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const productsKey = queryKeys.products.list();

  return useMutation({
    mutationFn: ({ productId, body }: UpdateProductVariables) =>
      ProductService.updateProduct(productId, body),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<Product[]>(productsKey, (products) =>
        products?.map((product) =>
          product.id === variables.productId
            ? { ...product, ...variables.body }
            : product,
        ),
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => ProductService.deleteProduct(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

type AddProductSizesVariables = {
  productId: string;
  sizes: ProducSizeDTO[];
};

export function useAddProductSizes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, sizes }: AddProductSizesVariables) =>
      Promise.all(
        sizes.map((size) => ProductService.addProductSize(productId, size)),
      ),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

type UpdateProductSizeVariables = {
  productSizeId: string;
  body: {
    size: string;
    price: number;
  };
};

export function useUpdateProductSize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productSizeId, body }: UpdateProductSizeVariables) =>
      ProductService.updateProductSize(productSizeId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

type DeleteProductSizeVariables = {
  productId: string;
  productSizeId: string;
};

export function useDeleteProductSize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, productSizeId }: DeleteProductSizeVariables) =>
      ProductService.deleteProductSize(productId, productSizeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
