# Firm AI - Business Location Analyzer

A sophisticated business location analysis tool that helps entrepreneurs and business owners make data-driven decisions about where to establish their businesses.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- Supabase account
- Mapbox account

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=your_supabase_url
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/firm-ai.git
cd firm-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠 Development

### Project Structure

```
firm-ai/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Library configurations
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── supabase/
│   └── migrations/    # Database migrations
└── public/           # Static assets
```

### Key Technologies

#### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for routing
- **Lucide React** for icons
- **React Hot Toast** for notifications

#### Data Visualization
- **Recharts** for charts
- **Mapbox GL** for maps
- **React Map GL** for React map components

#### State Management & Data
- **Supabase** for:
  - Authentication
  - Real-time data
  - PostgreSQL database
  - Row Level Security (RLS)

### Database Setup

1. Connect to Supabase:
   - Click "Connect to Supabase" button in the top right
   - Follow the authentication flow

2. Run migrations:
   - Migrations are automatically applied when connecting to Supabase
   - Check `supabase/migrations/` for schema details

### Authentication

The app uses Supabase Authentication with:
- Email/password sign up
- Row Level Security (RLS) policies
- Protected routes
- Admin/user role separation

### Admin Access

To access admin features:
1. Create an account with email: `super_admin@example.com`
2. This account will automatically have admin privileges
3. Access admin portal at `/admin`

## 📦 Building for Production

1. Build the project:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

## 🧪 Testing

Run tests:
```bash
npm run test
```

## 🔒 Security

### Database Security

- Row Level Security (RLS) enabled on all tables
- Proper policy configuration for data access
- Secure authentication flow
- Protected admin routes and actions

### API Security

- Environment variables for sensitive data
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration

## 🚀 Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy using the following settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18+

### Environment Variables for Production

Required environment variables:
```
VITE_MAPBOX_ACCESS_TOKEN
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_URL
```

## 📚 API Documentation

### Supabase Schema

#### Tables

1. `profiles`
   - User profiles with contact information
   - RLS enabled for user-specific access

2. `business_interests`
   - Business investment interests
   - Linked to user profiles

3. `business_proposals`
   - Investment proposals
   - Connects investors with businesses

4. `notifications`
   - System notifications
   - Real-time updates

5. `subscriptions`
   - User subscription management
   - Payment status tracking

6. `admin_users`
   - Admin user management
   - Special privileges

### Map Integration

The app uses Mapbox GL for:
- Location visualization
- Business density heatmaps
- Competitor mapping
- Area analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support:
- Open an issue
- Contact: support@firmai.com
- Documentation: [help center](/help)

## 🔄 Updates

Check [CHANGELOG.md](CHANGELOG.md) for version history and updates.