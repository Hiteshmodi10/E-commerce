"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "../../hooks/useRequireAuth";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useRequireAuth(true); // Require admin role

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/admin/dashboard");
    }
  }, [router, isLoading, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  rating?: number;
  createdAt?: string;
};

// export default function AdminPage() {
//   const { user, isLoading: authLoading } = useRequireAuth();
//   const queryClient = useQueryClient();
  
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [showStockModal, setShowStockModal] = useState(false);
//   const [stockProduct, setStockProduct] = useState<Product | null>(null);
//   const [stockAmount, setStockAmount] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortBy, setSortBy] = useState("name");
//   const itemsPerPage = 10;

//   const [productForm, setProductForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     originalPrice: "",
//     category: "",
//     image: "",
//     stock: "",
//   });

//   const { data: products = [], isLoading } = useQuery({
//     queryKey: ["products"],
//     queryFn: listProductsBuilder.resolver,
//     enabled: !!user,
//   });

//   const createProductMutation = useMutation({
//     mutationFn: createProductBuilder.resolver,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//       setShowAddForm(false);
//       resetForm();
//     },
//   });

//   const updateProductMutation = useMutation({
//     mutationFn: async ({ id, ...productData }: any) => {
//       const builder = updateProductBuilder(id);
//       return builder.resolver(productData);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//       setEditingProduct(null);
//       resetForm();
//     },
//   });

//   const deleteProductMutation = useMutation({
//     mutationFn: async (id: string) => {
//       const builder = deleteProductBuilder(id);
//       return builder.resolver(null);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//       setSelectedProducts([]);
//     },
//   });

//   const resetForm = () => {
//     setProductForm({
//       name: "",
//       description: "",
//       price: "",
//       originalPrice: "",
//       category: "",
//       image: "",
//       stock: "",
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const productData = {
//       name: productForm.name,
//       description: productForm.description,
//       price: parseFloat(productForm.price),
//       originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
//       category: productForm.category,
//       image: productForm.image || '',
//       stock: parseInt(productForm.stock),
//     };

//     if (editingProduct) {
//       updateProductMutation.mutate({ id: editingProduct.id, ...productData });
//     } else {
//       createProductMutation.mutate(productData);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setEditingProduct(product);
//     setProductForm({
//       name: product.name,
//       description: product.description,
//       price: product.price.toString(),
//       originalPrice: product.originalPrice?.toString() || "",
//       category: product.category,
//       image: product.image,
//       stock: product.stock.toString(),
//     });
//     setShowAddForm(true);
//   };

//   const handleDelete = (id: string) => {
//     if (confirm("Are you sure you want to delete this product?")) {
//       deleteProductMutation.mutate(id);
//     }
//   };

//   const handleBulkDelete = () => {
//     if (confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
//       selectedProducts.forEach(id => deleteProductMutation.mutate(id));
//     }
//   };

//   const handleStockAdjustment = (productId: string, currentStock: number, action: 'increase' | 'decrease') => {
//     const product = products.find((p: Product) => p.id === productId);
//     if (product) {
//       setStockProduct(product);
//       setStockAmount('');
//       setShowStockModal(true);
//     }
//   };

//   const handleStockUpdate = () => {
//     if (!stockProduct || !stockAmount) return;

//     const newStock = parseInt(stockAmount);
//     if (newStock < 0) {
//       alert('Stock cannot be negative');
//       return;
//     }

//     updateProductMutation.mutate({
//       id: stockProduct.id,
//       name: stockProduct.name,
//       description: stockProduct.description,
//       price: stockProduct.price,
//       originalPrice: stockProduct.originalPrice,
//       category: stockProduct.category,
//       image: stockProduct.image || '',
//       stock: newStock,
//     });

//     setShowStockModal(false);
//     setStockProduct(null);
//     setStockAmount('');
//   };

//   // Filter and sort products
//   const filteredProducts = products
//     .filter((product: Product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (categoryFilter === "" || product.category === categoryFilter)
//     )
//     .sort((a: Product, b: Product) => {
//       switch (sortBy) {
//         case "name":
//           return a.name.localeCompare(b.name);
//         case "price":
//           return a.price - b.price;
//         case "stock":
//           return a.stock - b.stock;
//         case "created":
//           return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
//         default:
//           return 0;
//       }
//     });

//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const categories = [...new Set(products.map((p: Product) => p.category))];

//   const stats = {
//     totalProducts: products.length,
//     totalValue: products.reduce((sum: number, p: Product) => sum + (p.price * p.stock), 0),
//     lowStock: products.filter((p: Product) => p.stock < 10).length,
//     outOfStock: products.filter((p: Product) => p.stock === 0).length,
//   };

//   if (authLoading || isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🔒</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//           <p className="text-gray-600">You need to be logged in to access the admin panel.</p>
//         </div>
//       </div>
//     );
//   }

//   // Check if user has admin role
//   const userRole = user?.user_metadata?.role || 'user';
//   const isAdminUser = true;
  
//   if (!isAdminUser) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🚫</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
//           <p className="text-gray-600">You don't have permission to access the admin panel.</p>
//           <p className="text-sm text-gray-500 mt-2">Current role: {userRole}</p>
//           <p className="text-xs text-gray-400 mt-2">
//             Contact administrator to get admin access
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
//           <p className="text-gray-600">Manage your products and inventory</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Package className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Products</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <DollarSign className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Value</p>
//                 <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-yellow-100 rounded-lg">
//                 <TrendingUp className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Low Stock</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-red-100 rounded-lg">
//                 <Users className="h-6 w-6 text-red-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Out of Stock</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
//             <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
              
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <option value="name">Sort by Name</option>
//                 <option value="price">Sort by Price</option>
//                 <option value="stock">Sort by Stock</option>
//                 <option value="created">Sort by Date</option>
//               </select>
//             </div>
            
//             <div className="flex space-x-2">
//               {selectedProducts.length > 0 && (
//                 <button
//                   onClick={handleBulkDelete}
//                   className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete ({selectedProducts.length})
//                 </button>
//               )}
              
//               <button
//                 onClick={() => setShowAddForm(true)}
//                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Product
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Products Table */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <input
//                       type="checkbox"
//                       checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedProducts(paginatedProducts.map((p: Product) => p.id));
//                         } else {
//                           setSelectedProducts([]);
//                         }
//                       }}
//                       className="rounded border-gray-300"
//                     />
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Price
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Stock
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedProducts.map((product: Product) => (
//                   <tr key={product.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedProducts.includes(product.id)}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setSelectedProducts([...selectedProducts, product.id]);
//                           } else {
//                             setSelectedProducts(selectedProducts.filter(id => id !== product.id));
//                           }
//                         }}
//                         className="rounded border-gray-300"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-12 w-12">
//                           <img
//                             className="h-12 w-12 rounded-lg object-cover"
//                             src={product.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"}
//                             alt={product.name}
//                           />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                           <div className="text-sm text-gray-500 truncate max-w-xs">
//                             {product.description}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {product.category}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">${product.price}</div>
//                       {product.originalPrice && (
//                         <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-sm text-gray-900">{product.stock}</span>
//                         <button
//                           onClick={() => handleStockAdjustment(product.id, product.stock, 'increase')}
//                           className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
//                           title="Update stock"
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         product.stock === 0 
//                           ? "bg-red-100 text-red-800" 
//                           : product.stock < 10 
//                           ? "bg-yellow-100 text-yellow-800" 
//                           : "bg-green-100 text-green-800"
//                       }`}>
//                         {product.stock === 0 ? "Out of Stock" : product.stock < 10 ? "Low Stock" : "In Stock"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => handleEdit(product)}
//                           className="text-blue-600 hover:text-blue-900"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(product.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                   disabled={currentPage === totalPages}
//                   className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
//                     <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of{" "}
//                     <span className="font-medium">{filteredProducts.length}</span> results
//                   </p>
//                 </div>
//                 <div>
//                   <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                     <button
//                       onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                       disabled={currentPage === 1}
//                       className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <ChevronLeft className="h-5 w-5" />
//                     </button>
                    
//                     {[...Array(totalPages)].map((_, i) => (
//                       <button
//                         key={i + 1}
//                         onClick={() => setCurrentPage(i + 1)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === i + 1
//                             ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
//                             : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                         }`}
//                       >
//                         {i + 1}
//                       </button>
//                     ))}
                    
//                     <button
//                       onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                       disabled={currentPage === totalPages}
//                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <ChevronRight className="h-5 w-5" />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add/Edit Product Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 {editingProduct ? "Edit Product" : "Add New Product"}
//               </h3>
              
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Product Name
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={productForm.name}
//                     onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     required
//                     rows={3}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={productForm.description}
//                     onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Price
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       value={productForm.price}
//                       onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Original Price
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       value={productForm.originalPrice}
//                       onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={productForm.category}
//                     onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Image URL
//                   </label>
//                   <input
//                     type="url"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={productForm.image}
//                     onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Stock Quantity
//                   </label>
//                   <input
//                     type="number"
//                     required
//                     min="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={productForm.stock}
//                     onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
//                   />
//                 </div>
                
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowAddForm(false);
//                       setEditingProduct(null);
//                       resetForm();
//                     }}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={createProductMutation.isPending || updateProductMutation.isPending}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {createProductMutation.isPending || updateProductMutation.isPending
//                       ? "Saving..."
//                       : editingProduct
//                       ? "Update Product"
//                       : "Add Product"
//                     }
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stock Management Modal */}
//       {showStockModal && stockProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//             <div className="p-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Update Stock - {stockProduct.name}
//               </h3>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Current Stock: {stockProduct.stock}
//                   </label>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     New Stock Quantity
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={stockAmount}
//                     onChange={(e) => setStockAmount(e.target.value)}
//                     placeholder={stockProduct.stock.toString()}
//                   />
//                 </div>
                
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowStockModal(false);
//                       setStockProduct(null);
//                       setStockAmount('');
//                     }}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleStockUpdate}
//                     disabled={!stockAmount || updateProductMutation.isPending}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {updateProductMutation.isPending ? "Updating..." : "Update Stock"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
