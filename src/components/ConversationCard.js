class ConversationCard extends HTMLElement {
  constructor() {
    super();
    this.isExpanded = false;
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || 'Untitled Conversation';
    const preview = this.getAttribute('preview') || '';
    const time = this.getAttribute('time') || '';
    const exchangeCount = this.getAttribute('exchange-count') || '0';
    const content = this.innerHTML;
    const contentId = `content-${Math.random().toString(36).substring(2, 11)}`;
    const titleId = `title-${Math.random().toString(36).substring(2, 11)}`;

    this.innerHTML = `
      <article class="conversation-card ${this.isExpanded ? 'expanded' : 'collapsed'}">
        <header>
          <h3 id="${titleId}" class="conversation-title">🤖 ${title}</h3>
          <div class="conversation-meta">
            <span class="meta-info">${time}</span>
            <span class="meta-info">•</span>
            <span class="meta-info">${exchangeCount} exchanges</span>
          </div>
          <button 
            class="expand-btn" 
            aria-expanded="${this.isExpanded}"
            aria-controls="${contentId}"
            aria-label="${this.isExpanded ? 'Collapse' : 'Expand'} conversation about ${title}"
          >
            <span class="expand-icon">${this.isExpanded ? '▼' : '▶'}</span>
            <span>${this.isExpanded ? 'Collapse' : 'Expand'}</span>
          </button>
        </header>
        <div class="preview" ${this.isExpanded ? 'hidden' : ''}>
          ${preview}...
        </div>
        <div 
          class="full-content" 
          id="${contentId}"
          role="region"
          aria-labelledby="${titleId}"
          ${!this.isExpanded ? 'hidden' : ''}
        >
          ${content}
        </div>
      </article>
    `;
  }

  attachEventListeners() {
    const expandBtn = this.querySelector('.expand-btn');

    // Click handler
    expandBtn.addEventListener('click', () => this.toggleExpanded());

    // Keyboard handler
    expandBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleExpanded();
      }
    });

    // Focus management
    if (this.isExpanded) {
      const fullContent = this.querySelector('.full-content');
      fullContent.setAttribute('tabindex', '-1');
      fullContent.focus();
    }
  }
}

customElements.define('conversation-card', ConversationCard);
