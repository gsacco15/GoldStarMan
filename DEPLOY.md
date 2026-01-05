# Deploy Gold Star Man

## Quick Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gsacco15/GoldStarMan/tree/claude/gold-star-man-mvp-14h2M)

### Manual Vercel Deployment

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import repository: `GoldStarMan`
5. Select branch: `claude/gold-star-man-mvp-14h2M`
6. Click "Deploy"

Vercel will automatically:
- Detect Next.js framework
- Install dependencies
- Build the app
- Deploy to a URL like: `https://gold-star-man.vercel.app`

### Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select `GoldStarMan`
4. Branch: `claude/gold-star-man-mvp-14h2M`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"

### Environment Variables

No environment variables needed for the MVP! Everything runs in the browser using localStorage.

### Post-Deployment

Once deployed, you can:
- Share the live URL with others
- Test on mobile devices
- Set up a custom domain (optional)

The app will be fully functional with:
- Goal tracking
- Daily cards
- Calendar view
- Weekly reviews
- All data stored locally in the browser
