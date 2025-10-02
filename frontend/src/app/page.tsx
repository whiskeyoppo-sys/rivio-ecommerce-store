// Scaffolded - Homepage with product grid
// Design choice: Server-side rendering for SEO and performance

import { Suspense } from 'react';
import { ProductGrid } from '@/components/features/ProductGrid';
import { HeroBanner } from '@/components/features/HeroBanner';
import { CategoryList } from '@/components/features/CategoryList';

export default async function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <HeroBanner />
      
      {/* Categories */}
      <section className="my-12">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoryList />
        </Suspense>
      </section>
      
      {/* Featured Products */}
      <section className="my-12">
        <h2 className="mb-6 text-2xl font-bold">Featured Products</h2>
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductGrid />
        </Suspense>
      </section>
    </div>
  );
}
