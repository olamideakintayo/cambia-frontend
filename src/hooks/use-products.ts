"use client"

import { useState, useEffect, useCallback } from "react"
import { productService, type ProductSearchParams, type ProductListResponse } from "@/lib/services/product-service"
import type { Product } from "@/lib/api-types"
import { useToast } from "./use-toast"

interface UseProductsReturn {
  products: Product[]
  pagination: ProductListResponse["pagination"] | null
  filters: ProductListResponse["filters"] | null
  isLoading: boolean
  error: string | null
  searchProducts: (params: ProductSearchParams) => Promise<void>
  loadMore: () => Promise<void>
  refreshProducts: () => Promise<void>
}

export function useProducts(initialParams: ProductSearchParams = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<ProductListResponse["pagination"] | null>(null)
  const [filters, setFilters] = useState<ProductListResponse["filters"] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentParams, setCurrentParams] = useState<ProductSearchParams>(initialParams)
  const { toast } = useToast()

  const searchProducts = useCallback(async (params: ProductSearchParams) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await productService.searchProducts(params)

      if (response.success && response.data) {
        setProducts(response.data.products)
        setPagination(response.data.pagination)
        setFilters(response.data.filters)
        setCurrentParams(params)
      } else {
        setError(response.message || "Failed to load products")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading products")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!pagination || pagination.page >= pagination.totalPages || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      const nextPage = pagination.page + 1
      const response = await productService.searchProducts({
        ...currentParams,
        page: nextPage,
      })

        if (response.success && response.data) {
            setProducts((prev) => [...prev, ...(response.data?.products ?? [])])
            setPagination(response.data?.pagination ?? null)
        }

    } catch (err: any) {
      toast({
        title: "Failed to load more products",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [pagination, currentParams, isLoading, toast])

  const refreshProducts = useCallback(async () => {
    await searchProducts(currentParams)
  }, [searchProducts, currentParams])

  // Load initial products
  useEffect(() => {
    searchProducts(initialParams)
  }, []) // Only run on mount

  return {
    products,
    pagination,
    filters,
    isLoading,
    error,
    searchProducts,
    loadMore,
    refreshProducts,
  }
}

// Hook for managing a single product
interface UseProductReturn {
  product: Product | null
  isLoading: boolean
  error: string | null
  updateProduct: (data: any) => Promise<boolean>
  deleteProduct: () => Promise<boolean>
  uploadImages: (images: File[]) => Promise<boolean>
  refreshProduct: () => Promise<void>
}

export function useProduct(productId: string): UseProductReturn {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const refreshProduct = useCallback(async () => {
    if (!productId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await productService.getProduct(productId)

      if (response.success && response.data) {
        setProduct(response.data)
      } else {
        setError(response.message || "Failed to load product")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading product")
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  const updateProduct = useCallback(
    async (data: any): Promise<boolean> => {
      if (!productId) return false

      try {
        setIsLoading(true)
        const response = await productService.updateProduct(productId, data)

        if (response.success && response.data) {
          setProduct(response.data)
          toast({
            title: "Product updated",
            description: "Your product has been successfully updated.",
          })
          return true
        } else {
          toast({
            title: "Update failed",
            description: response.message || "Failed to update product",
            variant: "destructive",
          })
          return false
        }
      } catch (err: any) {
        toast({
          title: "Update failed",
          description: err.message || "An error occurred while updating product",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [productId, toast],
  )

  const deleteProduct = useCallback(async (): Promise<boolean> => {
    if (!productId) return false

    try {
      setIsLoading(true)
      const response = await productService.deleteProduct(productId)

      if (response.success) {
        toast({
          title: "Product deleted",
          description: "Your product has been successfully deleted.",
        })
        return true
      } else {
        toast({
          title: "Delete failed",
          description: response.message || "Failed to delete product",
          variant: "destructive",
        })
        return false
      }
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message || "An error occurred while deleting product",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [productId, toast])

  const uploadImages = useCallback(
    async (images: File[]): Promise<boolean> => {
      if (!productId) return false

      try {
        setIsLoading(true)
        const response = await productService.uploadProductImages(productId, images)

        if (response.success) {
          await refreshProduct() // Refresh to get updated images
          toast({
            title: "Images uploaded",
            description: "Product images have been successfully uploaded.",
          })
          return true
        } else {
          toast({
            title: "Upload failed",
            description: response.message || "Failed to upload images",
            variant: "destructive",
          })
          return false
        }
      } catch (err: any) {
        toast({
          title: "Upload failed",
          description: err.message || "An error occurred while uploading images",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [productId, toast, refreshProduct],
  )

  // Load product on mount
  useEffect(() => {
    if (productId) {
      refreshProduct()
    }
  }, [productId, refreshProduct])

  return {
    product,
    isLoading,
    error,
    updateProduct,
    deleteProduct,
    uploadImages,
    refreshProduct,
  }
}
