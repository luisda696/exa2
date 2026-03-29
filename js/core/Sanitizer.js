const Sanitizer = {
  text: (input) => {
    if (!input) return '';
    return input.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  html: (input) => {
    if (!input) return '';
    // Permitir solo tags seguros: <b>, <i>, <a href="...">
    return input.toString()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=/gi, '') // Eliminar atributos on* (onclick, etc.)
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '');
  },

  url: (input) => {
    if (!input) return '';
    return input.toString()
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '');
  }
};

export default Sanitizer;
