# Validly 🎯

> Turn Reddit discussions into validated SaaS opportunities with AI-powered market research

Validly is a Next.js application that scrapes weekly Reddit discussions from any subreddit and uses AI to identify genuine SaaS opportunities, market gaps, and user pain points.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🔍 **Smart Reddit Scraping** - Fetches top posts and comments from any subreddit
- 🤖 **AI-Powered Analysis** - Uses Claude to identify actionable SaaS ideas
- 📊 **Opportunity Scoring** - Rates each idea with market viability and urgency scores
- 💡 **Market Intelligence** - Extracts target customers, pricing insights, and competitors
- 🎨 **Clean UI** - Beautiful, responsive interface built with Tailwind CSS v4
- ⚡ **Fast & Type-Safe** - Built with Next.js App Router and TypeScript

## 🚀 How It Works

1. **Scrape** - Uses Decodo API to fetch Reddit HTML from top weekly posts
2. **Structure** - Parses titles and top comments with Cheerio
3. **Analyze** - Sends structured data to Claude for market analysis
4. **Score** - Returns validated SaaS ideas with viability scores and market insights

## 📋 Prerequisites

- Node.js 20+ installed
- A [Decodo](https://visit.decodo.com/oNza7b) API key (for Reddit scraping)
- An [Anthropic](https://console.anthropic.com) API key (for AI analysis)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/validly.git
   cd validly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # Required
   DECODO_API_KEY=your_decodo_web_data_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here

   # Optional - Claude model (defaults to claude-opus-5-5)
   ANTHROPIC_MODEL=claude-opus-5-5

   # Optional - Store results in an Insforge table
   INSFORGE_API_KEY=your_insforge_api_key_here
   INSFORGE_URL=https://your-project.insforge.app
   INSFORGE_RESULTS_TABLE=validated_saas_ideas
   INSFORGE_TIMEOUT_MS=90000

   # Optional - Customize Decodo scraping behavior
   DECODO_PROXY_POOL=premium
   DECODO_HEADLESS_MODE=html
   DECODO_TIMEOUT_MS=60000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting API Keys

### Decodo API Key
1. Visit [Decodo](https://visit.decodo.com/oNza7b)
2. Sign up for an account
3. Navigate to your dashboard
4. Copy your API key

### Anthropic API Key
1. Visit [console.anthropic.com](https://console.anthropic.com) (a Claude.ai subscription does not include API access)
2. Add API credits under Billing
3. Create a key under API Keys

## 📁 Project Structure

```
validly/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for Reddit analysis
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main UI page
├── lib/
│   ├── env.ts                    # Environment variable validation
│   ├── ai.ts                     # Claude analysis + optional Insforge storage
│   ├── reddit.ts                 # Reddit scraping & parsing
│   └── types.ts                  # TypeScript type definitions
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

## 🔌 API Endpoint

### `POST /api/analyze`

Analyzes a subreddit for SaaS opportunities.

**Request Body:**
```json
{
  "subreddit": "saas"
}
```

**Response:**
```json
{
  "ideas": [
    {
      "title": "AI-Powered Email Automation for SMBs",
      "description": "...",
      "target_customers": ["Small businesses", "Marketing agencies"],
      "estimated_pricing": "$29-99/month",
      "market_score": 8,
      "urgency_score": 7,
      "competitors": ["Mailchimp", "ActiveCampaign"],
      "source_threads": [
        {
          "title": "Struggling with email automation...",
          "thread_url": "https://reddit.com/r/saas/..."
        }
      ]
    }
  ],
  "posts": [...],
  "metadata": {
    "subreddit": "saas",
    "analyzedAt": "2026-05-02T..."
  }
}
```

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Web Scraping:** Cheerio + Decodo API
- **AI Analysis:** Claude (Anthropic SDK)
- **Validation:** Zod
- **JSON Repair:** jsonrepair

## 🎨 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DECODO_API_KEY` | ✅ Yes | - | Your Decodo Web Data API key (Bearer). Prefix with `Basic ` to use a legacy Scraper API token |
| `ANTHROPIC_API_KEY` | ✅ Yes | - | Your Anthropic API key for AI analysis |
| `ANTHROPIC_MODEL` | ❌ No | `claude-opus-5-5` | Claude model to use |
| `ANTHROPIC_WORKSPACE_ID` | ❌ No | - | Workspace ID, only needed if your API key is not scoped to a workspace |
| `INSFORGE_API_KEY` | ❌ No | - | Insforge key, only needed for result storage |
| `INSFORGE_URL` | ❌ No | `https://api.insforge.dev` | Insforge API base URL |
| `INSFORGE_RESULTS_TABLE` | ❌ No | - | Optional database table name |
| `DECODO_PROXY_POOL` | ❌ No | `premium` | Proxy pool type for scraping |
| `DECODO_HEADLESS_MODE` | ❌ No | `html` | Headless browser mode |
| `DECODO_TIMEOUT_MS` | ❌ No | `60000` | Scraping timeout in milliseconds |
| `INSFORGE_TIMEOUT_MS` | ❌ No | `90000` | Insforge storage timeout in milliseconds |

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Decodo](https://visit.decodo.com/oNza7b) for powerful web scraping API
- [Anthropic](https://www.anthropic.com) for Claude
- [Next.js](https://nextjs.org) team for the amazing framework

---

**Built with ❤️ using Next.js, TypeScript, and AI**

`POST /api/analyze`

Request body:

```json
{
	"subreddit": "saas"
}
```

Response shape:

```json
{
	"subreddit": "saas",
	"source": {
		"subreddit": "saas",
		"scrapedAt": "2026-04-13T00:00:00.000Z",
		"posts": [
			{
				"title": "...",
				"comments": ["...", "..."],
				"permalink": "/r/saas/comments/..."
			}
		]
	},
	"ideas": [
		{
			"idea_name": "...",
			"problem": "...",
			"demand_level": "High",
			"existing_solutions": ["..."],
			"user_complaints": ["..."],
			"opportunity": "...",
			"score": 8,
			"verdict": "Strong"
		}
	]
}
```

## Notes

- The Decodo integration is intentionally resilient and tries multiple auth and payload conventions because Decodo account setups can differ.
- Optional Insforge persistence is disabled unless `INSFORGE_RESULTS_TABLE` is set and the target table already exists.
- The route validates both request input and AI output before returning data to the UI.
