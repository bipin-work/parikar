// This file creates the /recipes route automatically!
// Because it's in src/app/recipes/page.tsx

import Link from 'next/link' // Next.js navigation

export default function RecipesPage() {
  return (
    <div style={{ padding: '20px' }}>
      {/* Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <Link 
          href="/"
          style={{
            color: '#ff6b35',
            textDecoration: 'none'
          }}
        >
          ← Back to Home
        </Link>
      </div>
      
      <h1>🍲 All Recipes</h1>
      <p>This is your recipes page!</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Sample Recipes (we'll make these dynamic later):</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '20px' 
        }}>
          {/* Sample recipe cards */}
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px',
            backgroundColor: 'white'
          }}>
            <h3>🍝 Spaghetti Carbonara</h3>
            <p>Classic Italian pasta dish</p>
            <p><strong>Time:</strong> 20 mins</p>
          </div>
          
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px',
            backgroundColor: 'white'
          }}>
            <h3>🍛 Chicken Curry</h3>
            <p>Spicy and flavorful curry</p>
            <p><strong>Time:</strong> 45 mins</p>
          </div>
          
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px',
            backgroundColor: 'white'
          }}>
            <h3>🥗 Caesar Salad</h3>
            <p>Fresh and crispy salad</p>
            <p><strong>Time:</strong> 15 mins</p>
          </div>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#e8f4fd',
        borderRadius: '8px'
      }}>
        <p><strong>🎯 Learning Point:</strong> This page exists at <code>/recipes</code> because we created the file at <code>src/app/recipes/page.tsx</code></p>
        <p><strong>🔗 Navigation:</strong> We use <code>Link</code> from Next.js instead of anchor tags for faster navigation!</p>
      </div>
    </div>
  )
}