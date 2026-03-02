# NeuroFog — Detect. Prevent. Recover.

A privacy-first cognitive health system that detects mental overload in real-time, quantifies it as a Cognitive Fog Index, and applies smart digital interventions to help you maintain optimal cognitive performance.

![NeuroFog Dashboard](./public/images/dashboard-preview.png)

## 🧠 What is NeuroFog?

NeuroFog is an intelligent cognitive monitoring system that tracks your digital behavior patterns to detect cognitive overload before it becomes overwhelming. By analyzing subtle changes in your typing patterns, mouse movements, and interaction behaviors, NeuroFog calculates your real-time Cognitive Fog Index (CFI) and provides personalized interventions.

### Key Features

- **🎯 Real-time CFI Monitoring**: Track your cognitive load with our proprietary Cognitive Fog Index (0-100 scale)
- **🧭 Cognitive Compass**: Visual representation of your mental state and attention stability  
- **📊 Cognitive Timeline**: Historical view of your cognitive patterns throughout the day
- **🌱 NeuroGarden**: Gamified cognitive wellness with virtual gardens that reflect your mental state
- **🎨 NeuroPatch**: Personalized visual therapy sessions based on your cognitive needs
- **🎤 Voice Analysis**: Advanced voice pattern analysis for deeper cognitive insights
- **☕ Focus Cafe**: Immersive focus sessions with customizable environments
- **📝 Reflection Prompts**: Guided self-reflection to improve cognitive awareness
- **🔒 Privacy-First**: All data processing happens locally - your information never leaves your device

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- pnpm, npm, or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neurofog.git
   cd neurofog/src
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see NeuroFog in action.

## 🎮 How to Use NeuroFog

### Initial Setup

1. **Profile Selection**: Choose your user type (Student, Professional, Creative, etc.) for personalized experiences
2. **Tutorial**: Complete the onboarding tutorial to understand NeuroFog's features
3. **Baseline Calibration**: Use the system for 10-15 minutes to establish your cognitive baseline

### Daily Usage

1. **Monitor Your CFI**: Keep an eye on your Cognitive Fog Index in the dashboard
2. **Use Interventions**: When your CFI rises, try recommended interventions:
   - **NeuroGarden**: Tend to your virtual garden for mindful breaks
   - **Focus Cafe**: Enter immersive focus sessions
   - **NeuroPatch**: Experience visual therapy sessions
3. **Track Progress**: Review your cognitive timeline to identify patterns
4. **Reflect**: Use guided reflection prompts to build cognitive awareness

### Understanding Your CFI

- **0-20 (Clear)**: 🟢 Optimal cognitive state, high focus and clarity
- **21-40 (Mild)**: 🟡 Slight cognitive load, manageable with awareness
- **41-60 (Moderate)**: 🟠 Noticeable mental fatigue, interventions recommended
- **61-80 (Heavy)**: 🔴 Significant cognitive overload, break needed
- **81-100 (Critical)**: ⚫ Severe mental exhaustion, immediate rest required

## 🛠️ Technology Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS 4.2
- **UI Components**: Radix UI + Custom Component Library
- **State Management**: React Context + Hooks
- **Charts**: Recharts
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Development**: TypeScript 5.7, ESLint

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main dashboard
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── deep-focus/        # Deep focus session pages
├── components/            # React components
│   ├── cfi-gauge.tsx      # CFI visualization
│   ├── cognitive-compass.tsx
│   ├── neurogarden.tsx    # Virtual garden component
│   ├── neuropatch.tsx     # Visual therapy
│   ├── voice-analysis-widget.tsx
│   ├── cafe/              # Focus cafe components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility libraries
│   ├── cognitive-engine.ts # Core CFI calculation
│   ├── voice-analysis.ts  # Voice processing
│   ├── personalization.ts # User personalization
│   └── utils.ts           # Helper functions
├── hooks/                 # Custom React hooks
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the src directory:

```env
# Optional: Analytics (if using Vercel Analytics)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Optional: Voice Analysis API (if using external services)
VOICE_ANALYSIS_API_KEY=your_api_key
```

### Personalization

NeuroFog adapts to your usage patterns automatically. You can customize:

- **User Type**: Student, Professional, Creative, Researcher, etc.
- **Sensitivity**: How quickly the system responds to cognitive changes
- **Intervention Preferences**: Which types of interventions you prefer
- **Garden Themes**: Visual themes for your NeuroGarden

## 🧪 Development

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type checking
npx tsc --noEmit
```

### Adding New Components

1. Create component in appropriate directory under `components/`
2. Export from component file
3. Add to main dashboard in `app/page.tsx` if needed
4. Update TypeScript types if necessary

### Cognitive Engine Customization

The cognitive engine is highly configurable. Edit `lib/cognitive-engine.ts` to:

- Adjust CFI calculation algorithms
- Modify signal weighting
- Add new cognitive signals
- Customize baseline calibration

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Privacy & Security

NeuroFog is built with privacy as a core principle:

- **Local Processing**: All cognitive analysis happens on your device
- **No Data Collection**: We don't collect, store, or transmit your personal data
- **Open Source**: Full transparency in our code and algorithms
- **No Tracking**: No cookies, analytics, or behavioral tracking beyond what you control

## 📚 Research & Background

NeuroFog is based on research in cognitive psychology, human-computer interaction, and digital wellbeing. Our Cognitive Fog Index is inspired by:

- Cognitive load theory
- Attention residue research
- Digital burnout studies
- Biometric stress indicators

## 🆘 Support

- **Documentation**: Check our [Wiki](wiki) for detailed guides
- **Issues**: Report bugs on [GitHub Issues](issues)
- **Discussions**: Join community discussions on [GitHub Discussions](discussions)
- **Email**: support@neurofog.com

## 🗺️ Roadmap

### Upcoming Features

- [ ] Mobile app (React Native)
- [ ] Team dashboard for organizations
- [ ] Advanced voice analysis with emotion detection
- [ ] Integration with calendar and productivity tools
- [ ] Machine learning for predictive cognitive load
- [ ] Wearable device integration
- [ ] Social features (anonymous community insights)

### Long-term Vision

- Become the standard for cognitive health monitoring
- Enable organizations to support employee wellbeing
- Advance research in digital cognitive health
- Build a healthier relationship with technology

---

**NeuroFog** - Because your cognitive health matters. 🧠✨

Made with ❤️ for a healthier digital future.