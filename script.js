const canvas = document.getElementById('canvasLogo');
const ctx = canvas.getContext('2d');
const consoleInput = document.getElementById('console');
const btnCaneta = document.getElementById('btnCaneta');

let t = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angulo: -Math.PI / 2, 
    canetaBaixo: true,
    corAtual: 'rgb(0,255,204)',
    modoArcoiris: false,
    hueArcoiris: 0
};

let linhasSalvas = [];

window.alternarCaneta = function() {
    t.canetaBaixo = !t.canetaBaixo;
    atualizarInterfaceCaneta();
    renderizarTela();
};

window.mudarCor = function(novaCor, event) {
    const botoes = document.querySelectorAll('.grid-cores > button');
    botoes.forEach(b => b.style.border = 'none');
    if(event) event.target.style.border = '2px solid white';

    if (novaCor === 'arcoiris') {
        t.modoArcoiris = true;
    } else {
        t.modoArcoiris = false;
        t.corAtual = novaCor;
    }
};

window.controlar = function(acao) {
    if (acao === 'pf') moverFrente(50);
    if (acao === 'pd') { t.angulo += (45 * Math.PI) / 180; renderizarTela(); }
    if (acao === 'pe') { t.angulo -= (45 * Math.PI) / 180; renderizarTela(); }
    if (acao === 'limpe') inicializar();
};

function desenharTartarugaGeometrica() {
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.rotate(t.angulo + Math.PI / 2);

    ctx.fillStyle = t.canetaBaixo ? 'rgb(34,139,34)' : 'rgb(100,100,100)';
    ctx.beginPath(); ctx.arc(-18, -15, 6, 0, 2*Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(18, -15, 6, 0, 2*Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(-16, 18, 5, 0, 2*Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(16, 18, 5, 0, 2*Math.PI); ctx.fill();
    
    ctx.beginPath(); ctx.moveTo(-4, 22); ctx.lineTo(0, 32); ctx.lineTo(4, 22); ctx.closePath(); ctx.fill();

    ctx.fillStyle = t.canetaBaixo ? 'rgb(50,205,50)' : 'rgb(140,140,140)';
    ctx.beginPath(); ctx.arc(0, -26, 10, 0, 2*Math.PI); ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(-4, -29, 2, 0, 2*Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -29, 2, 0, 2*Math.PI); ctx.fill();

    ctx.fillStyle = t.canetaBaixo ? 'rgb(46,139,87)' : 'rgb(80,80,80)';
    ctx.strokeStyle = t.canetaBaixo ? 'rgb(15,76,36)' : 'rgb(50,50,50)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 20, 0, 2*Math.PI); ctx.fill(); ctx.stroke();

    ctx.beginPath(); ctx.arc(0, 0, 10, 0, 2*Math.PI); ctx.stroke();
    ctx.restore();
}

function renderizarTela() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    
    linhasSalvas.forEach(linha => {
        ctx.strokeStyle = linha.cor;
        ctx.beginPath();
        ctx.moveTo(linha.x1, linha.y1);
        ctx.lineTo(linha.x2, linha.y2);
        ctx.stroke();
    });

    desenharTartarugaGeometrica();
}

function inicializar() {
    linhasSalvas = [];
    t.x = canvas.width / 2;
    t.y = canvas.height / 2;
    t.angulo = -Math.PI / 2;
    t.canetaBaixo = true;
    atualizarInterfaceCaneta();
    renderizarTela();
}

function atualizarInterfaceCaneta() {
    if (t.canetaBaixo) {
        btnCaneta.innerText = "✏️ Desenhando";
        btnCaneta.style.background = "#4caf50";
    } else {
        btnCaneta.innerText = "❌ Sem Rastro";
        btnCaneta.style.background = "#777";
    }
}

function moverFrente(passos) {
    let novoX = t.x + passos * Math.cos(t.angulo);
    let novoY = t.y + passos * Math.sin(t.angulo);
    
    if (t.canetaBaixo) {
        let col = t.corAtual;
        if (t.modoArcoiris) {
            col = `hsl(${t.hueArcoiris}, 100%, 50%)`;
            t.hueArcoiris = (t.hueArcoiris + 12) % 360;
        }
        linhasSalvas.push({ x1: t.x, y1: t.y, x2: novoX, y2: novoY, cor: col });
    }
    t.x = novoX; t.y = novoY;
    renderizarTela();
}

canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    t.x = e.clientX - rect.left;
    t.y = e.clientY - rect.top;
    renderizarTela();
});

function interpretar(comandoTexto) {
    const partes = comandoTexto.toLowerCase().trim().split(/\s+/);
    let i = 0;
    while (i < partes.length) {
        let cmd = partes[i];
        let val = parseFloat(partes[i+1]);
        if (cmd === 'pf' || cmd === 'para_frente') { moverFrente(val); i += 2; } 
        else if (cmd === 'pd' || cmd === 'para_direita') { t.angulo += (val * Math.PI) / 180; i += 2; } 
        else if (cmd === 'pe' || cmd === 'para_esquerda') { t.angulo -= (val * Math.PI) / 180; i += 2; }
else if (cmd === 'sc' || cmd === 'solta_caneta' || cmd === 'un') { t.canetaBaixo = false; atualizarInterfaceCaneta(); i += 1; }
else if (cmd === 'pc' || cmd === 'pega_caneta' || cmd === 'usecaneta') { t.canetaBaixo = true; atualizarInterfaceCaneta(); i += 1; }
else if (cmd === 'limpe') { inicializar(); return; }
else { i++; }
}
renderizarTela();
}
consoleInput.addEventListener('keydown', (e) => {
if (e.key === 'Enter') {
interpretar(consoleInput.value);
consoleInput.value = '';
}
});
inicializar();
