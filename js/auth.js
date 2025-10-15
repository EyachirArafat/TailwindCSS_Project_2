// // auth.js - Authentication and User Management

// class AuthManager {
//   constructor() {
//     this.user = null;
//     this.token = localStorage.getItem("auth_token");
//     this.init();
//   }

//   init() {
//     if (this.token) {
//       this.validateToken();
//     }
//   }

//   async login(email, password) {
//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         throw new Error("Login failed");
//       }

//       const data = await response.json();
//       this.token = data.token;
//       this.user = data.user;

//       localStorage.setItem("auth_token", this.token);
//       localStorage.setItem("user", JSON.stringify(this.user));

//       window.location.href = "/pages/dashboard.html";
//     } catch (error) {
//       console.error("Login error:", error);
//       this.showError("Invalid email or password");
//     }
//   }

//   async register(userData) {
//     try {
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       if (!response.ok) {
//         throw new Error("Registration failed");
//       }

//       const data = await response.json();

//       // Auto login after registration
//       this.token = data.token;
//       this.user = data.user;

//       localStorage.setItem("auth_token", this.token);
//       localStorage.setItem("user", JSON.stringify(this.user));

//       window.location.href = "/pages/dashboard.html";
//     } catch (error) {
//       console.error("Registration error:", error);
//       this.showError("Registration failed. Please try again.");
//     }
//   }

//   async logout() {
//     try {
//       await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${this.token}`,
//         },
//       });
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       this.clearSession();
//       window.location.href = "/";
//     }
//   }

//   async validateToken() {
//     try {
//       const response = await fetch("/api/auth/validate", {
//         headers: {
//           Authorization: `Bearer ${this.token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Token validation failed");
//       }

//       const data = await response.json();
//       this.user = data.user;
//     } catch (error) {
//       console.error("Token validation error:", error);
//       this.clearSession();
//     }
//   }

//   clearSession() {
//     this.user = null;
//     this.token = null;
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("user");
//   }

//   isAuthenticated() {
//     return !!this.token && !!this.user;
//   }

//   getUser() {
//     return this.user;
//   }

//   showError(message) {
//     // Show error notification
//     const notification = document.createElement("div");
//     notification.className =
//       "fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50";
//     notification.textContent = message;
//     document.body.appendChild(notification);

//     setTimeout(() => {
//       notification.remove();
//     }, 5000);
//   }

//   // OAuth methods
//   async loginWithGoogle() {
//     window.location.href = "/api/auth/google";
//   }

//   async loginWithApple() {
//     window.location.href = "/api/auth/apple";
//   }

//   // Password reset
//   async requestPasswordReset(email) {
//     try {
//       const response = await fetch("/api/auth/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       if (!response.ok) {
//         throw new Error("Password reset request failed");
//       }

//       this.showSuccess("Password reset email sent");
//     } catch (error) {
//       console.error("Password reset error:", error);
//       this.showError("Failed to send reset email");
//     }
//   }

//   showSuccess(message) {
//     const notification = document.createElement("div");
//     notification.className =
//       "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50";
//     notification.textContent = message;
//     document.body.appendChild(notification);

//     setTimeout(() => {
//       notification.remove();
//     }, 5000);
//   }
// }

// // Initialize auth manager
// window.auth = new AuthManager();
