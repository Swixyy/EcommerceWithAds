import Link from "next/link";
import { ShoppingBag, Smartphone, Laptop, Headphones } from "lucide-react";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import AdvertisementBanner from "@/components/ads/AdvertisementBanner";
import ProductRecommendations from "@/components/ads/ProductRecommendations";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to TechShop
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover the latest technology products with personalized recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/products?category=laptops"
              className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow"
            >
              <Laptop className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Laptops</h3>
              <p className="text-gray-600">High-performance laptops for work and gaming</p>
            </Link>
            <Link
              href="/products?category=smartphones"
              className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow"
            >
              <Smartphone className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Smartphones</h3>
              <p className="text-gray-600">Latest smartphones and mobile devices</p>
            </Link>
            <Link
              href="/products?category=accessories"
              className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow"
            >
              <Headphones className="h-16 w-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2">Accessories</h3>
              <p className="text-gray-600">Tech accessories and peripherals</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TechShop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Shopping</h3>
              <p className="text-gray-600">
                Get product recommendations based on your preferences and browsing history
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Latest Products</h3>
              <p className="text-gray-600">
                Stay up-to-date with the newest technology products and releases
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                All products are carefully selected and come with our quality guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Banner */}
      <AdvertisementBanner position="top" />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Product Recommendations */}
      <ProductRecommendations title="Recommended for You" limit={4} />

      {/* Advertisement Banner */}
      <AdvertisementBanner position="bottom" />

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of satisfied customers and discover your next favorite tech product
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
