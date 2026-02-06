// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configurações do Firebase (Suas chaves)
const firebaseConfig = {
  apiKey: "AIzaSyClPzHFvyVSzGHQ4tcJ6_3cz8VsUVs7IK0",
  authDomain: "projeto-rd-service.firebaseapp.com",
  projectId: "projeto-rd-service",
  storageBucket: "projeto-rd-service.firebasestorage.app",
  messagingSenderId: "910899581836",
  appId: "1:910899581836:web:69a2455f9e4f718e8b3ca9",
  measurementId: "G-1GC9NR8EZ4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Função para enviar formulário
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Impede a página de recarregar

  const btn = document.querySelector('.btn-submit');
  const originalText = btn.innerText;
  btn.innerText = "Salvando...";
  btn.disabled = true;

  // Pega os valores
  const nome = document.getElementById('name').value;
  const telefone = document.getElementById('phone').value;
  const servico = document.getElementById('service').value;

  try {
    // 1. Salva no Firebase Firestore
    await addDoc(collection(db, "orcamentos"), {
      nome: nome,
      telefone: telefone,
      servico: servico,
      data: serverTimestamp() // Salva a data/hora do servidor
    });

    // 2. Monta mensagem do WhatsApp
    const mensagemZap = `Olá, me chamo ${nome}. Gostaria de um orçamento sobre: ${servico}. Meu telefone é ${telefone}.`;
    const urlZap = `https://wa.me/5595900270848?text=${encodeURIComponent(mensagemZap)}`;

    // 3. Feedback visual e Redirecionamento
    alert("Dados salvos! Redirecionando para o WhatsApp...");

    // Limpa o form
    document.getElementById('contactForm').reset();

    // Abre WhatsApp
    window.open(urlZap, "_blank");

  } catch (error) {
    console.error("Erro ao salvar documento: ", error);
    alert("Ocorreu um erro ao salvar, mas vamos tentar abrir o WhatsApp mesmo assim.");

    // Tenta abrir o zap mesmo se o banco de dados falhar
    const mensagemZap = `Olá, me chamo ${nome}. Gostaria de um orçamento sobre: ${servico}.`;
    window.open(`https://wa.me/5595900270848?text=${encodeURIComponent(mensagemZap)}`, "_blank");
  } finally {
    btn.innerText = originalText;
    btn.disabled = false;
  }
});

// ... Seu código Firebase acima ...

// ================= CARROSSEL LOGIC =================
window.moveCarousel = function (direction) {
  const track = document.getElementById('track');
  // Rola 320px (tamanho do card + gap) para o lado
  const scrollAmount = 320;

  if (direction === 1) {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  } else {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }
}

// ================= NOVA LÓGICA DO MODAL =================

// Variável para rastrear qual projeto está aberto atualmente
let currentModalIndex = 0;
// Pega todos os cards do carrossel para sabermos a ordem
const allGalleryCards = document.querySelectorAll('.carousel-card');

// Função auxiliar para atualizar o conteúdo do modal com base no índice
function updateModalContent() {
  // Pega o card atual com base no índice
  const currentCard = allGalleryCards[currentModalIndex];
  const imgElement = currentCard.querySelector('img');

  // Elementos do modal
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  // Preenche os dados com animação suave de fade
  modalImg.style.opacity = 0; // Começa invisível para a transição

  setTimeout(() => {
    modalImg.src = imgElement.src;
    modalTitle.innerText = imgElement.getAttribute('data-titulo') || "Serviço RD Service";
    modalDesc.innerText = imgElement.getAttribute('data-desc') || "Descrição não disponível.";
    modalImg.style.opacity = 1; // Aparece suavemente
  }, 200); // Pequeno delay para o efeito
}


// Função chamada ao clicar em um card do carrossel
window.openModal = function (cardElement) {
  // Descobre qual é o índice do card clicado na lista total
  // (Converte a NodeList em Array para usar o indexOf)
  currentModalIndex = Array.from(allGalleryCards).indexOf(cardElement);

  // Atualiza o conteúdo e mostra o modal
  updateModalContent();
  document.getElementById('projectModal').style.display = 'flex';
}


// NOVA FUNÇÃO: Chamada pelas setas DENTRO do modal
window.changeModalImage = function (direction) {
  // Atualiza o índice (direction será +1 ou -1)
  currentModalIndex += direction;

  // Lógica de Loop (Carrossel infinito)
  // Se for menor que 0, vai para o último item
  if (currentModalIndex < 0) {
    currentModalIndex = allGalleryCards.length - 1;
  }
  // Se for maior que o total, volta para o primeiro item
  if (currentModalIndex >= allGalleryCards.length) {
    currentModalIndex = 0;
  }

  // Atualiza o modal com o novo índice
  updateModalContent();
}


// Funções de fechar (Mantidas iguais)
window.closeModal = function () {
  document.getElementById('projectModal').style.display = 'none';
}

window.onclick = function (event) {
  const modal = document.getElementById('projectModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// ================= MENU MOBILE LOGIC =================
window.toggleMenu = function () {
  const nav = document.getElementById('navLinks');
  const icon = document.querySelector('.mobile-menu-icon');
  const overlay = document.getElementById('menuOverlay');

  // Alterna as classes 'active'
  nav.classList.toggle('active');
  icon.classList.toggle('active');

  // Controla o overlay (fundo escuro)
  if (nav.classList.contains('active')) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Impede rolagem do fundo
  } else {
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // Libera rolagem
  }
}

// Fecha o menu ao clicar em um link
window.closeMenuMobile = function () {
  const nav = document.getElementById('navLinks');
  // Só executa se estiver no modo mobile (se tiver a classe active)
  if (nav.classList.contains('active')) {
    toggleMenu();
  }
}