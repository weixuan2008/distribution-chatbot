# Enterprise Chatbot SDK (Vue 3 + Quasar + TypeScript)

Enterprise-grade chatbot platform that supports:

1. Standalone web app
2. Embeddable SDK (ESM/UMD)
3. Web Component (`<enterprise-chatbot>`)
4. Micro-frontend compatibility

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build Targets

```bash
npm run build              # standalone app
npm run build:sdk          # dist/sdk.esm.js + dist/sdk.umd.js
npm run build:webcomponent # dist/chatbot-element.js
```

## Test

```bash
npm run test
```

## Environment Variables

See `.env.development` and `.env.production`:

- `VITE_CHATBOT_API_BASE_URL`
- `VITE_CHATBOT_TOKEN`
- `VITE_CHATBOT_AGENT_ID`
- `VITE_CHATBOT_AGENT_NAME`
- `VITE_CHATBOT_USER`
- `VITE_CHATBOT_WORKFLOW_ID`
- `VITE_CHATBOT_CONVERSATION_ID`
- `VITE_CHATBOT_LOCALE`
- `VITE_CHATBOT_THEME`
- `VITE_CHATBOT_WELCOME_MESSAGE`

## SDK Usage

### Vue Component

```ts
import { ChatbotWidget } from 'enterprise-chatbot-sdk';
```

### Vue Plugin

```ts
import { createChatbotPlugin } from 'enterprise-chatbot-sdk';

app.use(
  createChatbotPlugin({
    apiBaseUrl: 'https://api.example.com',
    token: import.meta.env.VITE_CHATBOT_TOKEN
  })
);
```

### JavaScript Mount

```ts
import { mountChatbot } from 'enterprise-chatbot-sdk';

mountChatbot({
  el: '#chatbot-root',
  config: {
    apiBaseUrl: 'https://api.example.com',
    token: '***',
    agentId: 'E009433E-F36B-1410-92B4-00A0552C5009',
    agentName: 'Eddie Wei',
    user: 'eddie007',
    workflowId: '23162f1f-c214-4326-ac3d-7dd60c24739a'
  }
});
```

## Web Component

```html
<enterprise-chatbot
  agent-id="E009433E-F36B-1410-92B4-00A0552C5009"
  agent-name="Eddie Wei"
  token="***"
  api-url="https://api.example.com"
></enterprise-chatbot>
```

## Plugin APIs

- `registerRenderer(key, component)`
- `registerPlugin(plugin, engine)`

Built-in examples:

- markdown renderer plugin
- contact renderer plugin
- analytics plugin
- message persistence plugin

## Micro-Frontend Notes

- No global mutable singleton state is required by host apps.
- Widget mount API is host-container scoped (`el` target based).
- Works with Qiankun / Module Federation / iframe by isolated mount points.
distribution chatbot based on vue3
