import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Sparkles, 
  Users, 
  BookOpen, 
  Download 
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Cook, Share, and
              <span className="text-orange-500"> Discover</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create and share amazing recipes with our community. Extract recipes from your favorite 
              blogs and YouTube videos using AI, then make them your own.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/recipes">
                <Button variant="outline" size="lg" className="px-8">
                  Explore Recipes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage recipes
            </h2>
            <p className="text-xl text-gray-600">
              From creation to sharing, we&apos;ve got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Extraction */}
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI-Powered Extraction
              </h3>
              <p className="text-gray-600">
                Extract recipes from any blog or YouTube video using our advanced AI. 
                Just paste the URL and let us do the work.
              </p>
            </div>

            {/* Community */}
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Share & Discover
              </h3>
              <p className="text-gray-600">
                Share your creations with the community and discover amazing recipes 
                from fellow food enthusiasts.
              </p>
            </div>

            {/* Organization */}
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Organize Everything
              </h3>
              <p className="text-gray-600">
                Keep your recipes organized with categories, tags, and personal collections. 
                Never lose a great recipe again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start your culinary journey?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks who are already using Parikar to organize 
            and share their favorite recipes.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-orange-500 hover:bg-gray-50 px-8">
              Create Your Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}