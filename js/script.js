// theme.js

// Ao carregar o documento, verifica a preferência do usuário e aplica o tema salvo
document.addEventListener('DOMContentLoaded', function () {
    // Se houver preferência armazenada no localStorage, aplica-a
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
  });
  
  // Função para alternar entre tema claro e escuro
  function toggleTheme() {
    // Alterna a classe 'light-theme' no elemento body
    document.body.classList.toggle('light-theme');
  
    // Armazena a preferência no localStorage
    if (document.body.classList.contains('light-theme')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  }
  