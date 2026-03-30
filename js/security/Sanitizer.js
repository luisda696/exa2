/**
 * ============================================
 * SANITIZER.JS - Protección XSS
 * ============================================
 */

const Sanitizer = {
    text(text) {
        if (typeof text !== 'string') {
            return String(text || '');
        }
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    attribute(text) {
        return this.text(text).replace(/=/g, '&#61;');
    },

    url(url) {
        if (!url || typeof url !== 'string') return '';
        const trimmed = url.trim();
        if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
            return this.attribute(trimmed);
        }
        return '';
    }
};

window.Sanitizer = Sanitizer;
