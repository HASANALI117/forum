export default class Toast {
  constructor() {
    this.toasts = [];
  }

  show(message, type = 'info', options = {}) {
    // Default options
    const defaultOptions = {
      duration: 3000,
      position: {
        horizontal: 'left', // 'left', 'center', 'right'
        vertical: 'top', // 'top', 'bottom'
      },
    };

    const config = {
      ...defaultOptions,
      ...options
    };

    // Create toast element
    const toastElement = document.createElement('div');
    
    // Add position classes
    const positionClasses = [
      `toast-${config.position.horizontal}`,
      `toast-${config.position.vertical}`
    ];
    
    // Add all classes
    toastElement.className = [
      'toast',
      `toast-${type}`,
      ...positionClasses
    ].join(' ');

    toastElement.textContent = message;

    // Calculate offset based on existing toasts
    const existingToasts = this.toasts.filter(t => 
      t.position.horizontal === config.position.horizontal && 
      t.position.vertical === config.position.vertical
    );
    
    const offset = existingToasts.length * 60; // 60px spacing between toasts
    if (config.position.vertical === 'bottom') {
      toastElement.style.bottom = `${20 + offset}px`;
    } else {
      toastElement.style.top = `${20 + offset}px`;
    }

    // Add to document
    document.body.appendChild(toastElement);

    // Create toast object
    const toast = {
      element: toastElement,
      timeout: null,
      position: config.position
    };

    // Add to toasts array
    this.toasts.push(toast);

    // Set timer to remove toast
    toast.timeout = setTimeout(() => {
      this.hide(toast);
    }, config.duration);

    // Get computed styles to force a reflow
    getComputedStyle(toastElement).opacity;
  }

  hide(toast) {
    if (!toast || !toast.element) return;

    clearTimeout(toast.timeout);
    
    // Add fade-out class for animation
    toast.element.classList.add('fade-out');
    
    // Remove element after animation
    setTimeout(() => {
      if (toast.element && toast.element.parentNode) {
        toast.element.parentNode.removeChild(toast.element);
        
        // Remove from toasts array
        const index = this.toasts.indexOf(toast);
        if (index > -1) {
          this.toasts.splice(index, 1);
        }

        // Adjust positions of remaining toasts
        this.updateToastPositions(toast.position);
      }
    }, 300); // Match transition duration from CSS
  }

  updateToastPositions(position) {
    const relevantToasts = this.toasts.filter(t => 
      t.position.horizontal === position.horizontal && 
      t.position.vertical === position.vertical
    );

    relevantToasts.forEach((toast, index) => {
      const offset = index * 60;
      if (position.vertical === 'bottom') {
        toast.element.style.bottom = `${20 + offset}px`;
      } else {
        toast.element.style.top = `${20 + offset}px`;
      }
    });
  }
}
