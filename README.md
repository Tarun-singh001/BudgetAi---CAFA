# Budget Buddy AI - Payment Mediator

A smart mobile-first **Payment Mediator** and budget tracking app that acts as an intelligent intermediary between users and payment applications, providing budget analysis and financial insights before payments are made.

## 🎯 **What is Budget Buddy AI?**

Budget Buddy AI is **NOT a payment app** - it's a **smart financial mediator** that:

1. **Captures Payment Intent** - Scan QR codes, enter UPI IDs, account details
2. **Analyzes Budget Impact** - Shows how payment affects your budget categories
3. **Routes to Payment Apps** - Redirects to GPay, PhonePe, Paytm, etc.
4. **Tracks Everything** - Unified transaction history across all payment methods
5. **Provides Financial Intelligence** - AI-powered insights and recommendations

## 🔄 **How It Works**

**User** → **Budget Buddy AI** → **Payment App** → **Vendor**

- **Step 1**: User scans QR/enters payment details in Budget Buddy AI
- **Step 2**: App analyzes budget impact and shows recommendations
- **Step 3**: User selects budget category and payment app
- **Step 4**: App redirects to chosen payment app with pre-filled details
- **Step 5**: Payment app processes the actual transaction
- **Step 6**: Budget Buddy AI tracks and analyzes the completed transaction

## ✨ **Key Features**

### 🎯 **Payment Mediation**
- **QR Code Scanning** - Capture payment intent from QR codes
- **UPI Integration** - Support for UPI IDs, numbers, and account details
- **Multi-App Routing** - Redirect to GPay, PhonePe, Paytm, BHIM, Amazon Pay, CRED
- **Smart Categorization** - Automatic budget allocation based on payment context

### 📊 **Budget Management**
- **Real-time Tracking** - Monitor spending across all payment methods
- **Category-based Budgets** - Set limits for food, transport, entertainment, etc.
- **Spending Alerts** - Get notified before exceeding budget limits
- **Budget Locking** - Prevent overspending with AI recommendations

### 🤖 **AI-Powered Insights**
- **Personalized Planning** - Age, lifestyle, and goal-based budget allocation
- **Spending Pattern Analysis** - Identify trends and optimization opportunities
- **Smart Recommendations** - AI suggests better spending timing and methods
- **Financial Health Score** - Overall financial wellness assessment

### 📱 **Mobile-First Experience**
- **Responsive Design** - Optimized for mobile and desktop
- **Dark/Light Mode** - Beautiful themes with smooth transitions
- **Gesture Support** - Intuitive mobile interactions
- **Offline Capability** - Works without internet connection

## 🛠 **Technology Stack**

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **State Management**: React Context API with useReducer
- **Forms**: React Hook Form with validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Mobile**: Capacitor for native app conversion

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ and npm
- Modern browser with ES6+ support

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd budget-buddy-ai

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run preview
```

### Mobile App Conversion
```bash
npm run mobile
npx cap sync
npx cap open android  # or ios
```

## 📱 **App Structure**

```
/                    # Payment Mediator (Main Entry)
├── /dashboard       # Financial Dashboard
│   ├── /            # Budget Overview & Summary
│   ├── /expenses    # Expense Tracking & History
│   ├── /ai          # AI Budget Planner
│   └── /settings    # App Configuration
```

## 🎨 **Design System**

### Color Palette
- **Primary**: Purple (#7c3aed) - Trust and innovation
- **Secondary**: Slate - Professional and clean
- **Accent**: Green - Success and growth
- **Semantic Colors**: Success, warning, error states

### Typography
- **Font Family**: Inter - Modern and readable
- **Hierarchy**: Clear heading and body text scales
- **Accessibility**: High contrast ratios and readable sizes

### Components
- **Glassmorphism**: Modern frosted glass effects
- **Micro-interactions**: Smooth animations and transitions
- **Responsive**: Mobile-first with progressive enhancement

## 🔧 **Configuration**

### Environment Variables
```env
VITE_APP_NAME=Budget Buddy AI
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration
Custom design tokens and component classes in `tailwind.config.js`

## 💾 **Data Persistence**

- **Local Storage**: User preferences and app state
- **Context API**: Global state management
- **Offline Support**: Works without internet connection

## 🚀 **Deployment**

### Web App
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Mobile App
```bash
npm run mobile
npx cap build
# Open in Xcode/Android Studio for final builds
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details

## 🆘 **Support**

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions for help and ideas

---

**Budget Buddy AI** - Making every payment smarter with budget intelligence! 💰🧠✨


