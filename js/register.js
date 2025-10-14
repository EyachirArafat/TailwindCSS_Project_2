// register.js - Registration form functionality

class RegistrationManager {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.formData = {};
    this.init();
  }

  init() {
    this.setupStepNavigation();
    this.setupFormValidation();
    this.setupPasswordStrength();
    this.setupMarketSelection();
  }

  setupStepNavigation() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevStep());
    }

    const form = document.getElementById('registerForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitRegistration();
      });
    }
  }

  nextStep() {
    if (!this.validateCurrentStep()) return;

    this.saveStepData();
    
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateStepDisplay();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepDisplay();
    }
  }

  updateStepDisplay() {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
      if (index + 1 <= this.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Show/hide step content
    document.querySelectorAll('.step-content').forEach((content, index) => {
      if (index + 1 === this.currentStep) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });

    // Update buttons
    document.getElementById('prevBtn').classList.toggle('hidden', this.currentStep === 1);
    document.getElementById('nextBtn').classList.toggle('hidden', this.currentStep === this.totalSteps);
    document.getElementById('submitBtn').classList.toggle('hidden', this.currentStep !== this.totalSteps);
  }

  validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${this.currentStep}`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('border-red-500');
        valid = false;
      } else {
        input.classList.remove('border-red-500');
      }
    });

    // Special validations
    if (this.currentStep === 1) {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('border-red-500');
        app.showNotification('Passwords do not match', 'error');
        return false;
      }

      if (password.length < 8) {
        app.showNotification('Password must be at least 8 characters', 'error');
        return false;
      }
    }

    if (!valid) {
      app.showNotification('Please fill in all required fields', 'error');
    }

    return valid;
  }

  saveStepData() {
    const currentStepElement = document.getElementById(`step${this.currentStep}`);
    const inputs = currentStepElement.querySelectorAll('input, select');
    
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        if (!this.formData[input.name]) {
          this.formData[input.name] = [];
        }
        if (input.checked) {
          this.formData[input.name].push(input.value);
        }
      } else {
        this.formData[input.name] = input.value;
      }
    });
  }

  setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;

    passwordInput.addEventListener('input', (e) => {
      const strength = this.calculatePasswordStrength(e.target.value);
      this.updatePasswordStrengthIndicator(strength);
    });
  }

  calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return Math.min(strength, 5);
  }

  updatePasswordStrengthIndicator(strength) {
    const indicator = document.querySelector('.strength-bar');
    if (!indicator) return;

    const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green'];
    const widths = ['20%', '40%', '60%', '80%', '100%'];
    
    indicator.style.width = widths[strength - 1] || '0%';
    indicator.style.backgroundColor = colors[strength - 1] || 'gray';
  }

  setupMarketSelection() {
    document.querySelectorAll('.market-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
      });
    });
  }

  async submitRegistration() {
    this.saveStepData();
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.formData)
      });

      if (response.ok) {
        app.showNotification('Registration successful!', 'success');
        setTimeout(() => {
          window.location.href = '/pages/dashboard.html';
        }, 2000);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      app.showNotification('Registration failed. Please try again.', 'error');
    }
  }
}

// Toggle password visibility
window.togglePassword = (inputId) => {
  const input = document.getElementById(inputId);
  const icon = event.target.querySelector('i');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
};

// Initialize registration manager
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('registerForm')) {
    new RegistrationManager();
  }
});