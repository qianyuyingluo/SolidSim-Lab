document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".module-button");

  buttons.forEach((button, index) => {
    button.style.animation = `fadeInUp 0.45s ease ${index * 0.08}s both`;
  });
});
