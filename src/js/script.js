const state = {
    stage: 'AUDIO_TEST',
    currentTrial: 0,
    trials: [],
    results: [],
    startTime: 0,
    errorsInTrial: 0,
    rapportNumber: [1, 7, 9],
    rapportAttempts: 0,
    pendingStage: null,
    aborted: false,
    currentAudio: null
};

const ABORT_CODE = "end42";
let abortBuffer = "";
let abortBufferTimer = null;

const DEMO_TRIALS = {
    STAGE_1: [
        { num: 7, voice: 'masculina', isSwitch: false }, { num: 2, voice: 'masculina', isSwitch: false },
        { num: 3, voice: 'masculina', isSwitch: false }, { num: 4, voice: 'masculina', isSwitch: false },
        { num: 1, voice: 'masculina', isSwitch: false }, { num: 8, voice: 'masculina', isSwitch: false }
    ],
    STAGE_2: [
        { num: 8, voice: 'feminina', isSwitch: false }, { num: 3, voice: 'feminina', isSwitch: false },
        { num: 9, voice: 'feminina', isSwitch: false }, { num: 1, voice: 'feminina', isSwitch: false },
        { num: 4, voice: 'feminina', isSwitch: false }, { num: 7, voice: 'feminina', isSwitch: false }
    ],
    STAGE_3: [
        { num: 2, voice: 'feminina', isSwitch: true },
        { num: 6, voice: 'masculina', isSwitch: true },
        { num: 4, voice: 'masculina', isSwitch: false },
        { num: 2, voice: 'feminina', isSwitch: true },
        { num: 9, voice: 'feminina', isSwitch: false },
        { num: 1, voice: 'masculina', isSwitch: true }
    ]
};

const OFFICIAL_TRIALS = {
    STAGE_1: [
        { num: 7, voice: 'masculina', isSwitch: false }, { num: 3, voice: 'masculina', isSwitch: false },
        { num: 4, voice: 'masculina', isSwitch: false }, { num: 1, voice: 'masculina', isSwitch: false },
        { num: 6, voice: 'masculina', isSwitch: false }, { num: 8, voice: 'masculina', isSwitch: false },
        { num: 9, voice: 'masculina', isSwitch: false }, { num: 2, voice: 'masculina', isSwitch: false },
        { num: 7, voice: 'masculina', isSwitch: false }, { num: 3, voice: 'masculina', isSwitch: false },
        { num: 6, voice: 'masculina', isSwitch: false }, { num: 1, voice: 'masculina', isSwitch: false },
        { num: 8, voice: 'masculina', isSwitch: false }, { num: 4, voice: 'masculina', isSwitch: false },
        { num: 9, voice: 'masculina', isSwitch: false }, { num: 2, voice: 'masculina', isSwitch: false },
        { num: 6, voice: 'masculina', isSwitch: false }, { num: 9, voice: 'masculina', isSwitch: false },
        { num: 2, voice: 'masculina', isSwitch: false }, { num: 1, voice: 'masculina', isSwitch: false },
        { num: 7, voice: 'masculina', isSwitch: false }, { num: 3, voice: 'masculina', isSwitch: false },
        { num: 4, voice: 'masculina', isSwitch: false }, { num: 8, voice: 'masculina', isSwitch: false },
        { num: 7, voice: 'masculina', isSwitch: false }, { num: 6, voice: 'masculina', isSwitch: false },
        { num: 8, voice: 'masculina', isSwitch: false }, { num: 3, voice: 'masculina', isSwitch: false },
        { num: 4, voice: 'masculina', isSwitch: false }, { num: 9, voice: 'masculina', isSwitch: false },
        { num: 1, voice: 'masculina', isSwitch: false }, { num: 8, voice: 'masculina', isSwitch: false },
        { num: 9, voice: 'masculina', isSwitch: false }, { num: 4, voice: 'masculina', isSwitch: false },
        { num: 2, voice: 'masculina', isSwitch: false }, { num: 1, voice: 'masculina', isSwitch: false },
        { num: 7, voice: 'masculina', isSwitch: false }, { num: 3, voice: 'masculina', isSwitch: false },
        { num: 6, voice: 'masculina', isSwitch: false }, { num: 2, voice: 'masculina', isSwitch: false }
    ],
    STAGE_2: [
        { num: 8, voice: 'feminina', isSwitch: false }, { num: 9, voice: 'feminina', isSwitch: false },
        { num: 7, voice: 'feminina', isSwitch: false }, { num: 6, voice: 'feminina', isSwitch: false },
        { num: 3, voice: 'feminina', isSwitch: false }, { num: 1, voice: 'feminina', isSwitch: false },
        { num: 2, voice: 'feminina', isSwitch: false }, { num: 4, voice: 'feminina', isSwitch: false },
        { num: 8, voice: 'feminina', isSwitch: false }, { num: 9, voice: 'feminina', isSwitch: false },
        { num: 3, voice: 'feminina', isSwitch: false }, { num: 6, voice: 'feminina', isSwitch: false },
        { num: 1, voice: 'feminina', isSwitch: false }, { num: 7, voice: 'feminina', isSwitch: false },
        { num: 2, voice: 'feminina', isSwitch: false }, { num: 4, voice: 'feminina', isSwitch: false },
        { num: 3, voice: 'feminina', isSwitch: false }, { num: 2, voice: 'feminina', isSwitch: false },
        { num: 4, voice: 'feminina', isSwitch: false }, { num: 6, voice: 'feminina', isSwitch: false },
        { num: 8, voice: 'feminina', isSwitch: false }, { num: 9, voice: 'feminina', isSwitch: false },
        { num: 7, voice: 'feminina', isSwitch: false }, { num: 1, voice: 'feminina', isSwitch: false },
        { num: 8, voice: 'feminina', isSwitch: false }, { num: 3, voice: 'feminina', isSwitch: false },
        { num: 1, voice: 'feminina', isSwitch: false }, { num: 9, voice: 'feminina', isSwitch: false },
        { num: 7, voice: 'feminina', isSwitch: false }, { num: 2, voice: 'feminina', isSwitch: false },
        { num: 6, voice: 'feminina', isSwitch: false }, { num: 1, voice: 'feminina', isSwitch: false },
        { num: 2, voice: 'feminina', isSwitch: false }, { num: 7, voice: 'feminina', isSwitch: false },
        { num: 4, voice: 'feminina', isSwitch: false }, { num: 6, voice: 'feminina', isSwitch: false },
        { num: 8, voice: 'feminina', isSwitch: false }, { num: 9, voice: 'feminina', isSwitch: false },
        { num: 3, voice: 'feminina', isSwitch: false }, { num: 4, voice: 'feminina', isSwitch: false }
    ],
    STAGE_3: [
        { num: 9, task: 'par_impar', isSwitch: false, voice: 'masculina' },
        { num: 4, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 1, task: 'maior_menor', isSwitch: true, voice: 'feminina' },
        { num: 7, task: 'maior_menor', isSwitch: false, voice: 'masculina' },
        { num: 8, task: 'maior_menor', isSwitch: false, voice: 'masculina' },
        { num: 3, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 2, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 6, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 9, task: 'par_impar', isSwitch: true, voice: 'masculina' },
        { num: 4, task: 'maior_menor', isSwitch: true, voice: 'feminina' },
        { num: 1, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 7, task: 'par_impar', isSwitch: true, voice: 'masculina' },
        { num: 8, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 3, task: 'maior_menor', isSwitch: true, voice: 'feminina' },
        { num: 2, task: 'par_impar', isSwitch: true, voice: 'feminina' },
        { num: 6, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 9, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 4, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 1, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 7, task: 'par_impar', isSwitch: true, voice: 'masculina' },
        { num: 8, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 3, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 2, task: 'par_impar', isSwitch: true, voice: 'feminina' },
        { num: 6, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 9, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 4, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 1, task: 'par_impar', isSwitch: true, voice: 'masculina' },
        { num: 7, task: 'par_impar', isSwitch: false, voice: 'masculina' },
        { num: 8, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 3, task: 'maior_menor', isSwitch: true, voice: 'feminina' },
        { num: 2, task: 'par_impar', isSwitch: true, voice: 'feminina' },
        { num: 6, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 9, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 4, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 1, task: 'par_impar', isSwitch: true, voice: 'masculina' },
        { num: 7, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 8, task: 'maior_menor', isSwitch: false, voice: 'masculina' },
        { num: 3, task: 'par_impar', isSwitch: true, voice: 'masculina' },
        { num: 2, task: 'maior_menor', isSwitch: true, voice: 'feminina' },
        { num: 6, task: 'par_impar', isSwitch: true, voice: 'feminina' },
        { num: 4, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 2, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 9, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 8, task: 'par_impar', isSwitch: true, voice: 'feminina' },
        { num: 1, task: 'par_impar', isSwitch: false, voice: 'masculina' },
        { num: 7, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 6, task: 'par_impar', isSwitch: true, voice: 'feminina' },
        { num: 3, task: 'par_impar', isSwitch: false, voice: 'masculina' },
        { num: 4, task: 'maior_menor', isSwitch: true, voice: 'feminina' },
        { num: 2, task: 'par_impar', isSwitch: true, voice: 'feminina' },
        { num: 9, task: 'par_impar', isSwitch: false, voice: 'masculina' },
        { num: 8, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 1, task: 'par_impar', isSwitch: true, voice: 'masculina' },
        { num: 7, task: 'par_impar', isSwitch: false, voice: 'masculina' },
        { num: 6, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 3, task: 'par_impar', isSwitch: false, voice: 'masculina' },
        { num: 4, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 2, task: 'maior_menor', isSwitch: true, voice: 'feminina' },
        { num: 9, task: 'par_impar', isSwitch: true, voice: 'masculina' },
        { num: 8, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 1, task: 'par_impar', isSwitch: false, voice: 'masculina' },
        { num: 7, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 6, task: 'par_impar', isSwitch: true, voice: 'feminina' },
        { num: 3, task: 'maior_menor', isSwitch: true, voice: 'feminina' },
        { num: 4, task: 'par_impar', isSwitch: true, voice: 'feminina' },
        { num: 2, task: 'par_impar', isSwitch: false, voice: 'feminina' },
        { num: 9, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 8, task: 'maior_menor', isSwitch: false, voice: 'masculina' },
        { num: 1, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 7, task: 'maior_menor', isSwitch: false, voice: 'masculina' },
        { num: 6, task: 'maior_menor', isSwitch: false, voice: 'masculina' },
        { num: 3, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 4, task: 'par_impar', isSwitch: true, voice: 'feminina' },
        { num: 2, task: 'maior_menor', isSwitch: true, voice: 'feminina' },
        { num: 9, task: 'maior_menor', isSwitch: false, voice: 'masculina' },
        { num: 8, task: 'maior_menor', isSwitch: false, voice: 'masculina' },
        { num: 1, task: 'maior_menor', isSwitch: false, voice: 'feminina' },
        { num: 7, task: 'par_impar', isSwitch: true, voice: 'masculina' },
        { num: 6, task: 'maior_menor', isSwitch: true, voice: 'masculina' },
        { num: 3, task: 'par_impar', isSwitch: true, voice: 'masculina' }
    ]
};

function getTrialsForStage(stage) {
    if (stage.endsWith('_OFICIAL')) {
        return OFFICIAL_TRIALS[stage.replace('_OFICIAL', '')];
    }
    return DEMO_TRIALS[stage];
}

function render() {
    const container = document.getElementById('screen-container');
    container.innerHTML = '';

    if (state.stage === 'AUDIO_TEST') {
        const template = document.getElementById('audio-test-template');
        const clone = template.content.cloneNode(true);
        container.appendChild(clone);
    } 
    else if (state.stage.includes('_INSTR') || state.stage === 'POSITIONING') {
        renderInstructions(container);
    }
    else if (state.stage.startsWith('STAGE_')) {
        const trial = state.trials[state.currentTrial];
        container.innerHTML = `
            <div class="test-icon" id="feedback-icon">🔊</div>
            <div class="key-hints">${getKeyHintsHTML(state.stage)}</div>`;
        playAudio(trial.num, trial.voice);
    }
    else if (state.stage === 'RESULTS') {
        renderResults(container);
    }
}

function renderInstructions(container) {
    let templateId;
    if (state.stage === 'STAGE_1_INSTR') templateId = 'stage1-instr-template';
    else if (state.stage === 'STAGE_2_INSTR') templateId = 'stage2-instr-template';
    else if (state.stage === 'STAGE_3_INSTR') templateId = 'stage3-instr-template';
    else if (state.stage === 'POSITIONING') templateId = 'positioning-template';
    else if (state.stage.endsWith('_OFICIAL_INSTR')) templateId = 'oficial-transition-template';
    const template = document.getElementById(templateId);
    container.innerHTML = template.innerHTML;
    if (state.stage.endsWith('_OFICIAL_INSTR')) {
        const hints = container.querySelector('.key-hints');
        if (hints) hints.innerHTML = getKeyHintsHTML(state.stage);
    }
}

function getKeyHintsHTML(stage) {
    if (stage.startsWith('STAGE_1')) {
        return `
            <div class="key-box" id="key-a"><b>A</b><span>PAR</span></div>
            <div class="key-box" id="key-l"><b>L</b><span>ÍMPAR</span></div>`;
    }
    if (stage.startsWith('STAGE_2')) {
        return `
            <div class="key-box" id="key-a"><b>A</b><span>MENOR &lt; 5</span></div>
            <div class="key-box" id="key-l"><b>L</b><span>MAIOR &gt; 5</span></div>`;
    }
    return `
        <div class="key-box" id="key-a"><b>A</b><span>PAR<br>ou &lt; 5</span></div>
        <div class="key-box" id="key-l"><b>L</b><span>ÍMPAR<br>ou &gt; 5</span></div>`;
}

function playAudio(nums, voice) {
    if (state.aborted) return;
    if (!Array.isArray(nums)) nums = [nums];
    let index = 0;
    const playNext = () => {
        if (state.aborted) return;
        if (index < nums.length) {
            const audio = new Audio(`src/audio/${voice}/${nums[index]}.mp3`);
            state.currentAudio = audio;
            const proceed = () => {
                if (state.aborted) return;
                index++;
                if (index < nums.length) {
                    setTimeout(playNext, 500);
                } else {
                    state.startTime = performance.now();
                }
            };
            audio.onended = proceed;
            audio.onerror = () => {
                console.warn(`Áudio não encontrado: ${voice}/${nums[index]}.mp3. Avançando...`);
                proceed();
            };
            audio.play().catch(err => {
                console.warn(`Erro ao tentar tocar ${voice}/${nums[index]}.mp3:`, err);
                proceed();
            });
        }
    };
    playNext();
}

function playRapportAudio() {
    playAudio(state.rapportNumber, 'masculina');
}

function checkRapport() {
    const val = document.getElementById('rapport-in').value.trim().replace(/\s+/g, '');
    if (val === '179') {
        state.stage = 'STAGE_1_INSTR'; render();
    } else {
        state.rapportAttempts++;
        const msg = document.getElementById('rapport-msg');
        msg.innerText = state.rapportAttempts >= 5 ? "Problema no áudio? Contate o avaliador." : "Tente novamente!";
    }
}

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (state.stage === 'POSITIONING' && key === ' ') {
        const next = state.pendingStage;
        state.stage = next;
        state.trials = getTrialsForStage(next);
        state.currentTrial = 0;
        render();
        return;
    }

    if (state.stage.endsWith('_OFICIAL_INSTR') && key === ' ') {
        const next = state.stage.replace('_INSTR', '');
        state.stage = next;
        state.trials = getTrialsForStage(next);
        state.currentTrial = 0;
        render();
        return;
    }

    if (state.stage.includes('_INSTR') && key === ' ') {
        const next = state.stage.replace('_INSTR', '');
        state.pendingStage = next;
        state.stage = 'POSITIONING';
        render();
        return;
    }

    if (!state.stage.startsWith('STAGE_') || state.stage.includes('_INSTR')) return;
    if (key !== 'a' && key !== 'l') return;

    const btn = document.getElementById(`key-${key}`);
    const trial = state.trials[state.currentTrial];
    const isCorrect = validate(trial, key);

    if (btn) btn.classList.add('active-press');

    if (isCorrect) {
        btn.classList.add('success');
        const rt = performance.now() - state.startTime;
        state.results.push({
            stage: state.stage,
            num: trial.num,
            voice: trial.voice,
            task: trial.task ?? null,
            rt,
            numErrors: state.errorsInTrial,
            isSwitch: trial.isSwitch
        });

        setTimeout(() => {
            if (state.aborted) return;
            btn.classList.remove('active-press', 'success');
            state.errorsInTrial = 0; state.currentTrial++;
            if (state.currentTrial < state.trials.length) render();
            else advance();
        }, 150);
    } else {
        state.errorsInTrial++;
        btn.classList.add('fail');
        document.getElementById('feedback-icon').classList.add('shake');
        new Audio('src/audio/error.mp3').play();
        setTimeout(() => {
            if (state.aborted) return;
            btn.classList.remove('active-press', 'fail');
            const icon = document.getElementById('feedback-icon');
            if (icon) icon.classList.remove('shake');
        }, 300);
    }
});

function validate(trial, key) {
    if (trial.voice === 'masculina') return (trial.num % 2 === 0 && key === 'a') || (trial.num % 2 !== 0 && key === 'l');
    return (trial.num < 5 && key === 'a') || (trial.num > 5 && key === 'l');
}

function advance() {
    const nextStage = {
        'STAGE_1': 'STAGE_1_OFICIAL_INSTR',
        'STAGE_1_OFICIAL': 'STAGE_2_INSTR',
        'STAGE_2': 'STAGE_2_OFICIAL_INSTR',
        'STAGE_2_OFICIAL': 'STAGE_3_INSTR',
        'STAGE_3': 'STAGE_3_OFICIAL_INSTR',
        'STAGE_3_OFICIAL': 'RESULTS'
    }[state.stage] ?? 'RESULTS';
    state.stage = nextStage;
    render();
}

function renderResults(container) {
    container.innerHTML = `
        <div class="card" style="text-align:center;">
            <h2>Teste Concluído</h2>
            <p style="margin:1rem 0;">Clique no botão abaixo para baixar o arquivo CSV com os resultados.</p>
            <button class="btn-action" onclick="downloadCSV()">Baixar Resultados (CSV)</button>
            <br><br>
            <button class="btn-action btn-restart" onclick="location.reload()">Reiniciar</button>
        </div>`;
}

function abortTest() {
    if (!state.results.length) {
        location.reload();
        return;
    }
    state.aborted = true;
    if (state.currentAudio) {
        state.currentAudio.onended = null;
        state.currentAudio.onerror = null;
        try { state.currentAudio.pause(); } catch (_) {}
        state.currentAudio = null;
    }
    state.stage = 'RESULTS';
    render();
}

window.addEventListener('keydown', (e) => {
    if (e.key.length !== 1 || !/[a-z0-9]/i.test(e.key)) return;
    abortBuffer = (abortBuffer + e.key.toLowerCase()).slice(-ABORT_CODE.length);
    clearTimeout(abortBufferTimer);
    abortBufferTimer = setTimeout(() => { abortBuffer = ""; }, 2000);
    if (abortBuffer === ABORT_CODE) {
        abortBuffer = "";
        abortTest();
    }
});

function downloadCSV() {
    const header = ['indice', 'etapa', 'fase', 'numero', 'voz', 'tarefa', 'tempo_reacao_ms', 'numero_erros', 'eh_troca'];
    const rows = state.results.map((r, i) => {
        const isOfficial = r.stage.endsWith('_OFICIAL');
        const etapa = r.stage.replace('STAGE_', '').replace('_OFICIAL', '');
        return [
            i + 1,
            etapa,
            isOfficial ? 'oficial' : 'treino',
            r.num,
            r.voice,
            r.task ?? '',
            Math.round(r.rt),
            r.numErrors,
            r.isSwitch ? 'sim' : 'nao'
        ];
    });
    const csv = [header, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultados-task-switching-auditivo-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

render();