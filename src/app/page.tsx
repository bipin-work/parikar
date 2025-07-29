// This is our homepage - like App.js in regular React
// In Next.js, this file automatically becomes your "/" route

// We'll add some interactivity to learn about 'use client'
'use client' // This tells Next.js this component needs to run on the client (browser)

import { useState } from 'react'
import Link from 'next/link' // Next.js navigation component

export default function HomePage() {
  // This is just like React! useState works the same way
  const [recipesCount, setRecipesCount] = useState(0)
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🍳 Welcome to Parikar!</h1>
      <p>Your Recipe Sharing App</p>
      
      {/* Navigation */}
      <div style={{ marginTop: '20px' }}>
        <Link 
          href="/recipes"
          style={{
            padding: '12px 24px',
            backgroundColor: '#ff6b35',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block'
          }}
        >
          View All Recipes →
        </Link>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h2>What we'll learn to build:</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✅ Create and share recipes</li>
          <li>✅ Extract recipes from blogs using AI</li>
          <li>✅ Save your favorite recipes</li>
          <li>✅ User authentication</li>
        </ul>
      </div>
      
      {/* Let's add some interactivity! */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f0f0f0',
        borderRadius: '8px'
      }}>
        <p><strong>Interactive Demo:</strong></p>
        <p>Recipes in your collection: {recipesCount}</p>
        <button 
          onClick={() => setRecipesCount(recipesCount + 1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff6b35',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Add Recipe
        </button>
        <button 
          onClick={() => setRecipesCount(0)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e8f5e8' }}>
        <p><strong>Step 1 Complete!</strong> You're seeing your first Next.js page!</p>
        <p><em>Notice how we added 'use client' to make it interactive like React!</em></p>
      </div>
    </div>
  )
}