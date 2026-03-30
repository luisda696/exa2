// js/ui/CalendarManager.js
// Gestión de calendario con selección de días específicos (ERROR 42)

export class CalendarManager {
  constructor() {
    this.selectedDays = [1, 2, 3, 4, 5]; // Lunes a Viernes por defecto (0=Dom, 1=Lun, ..., 6=Sáb)
    this.startDate = null;
  }

  setSelectedDays(daysArray) {
    this.selectedDays = daysArray;
  }

  setStartDate(date) {
    this.startDate = date ? new Date(date) : null;
  }

  /**
   * Calcula la fecha final dado el número de días de juego necesarios
   * @param {number} totalMatchDays - Días en los que se juegan partidos (no días naturales)
   * @returns {Date|null} Fecha final
   */
  calculateEndDate(totalMatchDays) {
    if (!this.startDate || totalMatchDays <= 0) return null;
    let daysNeeded = 0;
    let currentDate = new Date(this.startDate);
    while (daysNeeded < totalMatchDays) {
      if (this.selectedDays.includes(currentDate.getDay())) {
        daysNeeded++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return currentDate;
  }

  /**
   * Retorna array de fechas exactas de juego
   * @param {number} totalMatchDays
   * @returns {Date[]}
   */
  getMatchDates(totalMatchDays) {
    if (!this.startDate || totalMatchDays <= 0) return [];
    const dates = [];
    let currentDate = new Date(this.startDate);
    while (dates.length < totalMatchDays) {
      if (this.selectedDays.includes(currentDate.getDay())) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  /**
   * Obtiene la duración en días naturales (incluyendo días sin partido)
   * @param {number} totalMatchDays
   * @returns {number}
   */
  getNaturalDuration(totalMatchDays) {
    if (!this.startDate) return 0;
    const end = this.calculateEndDate(totalMatchDays);
    if (!end) return 0;
    const diffTime = Math.abs(end - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Genera HTML para el selector de días en la UI
   * @param {Function} onChange - Callback al cambiar selección
   * @returns {HTMLElement}
   */
  renderDaySelector(onChange) {
    const days = [
      { name: 'Dom', value: 0 },
      { name: 'Lun', value: 1 },
      { name: 'Mar', value: 2 },
      { name: 'Mié', value: 3 },
      { name: 'Jue', value: 4 },
      { name: 'Vie', value: 5 },
      { name: 'Sáb', value: 6 }
    ];
    const container = document.createElement('div');
    container.className = 'calendar-day-selector flex flex-wrap gap-2';
    days.forEach(day => {
      const label = document.createElement('label');
      label.className = 'flex items-center gap-1 cursor-pointer';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = day.value;
      cb.checked = this.selectedDays.includes(day.value);
      cb.addEventListener('change', () => {
        if (cb.checked) {
          if (!this.selectedDays.includes(day.value)) {
            this.selectedDays.push(day.value);
            this.selectedDays.sort((a, b) => a - b);
          }
        } else {
          this.selectedDays = this.selectedDays.filter(v => v !== day.value);
        }
        if (onChange) onChange(this.selectedDays);
      });
      const span = document.createElement('span');
      span.textContent = day.name;
      span.className = 'text-sm';
      label.appendChild(cb);
      label.appendChild(span);
      container.appendChild(label);
    });
    return container;
  }
}
