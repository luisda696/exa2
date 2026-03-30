// js/security/Sanitizer.js
// Prevención de XSS mediante sanitización de entrada

export class Sanitizer {
  /**
   * Escapa texto para uso seguro en innerHTML o atributos
   * @param {string} input - Texto a sanitizar
   * @returns {string} Texto escapado
   */
  static text(input) {
    if (typeof input !== 'string') return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitiza HTML permitiendo solo etiquetas seguras (modo estricto)
   * @param {string} input - HTML potencialmente peligroso
   * @returns {string} HTML sanitizado
   */
  static html(input) {
    // Por defecto, tratamos como texto para máxima seguridad
    // En caso de necesitar HTML confiable, usar un parser DOMPurify (no incluido)
    return this.text(input);
  }

  /**
   * Sanitiza un objeto completo (recursivo)
   * @param {Object} obj - Objeto con posibles strings
   * @returns {Object} Objeto con strings sanitizadas
   */
  static deepSanitize(obj) {
    if (typeof obj === 'string') return this.text(obj);
    if (Array.isArray(obj)) return obj.map(item => this.deepSanitize(item));
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.deepSanitize(value);
      }
      return sanitized;
    }
    return obj;
  }
}
