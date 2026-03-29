const CURRENT_VERSION = 2;

const migrations = {
  1: (data) => {
    // Migración de v1 a v2: Agregar campo 'isDraw' a partidos empatados
    if (data.matches) {
      data.matches.forEach(match => {
        if (match.winner === null && match.done) {
          match.isDraw = true;
        }
      });
    }
    data.version = 2;
    return data;
  }
};

const VersionedStorage = {
  save: (key, data) => {
    try {
      data.version = CURRENT_VERSION;
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Error al guardar:", e);
      return false;
    }
  },

  load: (key) => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;

      const parsed = JSON.parse(data);
      if (!parsed.version) {
        // Datos antiguos (sin versión)
        return migrations[1](parsed);
      } else if (parsed.version < CURRENT_VERSION) {
        // Aplicar migraciones secuenciales
        let current = parsed;
        for (let v = current.version; v < CURRENT_VERSION; v++) {
          current = migrations[v](current);
        }
        return current;
      }
      return parsed;
    } catch (e) {
      console.error("Error al cargar:", e);
      return null;
    }
  }
};

export default VersionedStorage;
