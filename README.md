# AskTRACE Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Web Speech API](https://img.shields.io/badge/Web_Speech_API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![AI](https://img.shields.io/badge/AI_Interface-FF6F00?style=for-the-badge&logo=openai&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

A modern, ChatGPT-like interface for asking questions about TRACE survey data.

## Overview

AskTRACE Frontend provides a sleek, intuitive user interface for interacting with the [TRACE LLM](https://github.com/cyse7125-sp25-team03/trace-llm.git) backend. Users can have natural conversations with the system and extract insights from TRACE survey data without needing to parse through complex survey results themselves.

<!--
## Screenshots

### Chat Interface
![Chat Interface](screenshots/chat-interface.png)

### Mobile View
![Mobile View](screenshots/mobile-view.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

### Voice Input
![Voice Input](screenshots/voice-input.png)
-->

## Features

- **ChatGPT-like Interface**: Modern, responsive chat interface similar to ChatGPT/Claude
- **Conversation History**: Maintains chat history across sessions with local storage
- **Streaming Text Responses**: AI responses appear letter by letter for a natural feel
- **Voice Input**: Speak your questions using the built-in voice recognition
- **Text-to-Speech**: Listen to AI responses with the built-in text-to-speech
- **Persistent Chat Management**: Create, rename, and delete conversations
- **Real-time API Health Monitoring**: Visual indicator of API status
- **Mobile Responsive**: Works seamlessly on mobile and desktop devices
- **Dark Mode**: Elegant dark theme for reduced eye strain

## Tech Stack

- **React**: Frontend library for building the user interface
- **TypeScript**: Type safety for JavaScript
- **Vite**: Modern frontend tooling for development and building
- **Material UI**: Component library for the user interface
- **Axios**: HTTP client for API communication
- **Web Speech API**: Browser API for voice recognition and text-to-speech
- **Local Storage**: For persisting chat data between sessions

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- A modern web browser (Chrome, Edge, or Safari recommended for full feature support)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/cyse7125-sp25-team03/trace-llm-frontend.git
cd trace-llm-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

## Running Locally

Start the development server:
```bash
npm run dev
# or
yarn dev
```

This will start the application on `http://localhost:3000` by default.

## Building for Production

Create a production build:
```bash
npm run build
# or
yarn build
```

Preview the production build locally:
```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
trace-llm-frontend/
├── public/                 # Static files
├── src/
│   ├── api/                # API services
│   │   ├── apiService.ts   # Query API service
│   │   ├── healthService.ts # Health check service
│   │   └── axiosConfig.ts  # Axios configuration
│   ├── components/         # React components
│   │   ├── chat/           # Chat-related components
│   │   └── layout/         # Layout components
│   ├── contexts/           # React contexts
│   │   └── ChatContext.tsx # Chat state management
│   ├── hooks/              # Custom React hooks
│   ├── theme/              # Theme configuration
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Main type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── index.html              # HTML template
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── vercel.json             # Vercel deployment configuration
└── package.json            # Project dependencies and scripts
```

## Configuration

### Environment Variables

No environment variables are required for basic functionality. The application uses relative API paths that work with the Vercel deployment configuration.

### API Configuration

By default, the application is configured to call the AskTRACE API at:
- Development: Through a Vite proxy to avoid CORS issues
- Production: Through Vercel's rewrites to `https://asktrace.prd.gcp.csyeteam03.xyz`

To change the API endpoint, modify the `API_BASE_URL` in:
- `src/api/apiService.ts`
- `src/api/healthService.ts`

## Deployment

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Connect your repository to Vercel

3. Set up your deployment:
   - Framework Preset: Vite
   - Build Command: `npm run build` or `yarn build`
   - Output Directory: `dist`
   - Install Command: `npm install` or `yarn`

4. Deploy!

### Handling API Requests

The application is configured to proxy API requests to the AskTRACE backend using Vercel's rewrites feature. This is defined in the `vercel.json` file:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://asktrace.prd.gcp.csyeteam03.xyz/:path*"
    }
  ]
}
```

## Related Repositories

This frontend application is part of the TRACE Application Suite:

- [api-server](https://github.com/cyse7125-sp25-team03/api-server.git) - Main API service backend
- [trace-processor](https://github.com/cyse7125-sp25-team03/trace-processor.git) - Processes trace surveys
- [trace-consumer](https://github.com/cyse7125-sp25-team03/trace-consumer.git) - Consumes processed trace data
- [embedding-service](https://github.com/cyse7125-sp25-team03/embedding-service.git) - Generates vector embeddings
- [trace-llm](https://github.com/cyse7125-sp25-team03/trace-llm.git) - Provides natural language interface
- [trace-frontend](https://github.com/cyse7125-sp25-team03/trace-frontend.git) - Main TRACE application frontend
- [helm-charts](https://github.com/cyse7125-sp25-team03/helm-charts.git) - Helm charts for deployment

## Customization

### Changing the Theme

The application theme is defined in `src/theme/theme.ts`. Modify this file to change colors, typography, and other visual aspects.

### Adding New Features

Most application logic is in the `ChatContext.tsx` file, which manages state and interactions with the API. Add new features by:

1. Extending the context with new state and functions
2. Creating new components in the `components` directory
3. Connecting components to the context using the `useChat` hook

## Browser Support

- **Full Support**: Chrome, Edge, Safari (latest versions)
- **Partial Support**: Firefox (voice features may be limited)
- **Not Recommended**: Internet Explorer

## Troubleshooting

### API Connection Issues

If the health indicator shows red (API down):

1. Check if the AskTRACE API is running
2. Verify your Vercel proxy configuration
3. Check for any CORS or network issues in the browser console

### Voice Recognition Not Working

Voice recognition requires:

1. A supported browser (Chrome, Edge, or Safari)
2. Microphone permissions granted to the site
3. A stable internet connection (for some browser implementations)

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.