export default class Toast {
  constructor() {
    this.toastContainer = null;
    this.timeout = null;
  }

  show(message, type = 'info', options = {}) {
    // Default options
    const defaultOptions = {
      duration: 3000,
      position: {
        horizontal: 'center', // 'left', 'center', 'right'
        vertical: 'bottom'    // 'top', 'bottom'
      }
    };

    const config = {
      ...defaultOptions,
      ...options
    };

    // Clear any existing toast
    if (this.toastContainer) {
      this.hide();
    }

    // Create toast element
    this.toastContainer = document.createElement('div');
    
    // Add position classes
    const positionClasses = [
      `toast-${config.position.horizontal}`,
      `toast-${config.position.vertical}`
    ];
    
    // Add all classes
    this.toastContainer.className = [
      'toast',
      `toast-${type}`,
      ...positionClasses
    ].join(' ');

    this.toastContainer.textContent = message;

    // Add to document
    document.body.appendChild(this.toastContainer);

    // Set timer to remove toast
    this.timeout = setTimeout(() => {
      this.hide();
    }, config.duration);

    // Get computed styles to force a reflow
    getComputedStyle(this.toastContainer).opacity;
  }

  hide() {
    if (this.toastContainer) {
      clearTimeout(this.timeout);
      
      // Add fade-out class for animation
      this.toastContainer.classList.add('fade-out');
      
      // Remove element after animation
      setTimeout(() => {
        if (this.toastContainer && this.toastContainer.parentNode) {
          this.toastContainer.parentNode.removeChild(this.toastContainer);
          this.toastContainer = null;
        }
      }, 300); // Match transition duration from CSS
    }
  }
}
