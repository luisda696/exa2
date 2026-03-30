/**
 * Sanitizer.js - Protección XSS para Pádel Manager Pro
 * Sanitiza todos los datos de usuario antes de insertarlos en el DOM
 */

const Sanitizer = {
    /**
     * Escapa caracteres peligrosos para prevenir XSS
     * @param {string} text - Texto a sanitizar
     * @returns {string} - Texto seguro para HTML
     */
    text(text) {
        if (typeof text !== 'string') return String(text || '');
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
     * @returns {string} - Texto seguro para atributo
     */
    attr(text) {
        return this.text(text).replace(/=/g, '&#61;');
    },

    /**
     * Sanitiza URL (solo permite http, https, mailto)
     * @param {string} url - URL a validar
     * @returns {string} - URL segura o vacío
     */
    url(url) {
        if (!url) return '';
        const trimmed = url.trim();
        if (/^(https?:|mailto:)/i.test(trimmed)) {
            return this.attr(trimmed);
        }
        return '';
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
     * Sanitiza objeto completo (recursivo)
     * @param {any} data - Datos a sanitizar
     * @returns {any} - Datos sanitizados
     */
    object(data) {
        if (data === null || data === undefined) return data;
        if (typeof data === 'string') return this.text(data);
        if (Array.isArray(data)) return data.map(item => this.object(item));
        if (typeof data === 'object') {
            const sanitized = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    sanitized[key] = this.object(data[key]);
                }
            }
            return sanitized;
        }
        return data;
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sanitizer;
}
