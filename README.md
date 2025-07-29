# Parikar - Recipe Sharing App

A modern, full-stack recipe sharing application built with Next.js 15 that allows users to create, share, and discover recipes with AI-powered extraction from blogs and YouTube videos.

## 🚀 Features

### Core Features
- **Recipe Management**: Create, edit, delete, and organize your recipes
- **AI-Powered Extraction**: Extract recipes from blogs and YouTube videos using OpenAI
- **Recipe Sharing**: Share recipes with other users in the community
- **Save Recipes**: Bookmark and save your favorite recipes
- **Rating System**: Rate and review recipes from other users
- **User Profiles**: Manage your profile and follow other users
- **Search & Filter**: Advanced search with filters by category, difficulty, and more

### Technical Features
- **Authentication**: Secure authentication with NextAuth.js (Email, Google OAuth)
- **Database**: PostgreSQL with Prisma ORM
- **Image Upload**: Cloudinary integration for recipe images
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **Real-time**: Real-time notifications with React Hot Toast
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Zod schema validation

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and responsive design
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **NextAuth.js** - Authentication
- **Zod** - Schema validation

### External Services
- **OpenAI API** - AI recipe extraction
- **YouTube Data API** - Video metadata
- **Cloudinary** - Image storage and optimization
- **Cheerio** - Web scraping for blog content

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/bipin-work/parikar.git
cd parikar
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.local` and fill in your values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/parikar_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (optional)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@yourapp.com"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# YouTube Data API
YOUTUBE_API_KEY="your-youtube-api-key"
```

### 4. Set up the database
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄 Database Schema

The application uses the following main models:

- **User**: User accounts and profiles
- **Recipe**: Recipe content and metadata
- **Ingredient**: Recipe ingredients
- **Category**: Recipe categories
- **Tag**: Recipe tags
- **Rating**: Recipe ratings and reviews
- **SavedRecipe**: User saved recipes
- **SharedRecipe**: Recipe sharing between users
- **Follow**: User following system

## 🔧 API Endpoints

### Recipes
- `GET /api/recipes` - List recipes with pagination and filters
- `POST /api/recipes` - Create a new recipe
- `GET /api/recipes/[id]` - Get recipe details
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe
- `POST /api/recipes/extract` - Extract recipe from URL using AI

### Recipe Actions
- `POST /api/recipes/[id]/save` - Save a recipe
- `DELETE /api/recipes/[id]/save` - Unsave a recipe
- `POST /api/recipes/[id]/share` - Share recipe with user
- `POST /api/recipes/[id]/rate` - Rate a recipe

### Authentication
- `GET|POST /api/auth/[...nextauth]` - NextAuth.js endpoints

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
```

### Database Management
```bash
# View and edit data
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate migration
npx prisma migrate dev
```

## 🚀 Deployment

### Using Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Using Docker
```bash
docker build -t parikar .
docker run -p 3000:3000 parikar
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Prisma](https://prisma.io/) for the excellent ORM
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [OpenAI](https://openai.com/) for the AI capabilities
- [Vercel](https://vercel.com/) for hosting and deployment

## 📞 Support

For support, email support@parikar.com or join our Discord server.

---

Made with ❤️ by [Bipin](https://github.com/bipin-work)
