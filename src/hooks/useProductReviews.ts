import { useState, useEffect } from 'react';

export interface ProductReview {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  author: string;
  timestamp: number;
}

const STORAGE_KEY = 'product_reviews';

export const useProductReviews = (productId: string) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reviews from localStorage
  useEffect(() => {
    const loadReviews = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const allReviews: ProductReview[] = JSON.parse(stored);
          const productReviews = allReviews.filter(r => r.productId === productId);
          setReviews(productReviews);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [productId]);

  // Add a new review
  const addReview = (rating: number, comment: string, author: string = 'Anonymous') => {
    try {
      const newReview: ProductReview = {
        id: `${productId}_${Date.now()}`,
        productId,
        rating,
        comment,
        author,
        timestamp: Date.now(),
      };

      const stored = localStorage.getItem(STORAGE_KEY);
      const allReviews: ProductReview[] = stored ? JSON.parse(stored) : [];
      allReviews.push(newReview);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));

      setReviews(prev => [...prev, newReview]);
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  };

  // Delete a review
  const deleteReview = (reviewId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allReviews: ProductReview[] = JSON.parse(stored);
        const filtered = allReviews.filter(r => r.id !== reviewId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        return true;
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
    return false;
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Get rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return {
    reviews,
    isLoading,
    addReview,
    deleteReview,
    averageRating,
    ratingDistribution,
    totalReviews: reviews.length,
  };
};
