// =========================================================
// JACIS site behaviour
// =========================================================

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Copy-citation buttons
  document.querySelectorAll('.copy-btn[data-citation]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-citation');
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        // Fallback for browsers without clipboard API permission
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      const original = btn.textContent;
      btn.textContent = 'Copied to clipboard';
      btn.setAttribute('data-copied', 'true');
      setTimeout(() => {
        btn.textContent = original;
        btn.removeAttribute('data-copied');
      }, 1800);
    });
  });

  // Article search / topic filter (Articles & Archives pages)
  const searchInput = document.querySelector('[data-article-search]');
  const topicSelect = document.querySelector('[data-topic-filter]');
  const cards = document.querySelectorAll('[data-article-card]');
  const noResults = document.querySelector('.no-results');

  function applyFilter() {
    if (!cards.length) return;
    const query = (searchInput && searchInput.value || '').trim().toLowerCase();
    const topic = (topicSelect && topicSelect.value) || 'all';
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const cardTopic = card.getAttribute('data-topic') || '';
      const matchesQuery = query === '' || text.includes(query);
      const matchesTopic = topic === 'all' || cardTopic === topic;
      const visible = matchesQuery && matchesTopic;
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

    if (noResults) {
      noResults.classList.toggle('show', visibleCount === 0);
    }
  }

  if (searchInput) searchInput.addEventListener('input', applyFilter);
  if (topicSelect) topicSelect.addEventListener('change', applyFilter);

  // Manuscript submission form (front-end demo only)
  const form = document.querySelector('[data-submission-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'Manuscript details received. The editorial office will follow up by email with next steps and a manuscript tracking number.';
        status.classList.add('show', 'success');
        status.setAttribute('role', 'status');
      }
      form.reset();
    });
  }
});
