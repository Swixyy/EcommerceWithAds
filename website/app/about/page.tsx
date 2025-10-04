import Link from "next/link"
import Image from "next/image"
import { 
  ShoppingBag, 
  Users, 
  Award, 
  Shield, 
  Truck, 
  Heart,
  Star,
  Target,
  Zap,
  Globe,
  CheckCircle,
  TrendingUp
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About TechShop
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Your trusted destination for cutting-edge technology products with personalized recommendations and exceptional service
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2020, TechShop emerged from a simple vision: to make cutting-edge technology 
                accessible to everyone. What started as a small online store has grown into a comprehensive 
                platform that serves thousands of customers worldwide.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that technology should enhance your life, not complicate it. That's why we've 
                built our platform with personalized recommendations, smart advertising, and user-friendly 
                features that make shopping for tech products a delightful experience.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <span className="text-gray-600 font-medium">4.9/5 customer rating</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                    <div className="text-gray-600">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
                    <div className="text-gray-600">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                    <div className="text-gray-600">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                    <div className="text-gray-600">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to revolutionizing the way people discover and purchase technology products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Personalization</h3>
              <p className="text-gray-600">
                Our AI-powered recommendation engine learns your preferences to suggest products 
                you'll love, making every shopping experience unique and relevant.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Security</h3>
              <p className="text-gray-600">
                Your data and transactions are protected with enterprise-grade security. 
                We're committed to transparency and privacy in everything we do.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Every decision we make is guided by what's best for our customers. 
                From product selection to customer service, you're always our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Innovation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform leverages cutting-edge technology to deliver an exceptional shopping experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Advertising</h3>
              <p className="text-gray-600 text-sm">
                Personalized ads that show you relevant products without being intrusive
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-green-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Volume Discounts</h3>
              <p className="text-gray-600 text-sm">
                Automatic discounts when you add multiple products to encourage better deals
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-purple-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Cart</h3>
              <p className="text-gray-600 text-sm">
                Intelligent cart system with discount tracking and expiration management
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-orange-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600 text-sm">
                Worldwide shipping and local support in multiple languages and currencies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TechShop?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We've built our platform with features that make shopping for technology products effortless and rewarding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Recommendations</h3>
                  <p className="text-gray-600">
                    Our AI learns from your browsing history and preferences to suggest products you'll actually want to buy.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Discount System</h3>
                  <p className="text-gray-600">
                    Get automatic discounts on ads and volume purchases, with time-limited offers that create urgency.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Upsell Features</h3>
                  <p className="text-gray-600">
                    Discover higher-end products in the same category with special premium discounts.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cross-Category Intelligence</h3>
                  <p className="text-gray-600">
                    Smart algorithms show you products from related categories to expand your options.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Seamless User Experience</h3>
                  <p className="text-gray-600">
                    Intuitive interface designed for both tech enthusiasts and casual shoppers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
                  <p className="text-gray-600">
                    Dynamic pricing, inventory updates, and personalized content that adapts to your behavior.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the passionate individuals behind TechShop's success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Engineering Team</h3>
              <p className="text-gray-600">
                Building the next generation of ecommerce technology with cutting-edge AI and machine learning.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Team</h3>
              <p className="text-gray-600">
                Curating the best technology products and creating experiences that delight our customers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Success</h3>
              <p className="text-gray-600">
                Ensuring every customer has an exceptional experience from discovery to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Future of Tech Shopping?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered their perfect technology products with TechShop
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Start Shopping
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
