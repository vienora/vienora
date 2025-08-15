import { products } from '@/lib/products';
import ProductPageClient from './ProductPageClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <ProductPageClient />
      <Footer />
    </div>
  );
}
