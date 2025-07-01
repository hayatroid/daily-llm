// ========== CLIENT-SIDE DOM OPERATIONS ==========
export const ContentAnchors = {
  init: async (containerSelector = '.file-content') => {
    if (typeof window === 'undefined') return;

    const generateHashId = async (text: string): Promise<string> => {
      if (!window.crypto?.subtle) return 'heading';

      const data = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));

      return hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .substring(0, 7);
    };

    const markers = ['# ', '## ', '### ', '#### ', '##### ', '###### '];
    const headings = document.querySelectorAll(
      `${containerSelector} h1, ${containerSelector} h2, ${containerSelector} h3`
    );

    for (const heading of headings) {
      const text = heading.textContent ?? '';
      const id = await generateHashId(text);
      const level = parseInt(heading.tagName[1] || '1') - 1;
      const marker = markers[level] || '';

      heading.innerHTML = `
        <span class="heading-marker">${marker}</span>
        <a href="#${id}" id="${id}">${text}</a>
      `;

      heading.querySelector('a')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState(null, '', `#${id}`);
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.substring(1));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },
};
