document.addEventListener("DOMContentLoaded", () => {
    // Variáveis de controle do quiz
    let categorias = [];
    let categoriaSelecionada = null;
    let perguntaAtual = 0;
    let pontuacao = 0;
    let opcaoSelecionada = null;
    let tempoRestante = 30;
    let intervalo;
  
    // Seleção dos elementos do DOM
    const categoriasContainer = document.getElementById("categorias");
    const quizContainer = document.getElementById("quiz-container");
    const categoriaNome = document.getElementById("categoria-nome");
    const progresso = document.getElementById("progresso");
    const tempoDisplay = document.getElementById("tempo-restante");
    const pontuacaoDisplay = document.getElementById("pontuacao");
    const perguntaEnunciado = document.getElementById("pergunta-enunciado");
    const opcoesContainer = document.getElementById("opcoes");
    const reiniciarBotao = document.getElementById("reiniciar");
  
    // Carrega os dados do arquivo perguntas.json
    fetch("perguntas.json")
      .then((res) => res.json())
      .then((dados) => {
        categorias = dados.categorias;
        carregarCategorias();
      })
      .catch((erro) => console.error("Erro ao carregar perguntas:", erro));
  
    // Renderiza as categorias na tela
    function carregarCategorias() {
      categoriasContainer.innerHTML = categorias
        .map((categoria, index) => {
          return `<button onclick="selecionarCategoria(${index})">
                    ${categoria.nome} (${categoria.perguntas.length} perguntas)
                  </button>`;
        })
        .join("");
    }
  
    // Função global para seleção de categoria (necessária para acesso via onclick no HTML)
    window.selecionarCategoria = (indice) => {
      categoriaSelecionada = categorias[indice];
      // Embaralha as perguntas utilizando o algoritmo Fisher-Yates
      categoriaSelecionada.perguntas = embaralharArray(categoriaSelecionada.perguntas);
      perguntaAtual = 0;
      pontuacao = 0;
      categoriasContainer.style.display = "none";
      quizContainer.style.display = "block";
      atualizarQuiz();
    };
  
    // Embaralha um array
    function embaralharArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    // Atualiza a interface com a pergunta atual
    function atualizarQuiz() {
      if (perguntaAtual < categoriaSelecionada.perguntas.length) {
        const pergunta = categoriaSelecionada.perguntas[perguntaAtual];
        categoriaNome.textContent = categoriaSelecionada.nome;
        progresso.textContent = `Pergunta ${perguntaAtual + 1} de ${categoriaSelecionada.perguntas.length}`;
        pontuacaoDisplay.textContent = `Pontuação: ${pontuacao}`;
        tempoRestante = pergunta.tempo || 30;
        perguntaEnunciado.textContent = pergunta.enunciado;
  
        // Renderiza as opções da pergunta
        opcoesContainer.innerHTML = pergunta.opcoes
          .map((opcao, index) => {
            return `<button onclick="verificarResposta(${index})">${opcao}</button>`;
          })
          .join("");
  
        iniciarTimer();
      } else {
        mostrarResultados();
      }
    }
  
    // Inicia o timer para a pergunta atual
    function iniciarTimer() {
      clearInterval(intervalo);
      intervalo = setInterval(() => {
        tempoRestante--;
        tempoDisplay.textContent = `${tempoRestante}s`;
        if (tempoRestante <= 0) {
          clearInterval(intervalo);
          avancarParaProximaPergunta();
        }
      }, 1000);
    }
  
    // Função global para verificar a resposta (acessada via onclick)
    window.verificarResposta = (indiceOpcao) => {
      const pergunta = categoriaSelecionada.perguntas[perguntaAtual];
      if (opcaoSelecionada === null) {
        if (indiceOpcao === pergunta.correta) {
          pontuacao++;
        }
        // Seleciona todos os botões das opções e aplica estilos conforme a resposta
        const botoes = opcoesContainer.querySelectorAll("button");
        botoes.forEach((botao, index) => {
          if (index === pergunta.correta) {
            botao.classList.add("correta");
          } else if (index === indiceOpcao) {
            botao.classList.add("incorreta");
          }
          botao.disabled = true;
        });
        opcaoSelecionada = indiceOpcao;
        clearInterval(intervalo);
        // Aguarda 2 segundos e avança para a próxima pergunta
        setTimeout(() => {
          avancarParaProximaPergunta();
        }, 2000);
      }
    };
  
    // Avança para a próxima pergunta ou finaliza o quiz
    function avancarParaProximaPergunta() {
      perguntaAtual++;
      opcaoSelecionada = null;
      atualizarQuiz();
    }
  
    // Mostra os resultados finais do quiz
    function mostrarResultados() {
      perguntaEnunciado.textContent = `Você acertou ${pontuacao} de ${categoriaSelecionada.perguntas.length} perguntas!`;
      opcoesContainer.innerHTML = "";
      reiniciarBotao.style.display = "block";
      clearInterval(intervalo);
    }
  
    // Reinicia o quiz voltando para a tela de seleção de categorias
    reiniciarBotao.addEventListener("click", () => {
      categoriasContainer.style.display = "grid";
      quizContainer.style.display = "none";
      reiniciarBotao.style.display = "none";
    });
  });
  