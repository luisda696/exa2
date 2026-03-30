/**
 * ============================================
 * SANITIZER MODULE - PREVENCIÓN DE XSS
 * ============================================
 * Sanitiza todos los datos de usuario antes de insertarlos en el DOM
 * Versión: 2.0
 */

const Sanitizer = {
    /**
     * Escapa caracteres peligrosos para prevenir XSS
     * @param {string} text - Texto a sanitizar
     * @returns {string} - Texto seguro para HTML
     */
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

    /**
     * Sanitiza atributos HTML
     * @param {string} text - Texto para atributo
     * @returns {string} - Texto seguro para atributos
     */
    attribute(text) {
        return this.text(text).replace(/=/g, '&#61;');
    },

    /**
     * Sanitiza URL (previene javascript:)
     * @param {string} url - URL a validar
     * @returns {string} - URL segura o vacío
     */
    url(url) {
        if (!url || typeof url !== 'string') return '';
        const trimmed = url.trim();
        if (trimmed.toLowerCase().startsWith('javascript:')) {
            return '';
        }
        if (trimmed.toLowerCase().startsWith('data:')) {
            // Permitir solo data:image
            if (!trimmed.toLowerCase().startsWith('data:image/')) {
                return '';
            }
        }
        return this.text(trimmed);
    },

    /**
     * Sanitiza objeto completo (recursivo)
     * @param {object} obj - Objeto a sanitizar
     * @returns {object} - Objeto sanitizado
     */
    object(obj) {
        if (obj === null || obj === undefined) return obj;
        if (typeof obj === 'string') return this.text(obj);
        if (Array.isArray(obj)) return obj.map(item => this.object(item));
        if (typeof obj === 'object') {
            const sanitized = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sanitized[this.text(key)] = this.object(obj[key]);
                }
            }
            return sanitized;
        }
        return obj;
    },

    /**
     * Crea elemento de texto seguro (alternativa a innerHTML)
     * @param {string} text - Texto a insertar
     * @returns {Text} - Nodo de texto seguro
     */
    createTextNode(text) {
        return document.createTextNode(this.text(text));
    },

    /**
     * Inserta texto seguro en elemento
     * @param {HTMLElement} element - Elemento destino
     * @param {string} text - Texto a insertar
     */
    setTextContent(element, text) {
        if (element) {
            element.textContent = this.text(text);
        }
    }
};

// Exportar para uso global
window.Sanitizer = Sanitizer;
