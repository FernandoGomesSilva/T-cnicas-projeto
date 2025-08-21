import { aleatorio, nome } from './aleatorio.js';
import { perguntas } from './perguntas.js';

const caixaPerguntas = document.querySelector(".caixa-perguntas");
const caixaAlternativas = document.querySelector(".caixa-alternativas");
const caixaResultado = document.querySelector(".caixa-resultado");
const textoResultado = document.querySelector(".texto-resultado");
const botaoJogarNovamente = document.querySelector(".novamente-btn");
const botaoIniciar = document.querySelector(".iniciar-btn");
const telaInicial = document.querySelector(".tela-inicial");

let atual = 0;
let perguntaAtual;
let historiaFinal = "";
let historiaImagens = [];

botaoIniciar.addEventListener('click', iniciaJogo);

function iniciaJogo() {
    atual = 0;
    historiaFinal = "";
    historiaImagens = [];
    telaInicial.style.display = 'none';
    caixaResultado.classList.remove("mostrar");
    mostraPergunta();
}

function mostraPergunta() {
    if (atual >= perguntas.length) {
        mostraResultado();
        return;
    }

    perguntaAtual = perguntas[atual];

    limpaElemento(caixaPerguntas);
    limpaElemento(caixaAlternativas);

    // Texto do enunciado (se existir)
    if (perguntaAtual.enunciado) {
        const pEnunciado = document.createElement("p");
        pEnunciado.textContent = perguntaAtual.enunciado.replace(/você/g, nome);
        caixaPerguntas.appendChild(pEnunciado);
    }

    // Imagem do enunciado (se existir)
    if (perguntaAtual.imagem) {
        caixaPerguntas.appendChild(criaImagem(perguntaAtual.imagem));
    }

    mostraAlternativas();
}

function mostraAlternativas() {
    if (!perguntaAtual.alternativas) return;

    perguntaAtual.alternativas.forEach((alternativa) => {
        const botao = document.createElement("button");

        if (alternativa.texto) botao.textContent = alternativa.texto;
        if (alternativa.imagem) botao.appendChild(criaImagem(alternativa.imagem));

        botao.addEventListener("click", () => respostaSelecionada(alternativa));
        caixaAlternativas.appendChild(botao);
    });
}

function respostaSelecionada(opcao) {
    if (opcao.afirmacao && opcao.afirmacao.length) {
        const afirmacaoEscolhida = aleatorio(opcao.afirmacao);
        historiaFinal += afirmacaoEscolhida + " ";

        // pega imagem da afirmação se existir
        if (opcao.afirmacaoImagens && opcao.afirmacaoImagens.length) {
            const indexAf = opcao.afirmacao.indexOf(afirmacaoEscolhida);
            if (indexAf >= 0 && opcao.afirmacaoImagens[indexAf]) {
                historiaImagens.push(opcao.afirmacaoImagens[indexAf]);
            }
        }
    }

    if (typeof opcao.proxima === "number") {
        atual = opcao.proxima;
        mostraPergunta();
    } else {
        mostraResultado();
    }
}

function mostraResultado() {
    limpaElemento(caixaPerguntas);
    limpaElemento(caixaAlternativas);

    caixaPerguntas.textContent = 'Em 2049, ${nome}';
    textoResultado.textContent = historiaFinal.trim();

    if (historiaImagens.length) {
        const galeria = document.createElement("div");
        historiaImagens.forEach((src) => galeria.appendChild(criaImagem(src)));
        caixaResultado.appendChild(galeria);
    }

    caixaResultado.classList.add("mostrar");
    botaoJogarNovamente.addEventListener("click", iniciaJogo, { once: true });
}

// Funções auxiliares
function criaImagem(src) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.loading = "lazy";
    return img;
}

function limpaElemento(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
}