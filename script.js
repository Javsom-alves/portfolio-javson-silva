/* =========================================================
   Script - Portfólio Javsom Alves da Silva
   JavaScript puro (sem frameworks/bibliotecas).
   Funcionalidades:
   1. Menu responsivo (hambúrguer) para celulares
   2. Destaque do link da seção visível no menu
   3. Tema claro/escuro com preferência salva
   4. Validação e simulação de envio do formulário de contato
   5. Modal de confirmação
   ========================================================= */

// Seleção dos elementos usados no script
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const menuLinks = document.querySelectorAll(".menu-link");
const temaToggle = document.getElementById("temaToggle");
const form = document.getElementById("formContato");
const modal = document.getElementById("modal");
const fecharModal = document.getElementById("fecharModal");

/* ---------------------------------------------------------
   1. MENU RESPONSIVO
   Ao clicar no hambúrguer, alterna a classe "aberto"
   no menu (o CSS mostra/esconde a lista).
   --------------------------------------------------------- */
menuToggle.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  menuToggle.classList.toggle("aberto", aberto);
  menuToggle.setAttribute("aria-expanded", aberto);
});

// Fecha o menu no celular depois que o usuário escolhe uma seção
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");
    menuToggle.classList.remove("aberto");
    menuToggle.setAttribute("aria-expanded", false);
  });
});

/* ---------------------------------------------------------
   2. LINK ATIVO NO MENU
   O IntersectionObserver avisa quando uma seção aparece
   na tela; então destacamos o link correspondente.
   --------------------------------------------------------- */
const secoes = document.querySelectorAll("main section");

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        const id = entrada.target.id;
        menuLinks.forEach((link) => {
          link.classList.toggle("ativo", link.getAttribute("href") === "#" + id);
        });
      }
    });
  },
  // A seção é considerada "ativa" quando ocupa o meio da tela
  { rootMargin: "-45% 0px -50% 0px" }
);

secoes.forEach((secao) => observador.observe(secao));

/* ---------------------------------------------------------
   3. TEMA CLARO / ESCURO
   Alterna a classe "escuro" no <body>. As cores mudam
   porque o CSS redefine as variáveis nessa classe.
   A escolha fica salva no localStorage.
   --------------------------------------------------------- */
function aplicarTema(escuro) {
  document.body.classList.toggle("escuro", escuro);
  temaToggle.textContent = escuro ? "☀️" : "🌙";
}

// Carrega o tema salvo; se não houver, segue a preferência do sistema
let temaSalvo = null;
try {
  temaSalvo = localStorage.getItem("tema");
} catch (e) {
  // localStorage pode estar bloqueado (ex.: navegação privada)
}
const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
aplicarTema(temaSalvo ? temaSalvo === "escuro" : prefereEscuro);

temaToggle.addEventListener("click", () => {
  const escuro = !document.body.classList.contains("escuro");
  aplicarTema(escuro);
  try {
    localStorage.setItem("tema", escuro ? "escuro" : "claro");
  } catch (e) {
    // ignora se não for possível salvar
  }
});

/* ---------------------------------------------------------
   4. VALIDAÇÃO DO FORMULÁRIO
   --------------------------------------------------------- */

// Expressão regular simples para validar e-mail (usuario@dominio.com)
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Mostra ou limpa a mensagem de erro de um campo
function definirErro(campoId, erroId, mensagem) {
  const campo = document.getElementById(campoId).parentElement;
  document.getElementById(erroId).textContent = mensagem;
  campo.classList.toggle("invalido", mensagem !== "");
}

// Valida todos os campos e retorna true se estiver tudo certo
function validarFormulario() {
  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const mensagem = form.mensagem.value.trim();
  let valido = true;

  // Nome: obrigatório e com pelo menos 3 letras
  if (nome === "") {
    definirErro("nome", "erroNome", "Por favor, informe seu nome.");
    valido = false;
  } else if (nome.length < 3) {
    definirErro("nome", "erroNome", "O nome deve ter pelo menos 3 caracteres.");
    valido = false;
  } else {
    definirErro("nome", "erroNome", "");
  }

  // E-mail: obrigatório e em formato válido
  if (email === "") {
    definirErro("email", "erroEmail", "Por favor, informe seu e-mail.");
    valido = false;
  } else if (!regexEmail.test(email)) {
    definirErro("email", "erroEmail", "Informe um e-mail válido (ex.: usuario@dominio.com).");
    valido = false;
  } else {
    definirErro("email", "erroEmail", "");
  }

  // Mensagem: obrigatória e com pelo menos 10 caracteres
  if (mensagem === "") {
    definirErro("mensagem", "erroMensagem", "Por favor, escreva uma mensagem.");
    valido = false;
  } else if (mensagem.length < 10) {
    definirErro("mensagem", "erroMensagem", "A mensagem deve ter pelo menos 10 caracteres.");
    valido = false;
  } else {
    definirErro("mensagem", "erroMensagem", "");
  }

  return valido;
}

/* ---------------------------------------------------------
   SIMULAÇÃO DO ENVIO
   Impede o envio real, valida, limpa os campos
   e exibe o modal de confirmação.
   --------------------------------------------------------- */
form.addEventListener("submit", (evento) => {
  evento.preventDefault(); // não recarrega a página

  if (!validarFormulario()) {
    // Coloca o foco no primeiro campo com erro
    const primeiroErro = form.querySelector(".invalido input, .invalido textarea");
    if (primeiroErro) primeiroErro.focus();
    return;
  }

  const nome = form.nome.value.trim().split(" ")[0];
  document.getElementById("modalTexto").textContent =
    `Obrigado pelo contato, ${nome}! Responderei assim que possível.`;

  form.reset();   // limpa os campos
  abrirModal();
});

// Remove o erro de um campo assim que o usuário começa a corrigir
form.querySelectorAll("input, textarea").forEach((campo) => {
  campo.addEventListener("input", () => {
    if (campo.parentElement.classList.contains("invalido")) {
      validarFormulario();
    }
  });
});

/* ---------------------------------------------------------
   5. MODAL DE CONFIRMAÇÃO
   --------------------------------------------------------- */
function abrirModal() {
  modal.classList.add("visivel");
  modal.setAttribute("aria-hidden", "false");
  fecharModal.focus();
}

function fecharModalFn() {
  modal.classList.remove("visivel");
  modal.setAttribute("aria-hidden", "true");
}

fecharModal.addEventListener("click", fecharModalFn);

// Fecha ao clicar fora da caixa do modal
modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharModalFn();
});

// Fecha com a tecla Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharModalFn();
});

/* ---------------------------------------------------------
   Ano atual no rodapé (atualiza sozinho)
   --------------------------------------------------------- */
document.getElementById("ano").textContent = new Date().getFullYear();
