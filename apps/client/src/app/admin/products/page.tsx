"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  listProductsBuilder, 
  deleteProductBuilder, 
  createProductBuilder, 
  updateProductBuilder 
} from "@repo/api-client";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import ProductsTable from "../components/ProductsTable";
import ProductModal from "../components/ProductModal";
import StockModal from "../components/StockModal";
import ProductFilters from "../components/ProductFilters";
import { Plus, Download, Upload } from "lucide-react";

type ProductResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image?: string;
  stock: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProductsPage() {
  const { user, isLoading: authLoading } = useRequireAuth(true); // Require admin role
  const queryClient = useQueryClient();
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState<ProductResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const itemsPerPage = 12;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => listProductsBuilder.resolver(null),
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => createProductBuilder.resolver(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowProductModal(false);
      setEditingProduct(null);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...productData }: any) => {
      const builder = updateProductBuilder(id);
      return builder.resolver(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowProductModal(false);
      setEditingProduct(null);
      setShowStockModal(false);
      setStockProduct(null);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const builder = deleteProductBuilder(id);
      return builder.resolver(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedProducts([]);
    },
  });

  const handleEdit = (product: ProductResponse) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
      selectedProducts.forEach(id => deleteProductMutation.mutate(id));
    }
  };

  const handleStockEdit = (product: ProductResponse) => {
    setStockProduct(product);
    setShowStockModal(true);
  };

  // Filter and sort products
  const filteredProducts = (products as ProductResponse[])
    .filter((product: ProductResponse) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "" || product.category === categoryFilter)
    )
    .sort((a: ProductResponse, b: ProductResponse) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "stock":
          return a.stock - b.stock;
        case "created":
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = [...new Set((products as ProductResponse[]).map((p: ProductResponse) => p.category))];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowProductModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
        selectedProducts={selectedProducts}
        onBulkDelete={handleBulkDelete}
      />

      {/* Products Table */}
      <ProductsTable
        products={paginatedProducts}
        selectedProducts={selectedProducts}
        onSelectionChange={setSelectedProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStockEdit={handleStockEdit}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredProducts.length}
      />

      {/* Modals */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          isOpen={showProductModal}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSave={(productData) => {
            if (editingProduct) {
              updateProductMutation.mutate({ id: editingProduct.id, ...productData });
            } else {
              createProductMutation.mutate(productData);
            }
          }}
          isLoading={createProductMutation.isPending || updateProductMutation.isPending}
        />
      )}

      {showStockModal && stockProduct && (
        <StockModal
          product={stockProduct}
          isOpen={showStockModal}
          onClose={() => {
            setShowStockModal(false);
            setStockProduct(null);
          }}
          onSave={(newStock) => {
            updateProductMutation.mutate({
              id: stockProduct.id,
              name: stockProduct.name,
              description: stockProduct.description,
              price: stockProduct.price,
              originalPrice: stockProduct.originalPrice,
              category: stockProduct.category,
              image: stockProduct.image || '',
              stock: newStock,
            });
          }}
          isLoading={updateProductMutation.isPending}
        />
      )}
    </div>
  );
}