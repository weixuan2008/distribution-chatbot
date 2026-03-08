import { createChatbotWidgetApp } from '@/app/create-widget-app';
import type { ChatbotRuntimeConfig } from '@/types/config';

class EnterpriseChatbotElement extends HTMLElement {
  private mounted = false;
  private cleanup?: () => void;

  connectedCallback(): void {
    if (this.mounted) {
      return;
    }
    this.mounted = true;

    const container = document.createElement('div');
    this.appendChild(container);
    const config: ChatbotRuntimeConfig = {
      agentId: this.getAttribute('agent-id') ?? undefined,
      agentName: this.getAttribute('agent-name') ?? undefined,
      token: this.getAttribute('token') ?? undefined,
      apiBaseUrl: this.getAttribute('api-url') ?? undefined,
      user: this.getAttribute('user') ?? undefined,
      workflowId: this.getAttribute('workflow-id') ?? undefined,
      width: this.getAttribute('width') ?? undefined,
      height: this.getAttribute('height') ?? undefined
    };
    const { app } = createChatbotWidgetApp(config);
    app.mount(container);
    this.cleanup = () => app.unmount();
  }

  disconnectedCallback(): void {
    this.cleanup?.();
    this.mounted = false;
  }
}

if (!customElements.get('enterprise-chatbot')) {
  customElements.define('enterprise-chatbot', EnterpriseChatbotElement);
}
