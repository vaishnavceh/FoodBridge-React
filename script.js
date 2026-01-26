document.addEventListener('DOMContentLoaded', () => {
    // 1. Persistent Theme Logic
    const initTheme = () => {
        const savedTheme = localStorage.getItem('fb-theme') || 'carbon';
        document.documentElement.className = savedTheme;
    };

    // 2. Form Interaction Polish
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            const btn = form.querySelector('button');
            if (btn) {
                btn.innerHTML = 'Processing...';
                btn.style.opacity = '0.7';
            }
        });
    });

    initTheme();
});