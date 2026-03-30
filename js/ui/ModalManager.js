// js/ui/ModalManager.js
// Gestión de modales con sanitización y limpieza de timers (ERROR 33)

import { Sanitizer } from '../security/Sanitizer.js';

export class ModalManager {
  constructor() {
    this.activeModal = null;
    this.timer = null;
  }

  /**
   * Abre un modal con contenido
   * @param {string} id - ID del modal en el DOM
   * @param {Function} onClose - Callback al cerrar
   */
  open(id, onClose = null) {
    this.close(); // Cerrar modal anterior
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = 'flex';
    this.activeModal = modal;
    this.onClose = onClose;
  }

  /**
   * Cierra el modal activo y limpia timers
   */
  close() {
    if (this.activeModal) {
      this.activeModal.style.display = 'none';
      // Limpiar timers asociados
      if (this.timer) {
        clearInterval(this.timer);
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.onClose) this.onClose();
      this.activeModal = null;
      this.onClose = null;
    }
  }

  /**
   * Abre modal de resultado con timer (ERROR 22, 33)
   * @param {Object} match - Partido a editar
   * @param {Function} onSave - Callback al guardar
   */
  openScoreModal(match, onSave) {
    this.open('score-modal', () => {
      // Limpiar timer al cerrar
      if (this.timer) clearInterval(this.timer);
    });
    // Iniciar timer
    let seconds = 0;
    const timerElement = document.getElementById('score-timer');
    if (timerElement) {
      this.timer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }, 1000);
    }
    // Configurar guardado
    const saveBtn = document.getElementById('score-save');
    if (saveBtn) {
      saveBtn.onclick = () => {
        // Recoger datos del formulario
        const sets = [];
        // ... (lógica de recolección)
        onSave(sets);
        this.close();
      };
    }
  }

  /**
   * Abre modal de confirmación
   */
  openConfirm(message, onConfirm) {
    this.open('confirm-modal');
    const msgEl = document.getElementById('confirm-message');
    if (msgEl) msgEl.textContent = Sanitizer.text(message);
    const confirmBtn = document.getElementById('confirm-ok');
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        onConfirm();
        this.close();
      };
    }
    const cancelBtn = document.getElementById('confirm-cancel');
    if (cancelBtn) {
      cancelBtn.onclick = () => this.close();
    }
  }

  /**
   * Abre modal de advertencia (toast)
   */
  toast(message, duration = 3000) {
    const toastEl = document.getElementById('toast');
    if (toastEl) {
      toastEl.textContent = Sanitizer.text(message);
      toastEl.classList.add('show');
      setTimeout(() => toastEl.classList.remove('show'), duration);
    }
  }
}
