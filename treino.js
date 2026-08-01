/* =========================================================================
   SHAPEHOUSE — treino.js
   Duas engines nesta página:
   1) Treino Personalizado — monta um split PPL (ou Full Body) a partir do
      objetivo, dias disponíveis, experiência e equipamentos, sempre com
      5 a 8 exercícios por dia e um fechamento de core.
   2) Treino TAF — classifica o desempenho atual e gera um plano
      progressivo de 4 semanas.
   ========================================================================= */

/* ---------------------------------------------------------------------
   1) TREINO PERSONALIZADO
--------------------------------------------------------------------- */

/** Banco de exercícios por categoria (push / pull / legs / core) e equipamento compatível. */
const BANCO_EXERCICIOS = {
  push: [
    { nome: 'Supino reto com barra',          musculo: 'Peito',   equip: ['academia', 'barraanilhas'] },
    { nome: 'Supino com halteres',            musculo: 'Peito',   equip: ['halteres', 'academia', 'banco'] },
    { nome: 'Supino com halteres no banco',   musculo: 'Peito',   equip: ['halteres', 'banco'] },
    { nome: 'Flexão de braço',                musculo: 'Peito',   equip: ['corporal'] },
    { nome: 'Flexão diamante',                musculo: 'Tríceps', equip: ['corporal'] },
    { nome: 'Flexão com mochila (carga extra)', musculo: 'Peito', equip: ['corporal', 'mochila'] },
    { nome: 'Desenvolvimento militar',        musculo: 'Ombro',   equip: ['academia', 'halteres', 'barraanilhas'] },
    { nome: 'Desenvolvimento com halteres no banco', musculo: 'Ombro', equip: ['halteres', 'banco'] },
    { nome: 'Elevação lateral',               musculo: 'Ombro',   equip: ['halteres', 'elasticos'] },
    { nome: 'Tríceps na polia (corda)',       musculo: 'Tríceps', equip: ['academia'] },
    { nome: 'Mergulho nas paralelas',         musculo: 'Tríceps', equip: ['paralelas'] },
    { nome: 'Mergulho no banco (tríceps)',    musculo: 'Tríceps', equip: ['banco'] },
    { nome: 'Tríceps testa com halteres',     musculo: 'Tríceps', equip: ['halteres'] },
    { nome: 'Tríceps com Super Band',         musculo: 'Tríceps', equip: ['elasticos'] },
  ],
  pull: [
    { nome: 'Barra fixa (pull-up)',           musculo: 'Costas',  equip: ['barra'] },
    { nome: 'Remada curvada com barra',       musculo: 'Costas',  equip: ['academia', 'barraanilhas'] },
    { nome: 'Puxada alta na polia',           musculo: 'Costas',  equip: ['academia'] },
    { nome: 'Remada unilateral com halter',   musculo: 'Costas',  equip: ['halteres'] },
    { nome: 'Remada curvada com mochila',     musculo: 'Costas',  equip: ['mochila'] },
    { nome: 'Remada com Super Band',          musculo: 'Costas',  equip: ['elasticos'] },
    { nome: 'Remada invertida (apoio baixo)', musculo: 'Costas',  equip: ['corporal'] },
    { nome: 'Rosca direta com barra',         musculo: 'Bíceps',  equip: ['academia', 'barraanilhas'] },
    { nome: 'Rosca alternada com halteres',   musculo: 'Bíceps',  equip: ['halteres'] },
    { nome: 'Rosca com Super Band',           musculo: 'Bíceps',  equip: ['elasticos'] },
    { nome: 'Face pull no elástico',          musculo: 'Ombro post.', equip: ['elasticos'] },
  ],
  legs: [
    { nome: 'Agachamento livre',              musculo: 'Quadríceps', equip: ['corporal'] },
    { nome: 'Agachamento com barra',          musculo: 'Quadríceps', equip: ['academia', 'barraanilhas'] },
    { nome: 'Agachamento com halteres',       musculo: 'Quadríceps', equip: ['halteres'] },
    { nome: 'Agachamento com mochila',        musculo: 'Quadríceps', equip: ['mochila'] },
    { nome: 'Agachamento com Super Band',     musculo: 'Quadríceps', equip: ['elasticos'] },
    { nome: 'Levantamento terra',             musculo: 'Posterior',  equip: ['academia', 'barraanilhas'] },
    { nome: 'Stiff com halteres',             musculo: 'Posterior',  equip: ['halteres'] },
    { nome: 'Afundo (avanço)',                musculo: 'Glúteo',     equip: ['corporal'] },
    { nome: 'Afundo com halteres',            musculo: 'Glúteo',     equip: ['halteres'] },
    { nome: 'Afundo com mochila',             musculo: 'Glúteo',     equip: ['mochila'] },
    { nome: 'Agachamento búlgaro (apoio no banco)', musculo: 'Glúteo', equip: ['banco'] },
    { nome: 'Step-up no banco',               musculo: 'Glúteo',     equip: ['banco'] },
    { nome: 'Ponte de glúteo',                musculo: 'Glúteo',     equip: ['corporal', 'elasticos'] },
    { nome: 'Panturrilha em pé',              musculo: 'Panturrilha', equip: ['corporal', 'academia'] },
  ],
  core: [
    { nome: 'Prancha abdominal',              musculo: 'Core', equip: ['corporal'] },
    { nome: 'Prancha com pés no banco',       musculo: 'Core', equip: ['banco'] },
    { nome: 'Abdominal supra',                musculo: 'Core', equip: ['corporal'] },
    { nome: 'Elevação de pernas',             musculo: 'Core', equip: ['corporal', 'barra'] },
    { nome: 'Elevação de pernas no banco',    musculo: 'Core', equip: ['banco'] },
    { nome: 'Russian twist',                  musculo: 'Core (oblíquos)', equip: ['corporal'] },
    { nome: 'Abdominal com Super Band',       musculo: 'Core', equip: ['elasticos'] },
    { nome: 'Mountain climber',               musculo: 'Core', equip: ['corporal'] },
    { nome: 'Pular corda (condicionamento)',  musculo: 'Core / cardio', equip: ['corda'] },
  ],
};

/** Parâmetros de séries/reps/descanso por objetivo. */
const PARAMS_OBJETIVO = {
  hipertrofia:   { series: '3-4', reps: '8-12',  descanso: '60-90s' },
  forca:         { series: '4-5', reps: '4-6',   descanso: '2-3min' },
  emagrecimento: { series: '3',   reps: '15-20', descanso: '30-45s' },
  resistencia:   { series: '3',   reps: '15-20', descanso: '30-45s' },
};

/** Quantidade total de exercícios por dia conforme experiência — sempre entre 5 e 8. */
const QTD_EXERCICIOS_POR_EXPERIENCIA = { iniciante: 5, intermediario: 6, avancado: 8 };

/** Divisão de dias: prioriza PPL; usa Upper/Lower a partir de 4 dias sem "full"; Full Body para poucos dias. */
function definirSplit(dias) {
  const splits = {
    2: ['full', 'full'],
    3: ['push', 'pull', 'legs'],
    4: ['push', 'pull', 'legs', 'full'],
    5: ['push', 'pull', 'legs', 'push', 'pull'],
    6: ['push', 'pull', 'legs', 'push', 'pull', 'legs'],
  };
  if (splits[dias]) return splits[dias];
  // fallback: cicla push/pull/legs para qualquer outra quantidade
  const base = ['push', 'pull', 'legs'];
  return Array.from({ length: dias }, (_, i) => base[i % base.length]);
}

function filtrarPorEquipamento(lista, equipamentosDisponiveis) {
  return lista.filter((ex) => ex.equip.some((e) => equipamentosDisponiveis.includes(e)));
}

/**
 * Pega `qtd` exercícios de uma categoria. Prioriza variedade (evita repetir
 * exercícios já usados na semana e depois repetições dentro do próprio dia),
 * mas se o equipamento disponível for limitado, repete o necessário para
 * NUNCA deixar o treino com menos exercícios do que o previsto.
 */
function pegarExerciciosCategoria(categoria, equip, qtd, jaUsados = new Set()) {
  const disponiveis = filtrarPorEquipamento(BANCO_EXERCICIOS[categoria], equip);
  if (disponiveis.length === 0 || qtd <= 0) return [];

  const inedito = disponiveis.filter((ex) => !jaUsados.has(ex.nome));
  const ordemPreferida = inedito.length ? inedito.concat(disponiveis) : disponiveis;

  const resultado = [];
  // 1ª passada: só exercícios distintos entre si
  for (let i = 0; i < ordemPreferida.length && resultado.length < qtd; i += 1) {
    const ex = ordemPreferida[i];
    if (!resultado.includes(ex)) resultado.push(ex);
  }
  // 2ª passada (equipamento muito restrito): repete ciclando a lista disponível
  let j = 0;
  while (resultado.length < qtd) {
    resultado.push(disponiveis[j % disponiveis.length]);
    j += 1;
  }
  return resultado.slice(0, qtd);
}

/** Monta um dia de categoria única (push/pull/legs) + sempre 1 exercício de core no fechamento (quando o equipamento permite). */
function montarDia(tipo, equip, qtdTotal, jaUsados) {
  if (tipo === 'full') {
    // distribui o volume entre pernas, push, pull e fecha com core
    const distribuicao = ['legs', 'push', 'pull', 'legs', 'push', 'pull', 'core', 'core'];
    const plano = distribuicao.slice(0, Math.max(qtdTotal, 4));
    const contagem = plano.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    let exercicios = [];
    Object.entries(contagem).forEach(([categoria, qtd]) => {
      exercicios = exercicios.concat(pegarExerciciosCategoria(categoria, equip, qtd, jaUsados));
    });
    // se alguma categoria não tinha equipamento compatível, completa com pernas/push/pull
    let k = 0;
    const ordemFallback = ['legs', 'push', 'pull'];
    while (exercicios.length < qtdTotal && k < qtdTotal * 3) {
      const extra = pegarExerciciosCategoria(ordemFallback[k % ordemFallback.length], equip, exercicios.length + 1, jaUsados);
      if (extra.length > exercicios.length) exercicios = extra;
      else break;
      k += 1;
    }
    return exercicios.slice(0, qtdTotal);
  }

  // sempre tenta fechar com 1 exercício de core; se o equipamento não permitir
  // nenhum exercício de core, todo o volume vai para a categoria principal
  const core = pegarExerciciosCategoria('core', equip, 1, jaUsados);
  const qtdPrincipal = qtdTotal - core.length;
  const principais = pegarExerciciosCategoria(tipo, equip, qtdPrincipal, jaUsados);
  return [...principais, ...core];
}

const NOME_DIA = { push: 'Push (Peito, Ombro, Tríceps)', pull: 'Pull (Costas, Bíceps)', legs: 'Legs (Pernas, Glúteo)', full: 'Full Body' };

function gerarTreino({ objetivo, dias, experiencia, equipamentos }) {
  const split = definirSplit(dias);
  const qtdExercicios = QTD_EXERCICIOS_POR_EXPERIENCIA[experiencia];
  const params = PARAMS_OBJETIVO[objetivo];

  const somenteCorporal = equipamentos.length === 1 && equipamentos[0] === 'corporal';
  const jaUsados = new Set();

  const diasPlano = split.map((tipo, index) => {
    const exercicios = montarDia(tipo, equipamentos, qtdExercicios, jaUsados);
    exercicios.forEach((ex) => jaUsados.add(ex.nome));
    return {
      titulo: `Treino ${String.fromCharCode(65 + index)} — ${NOME_DIA[tipo]}`,
      exercicios,
    };
  });

  return {
    diasPlano,
    params,
    adaptado: somenteCorporal || diasPlano.some((d) => d.exercicios.length < 5),
  };
}

function renderizarTreino(resultado, form) {
  const objetivoLabel = {
    hipertrofia: 'hipertrofia', forca: 'força', emagrecimento: 'emagrecimento', resistencia: 'resistência muscular',
  }[form.objetivo];

  document.getElementById('tr-titulo-plano').textContent = resultado.adaptado ? 'Seu treino adaptado' : 'Seu treino PPL';
  document.getElementById('tr-sub-plano').textContent = resultado.adaptado
    ? `Split adaptado ao equipamento disponível, focado em ${objetivoLabel}, ${form.dias} dias por semana.`
    : `Divisão Push / Pull / Legs, focada em ${objetivoLabel}, ${form.dias} dias por semana.`;

  const cont = document.getElementById('dias-treino');
  cont.innerHTML = resultado.diasPlano.map((dia) => `
    <div class="workout-day reveal-up in-view">
      <div class="workout-day-head">
        <h4>${dia.titulo}</h4>
        <span class="badge">${dia.exercicios.length} exercícios · ${resultado.params.series} séries · ${resultado.params.reps} reps · ${resultado.params.descanso} descanso</span>
      </div>
      <table class="exercise-table">
        <thead>
          <tr><th>Exercício</th><th>Grupo muscular</th><th>Séries</th><th>Reps</th><th>Descanso</th></tr>
        </thead>
        <tbody>
          ${dia.exercicios.map((ex) => `
            <tr>
              <td class="name">${ex.nome}</td>
              <td><span class="muscle-tag">${ex.musculo}</span></td>
              <td>${resultado.params.series}</td>
              <td>${resultado.params.reps}</td>
              <td>${resultado.params.descanso}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  const wrap = document.getElementById('resultado-treino');
  wrap.classList.add('show');
  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------------------------------------------------------------------
   2) TREINO TAF
--------------------------------------------------------------------- */

/** Referências aproximadas de desempenho por nível (usadas como meta de evolução). */
const METAS_TAF = {
  iniciante:     { barras: 4,  metros50: 9.0, distancia12min: 1800, abdominais: 25 },
  intermediario: { barras: 10, metros50: 8.0, distancia12min: 2400, abdominais: 40 },
  avancado:      { barras: 16, metros50: 7.2, distancia12min: 2800, abdominais: 55 },
};

const NOME_NIVEL = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' };

/** Gera um plano progressivo de 4 semanas evoluindo em direção à meta do nível. */
function gerarPlanoTaf(nivel, desempenho) {
  const meta = METAS_TAF[nivel];
  const semanas = [1, 2, 3, 4].map((semana) => {
    const progresso = semana / 4;
    const metaBarras = Math.round(desempenho.barras + (meta.barras - desempenho.barras) * progresso * 0.5);
    const metaAbdominais = Math.round(desempenho.abdominais + (meta.abdominais - desempenho.abdominais) * progresso * 0.5);
    const metaDistancia = Math.round(desempenho.distancia12min + (meta.distancia12min - desempenho.distancia12min) * progresso * 0.4);

    return {
      semana,
      objetivo: `Evoluir para ${Math.max(metaBarras, desempenho.barras)} barras, ${Math.max(metaAbdominais, desempenho.abdominais)} abdominais/min e ${Math.max(metaDistancia, desempenho.distancia12min)}m em 12min.`,
      aquecimento: '5-8min de corrida leve + mobilidade de ombro, quadril e tornozelo.',
      principal: [
        `Barra fixa: ${4 + semana} séries até quase a falha, descanso de 90s.`,
        `Corrida de 50m: ${6} tiros com descanso completo entre eles, focando em explosão.`,
        `Corrida contínua: ${20 + semana * 2}min em ritmo moderado a forte.`,
        `Abdominais: ${3 + Math.min(semana, 3)} séries de 1 minuto, descanso de 45s.`,
      ],
      descanso: semana < 4 ? '1 dia completo de descanso ativo (caminhada leve) entre os treinos intensos.' : '2 dias de descanso antes de reavaliar seu desempenho.',
      alongamento: '10min de alongamento de posterior de coxa, panturrilha, peitoral e dorsal ao final de cada sessão.',
    };
  });
  return semanas;
}

function classificarDesempenho(desempenho) {
  // aponta o nível mais próximo do desempenho atual, usado apenas como referência textual
  const pontuar = (nivel) => {
    const m = METAS_TAF[nivel];
    let pontos = 0;
    if (desempenho.barras >= m.barras) pontos += 1;
    if (desempenho.metros50 <= m.metros50) pontos += 1;
    if (desempenho.distancia12min >= m.distancia12min) pontos += 1;
    if (desempenho.abdominais >= m.abdominais) pontos += 1;
    return pontos;
  };
  const pontos = { iniciante: pontuar('iniciante'), intermediario: pontuar('intermediario'), avancado: pontuar('avancado') };
  if (pontos.avancado >= 3) return 'avancado';
  if (pontos.intermediario >= 2) return 'intermediario';
  return 'iniciante';
}

function renderizarTaf(nivelEscolhido, desempenho) {
  const semanas = gerarPlanoTaf(nivelEscolhido, desempenho);
  const nivelAtual = classificarDesempenho(desempenho);

  document.getElementById('taf-res-nivel').textContent = NOME_NIVEL[nivelEscolhido];
  document.getElementById('taf-res-sub').textContent =
    `Seu desempenho atual está compatível com o nível ${NOME_NIVEL[nivelAtual]}. O plano abaixo evolui progressivamente rumo ao nível ${NOME_NIVEL[nivelEscolhido]}.`;

  const cont = document.getElementById('taf-semanas');
  cont.innerHTML = semanas.map((s) => `
    <div class="taf-week-card reveal-up in-view">
      <h4>Semana ${s.semana}</h4>
      <p class="taf-week-goal">${s.objetivo}</p>
      <div class="taf-phases">
        <div class="taf-phase"><span class="ph-label">Aquecimento</span><p>${s.aquecimento}</p></div>
        <div class="taf-phase"><span class="ph-label">Treino principal</span><p>${s.principal.join(' ')}</p></div>
        <div class="taf-phase"><span class="ph-label">Descanso</span><p>${s.descanso}</p></div>
        <div class="taf-phase"><span class="ph-label">Alongamento</span><p>${s.alongamento}</p></div>
      </div>
    </div>
  `).join('');

  const wrap = document.getElementById('resultado-taf');
  wrap.classList.add('show');
  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------------------------------------------------------------------
   INICIALIZAÇÃO
--------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // --- Tabs ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = { personalizado: document.getElementById('panel-personalizado'), taf: document.getElementById('panel-taf') };

  function ativarTab(nome) {
    tabButtons.forEach((b) => b.classList.toggle('active', b.dataset.tab === nome));
    Object.entries(panels).forEach(([key, el]) => el.classList.toggle('active', key === nome));
  }
  tabButtons.forEach((btn) => btn.addEventListener('click', () => ativarTab(btn.dataset.tab)));

  // permite acessar #taf diretamente (ex: link da Home)
  if (window.location.hash === '#taf') ativarTab('taf');

  // --- Formulário: Treino Personalizado ---
  const formTreino = document.getElementById('form-treino');
  formTreino.addEventListener('submit', (e) => {
    e.preventDefault();
    const equipamentos = Array.from(
      formTreino.querySelectorAll('.check-grid input:checked')
    ).map((i) => i.value);

    const erroEl = document.getElementById('erro-equip');
    if (equipamentos.length === 0) {
      erroEl.style.display = 'block';
      return;
    }
    erroEl.style.display = 'none';

    const form = {
      objetivo: document.getElementById('tr-objetivo').value,
      dias: Number(document.getElementById('tr-dias').value),
      experiencia: document.getElementById('tr-experiencia').value,
      equipamentos,
    };
    const resultado = gerarTreino(form);
    renderizarTreino(resultado, form);
  });

  // --- Seleção de nível TAF ---
  const nivelCards = document.querySelectorAll('.taf-level-card');
  const formTaf = document.getElementById('form-taf');
  let nivelSelecionado = null;

  nivelCards.forEach((card) => {
    card.addEventListener('click', () => {
      nivelCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      nivelSelecionado = card.dataset.nivel;
      formTaf.style.display = 'grid';
      formTaf.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  formTaf.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!nivelSelecionado) return;
    const desempenho = {
      barras: Number(document.getElementById('taf-barras').value),
      metros50: Number(document.getElementById('taf-50m').value),
      distancia12min: Number(document.getElementById('taf-12min').value),
      abdominais: Number(document.getElementById('taf-abdominais').value),
    };
    renderizarTaf(nivelSelecionado, desempenho);
  });
});
