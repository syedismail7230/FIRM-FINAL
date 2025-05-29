import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

export function BlogPage() {
  const blogPosts = [
    {
      title: "How AI is Revolutionizing Business Location Selection",
      excerpt: "Discover how artificial intelligence is changing the way businesses choose their locations...",
      author: "Sarah Johnson",
      date: "2025-03-15",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      category: "Technology"
    },
    {
      title: "Top 5 Factors to Consider When Choosing a Business Location",
      excerpt: "Learn about the crucial factors that can make or break your business location decision...",
      author: "Michael Chen",
      date: "2025-03-10",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
      category: "Business"
    },
    {
      title: "Understanding Market Demographics for Better Location Decisions",
      excerpt: "A deep dive into how demographic data can inform your business location strategy...",
      author: "Emily Rodriguez",
      date: "2025-03-05",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      category: "Analytics"
    },
    {
      title: "The Rise of Data-Driven Business Decisions",
      excerpt: "How modern businesses are leveraging data analytics to make smarter choices...",
      author: "David Kim",
      date: "2025-03-01",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3",
      category: "Data Science"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12">Latest Insights</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="glass-card overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                
                <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Categories</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
              All Posts
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              Technology
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              Business
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              Analytics
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              Data Science
            </button>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Get the latest insights and updates delivered to your inbox.
            </p>
            <form className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}