let db = null;
let currentVersion = 'nvi';
let currentSearchTerm = '';
let currentVerseData = null;

const bookNames = {
    1: 'Gênesis', 2: 'Êxodo', 3: 'Levítico', 4: 'Números', 5: 'Deuteronômio',
    6: 'Josué', 7: 'Juízes', 8: 'Rute', 9: '1 Samuel', 10: '2 Samuel',
    11: '1 Reis', 12: '2 Reis', 13: '1 Crônicas', 14: '2 Crônicas', 15: 'Esdras',
    16: 'Neemias', 17: 'Ester', 18: 'Jó', 19: 'Salmos', 20: 'Provérbios',
    21: 'Eclesiastes', 22: 'Cânticos', 23: 'Isaías', 24: 'Jeremias', 25: 'Lamentações',
    26: 'Ezequiel', 27: 'Daniel', 28: 'Oséias', 29: 'Joel', 30: 'Amós',
    31: 'Obadias', 32: 'Jonas', 33: 'Miquéias', 34: 'Naum', 35: 'Habacuque',
    36: 'Sofonias', 37: 'Ageu', 38: 'Zacarias', 39: 'Malaquias', 40: 'Mateus',
    41: 'Marcos', 42: 'Lucas', 43: 'João', 44: 'Atos', 45: 'Romanos',
    46: '1 Coríntios', 47: '2 Coríntios', 48: 'Gálatas', 49: 'Efésios', 50: 'Filipenses',
    51: 'Colossenses', 52: '1 Tessalonicenses', 53: '2 Tessalonicenses', 54: '1 Timóteo', 55: '2 Timóteo',
    56: 'Tito', 57: 'Filemom', 58: 'Hebreus', 59: 'Tiago', 60: '1 Pedro',
    61: '2 Pedro', 62: '1 João', 63: '2 João', 64: '3 João', 65: 'Judas', 66: 'Apocalipse'
};

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await initDatabase();
    setupEventListeners();
    populateBookSelect();
});

// Inicializar banco de dados SQLite
async function initDatabase() {
    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        const response = await fetch('bible_unified.db');
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));
        
        console.log('Database loaded successfully');
    } catch (error) {
        console.error('Error loading database:', error);
        alert('Erro ao carregar o banco de dados. Verifique se o arquivo bible_unified.db está disponível.');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Version select
    document.getElementById('versionSelect').addEventListener('change', (e) => {
        currentVersion = e.target.value;
    });

    // Search
    document.getElementById('searchBtn').addEventListener('click', searchByWord);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchByWord();
    });

    // Reference search
    document.getElementById('bookSelect').addEventListener('change', onBookChange);
    document.getElementById('chapterSelect').addEventListener('change', onChapterChange);
    document.getElementById('referenceBtn').addEventListener('click', searchByReference);

    // Modal
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('imageModal').addEventListener('click', (e) => {
        if (e.target.id === 'imageModal') closeModal();
    });

    // Color picker
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => selectColor(btn));
    });

    // Image actions
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('copyBtn').addEventListener('click', copyImage);
    document.getElementById('whatsappBtn').addEventListener('click', shareWhatsApp);
}

// Switch tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Popular select de livros
function populateBookSelect() {
    const select = document.getElementById('bookSelect');
    Object.entries(bookNames).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        select.appendChild(option);
    });
}

// Quando seleciona livro
function onBookChange() {
    const bookId = document.getElementById('bookSelect').value;
    const chapterSelect = document.getElementById('chapterSelect');
    const verseSelect = document.getElementById('verseSelect');
    const referenceBtn = document.getElementById('referenceBtn');

    chapterSelect.innerHTML = '<option value="">Selecione o capítulo...</option>';
    verseSelect.innerHTML = '<option value="">Selecione o versículo...</option>';
    verseSelect.disabled = true;
    referenceBtn.disabled = true;

    if (!bookId) {
        chapterSelect.disabled = true;
        return;
    }

    const query = `SELECT DISTINCT chapter FROM verses WHERE book = ? AND version = ? ORDER BY chapter`;
    const result = db.exec(query, [bookId, currentVersion]);

    if (result.length > 0) {
        result[0].values.forEach(([chapter]) => {
            const option = document.createElement('option');
            option.value = chapter;
            option.textContent = `Capítulo ${chapter}`;
            chapterSelect.appendChild(option);
        });
        chapterSelect.disabled = false;
    }
}

// Quando seleciona capítulo
function onChapterChange() {
    const bookId = document.getElementById('bookSelect').value;
    const chapter = document.getElementById('chapterSelect').value;
    const verseSelect = document.getElementById('verseSelect');
    const referenceBtn = document.getElementById('referenceBtn');

    verseSelect.innerHTML = '<option value="">Todos os versículos</option>';

    if (!chapter) {
        verseSelect.disabled = true;
        referenceBtn.disabled = true;
        return;
    }

    const query = `SELECT DISTINCT verse FROM verses WHERE book = ? AND chapter = ? AND version = ? ORDER BY verse`;
    const result = db.exec(query, [bookId, chapter, currentVersion]);

    if (result.length > 0) {
        result[0].values.forEach(([verse]) => {
            const option = document.createElement('option');
            option.value = verse;
            option.textContent = `Versículo ${verse}`;
            verseSelect.appendChild(option);
        });
        verseSelect.disabled = false;
        referenceBtn.disabled = false;
    }
}

// Busca por palavra/frase
function searchByWord() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (!searchTerm) {
        alert('Digite uma palavra ou frase para buscar');
        return;
    }

    currentSearchTerm = searchTerm;
    showLoading();

    const query = `SELECT book, chapter, verse, text FROM verses WHERE version = ? AND text LIKE ? LIMIT 100`;
    const result = db.exec(query, [currentVersion, `%${searchTerm}%`]);

    displayResults(result, searchTerm);
}

// Busca por referência
function searchByReference() {
    const bookId = document.getElementById('bookSelect').value;
    const chapter = document.getElementById('chapterSelect').value;
    const verse = document.getElementById('verseSelect').value;

    if (!bookId || !chapter) {
        alert('Selecione pelo menos o livro e o capítulo');
        return;
    }

    currentSearchTerm = '';
    showLoading();

    let query, params;
    if (verse) {
        query = `SELECT book, chapter, verse, text FROM verses WHERE version = ? AND book = ? AND chapter = ? AND verse = ?`;
        params = [currentVersion, bookId, chapter, verse];
    } else {
        query = `SELECT book, chapter, verse, text FROM verses WHERE version = ? AND book = ? AND chapter = ? ORDER BY verse`;
        params = [currentVersion, bookId, chapter];
    }

    const result = db.exec(query, params);
    displayResults(result);
}

// Exibir resultados
function displayResults(result, highlightTerm = '') {
    hideLoading();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!result.length || !result[0].values.length) {
        resultsDiv.innerHTML = '<div class="verse-card"><p>Nenhum resultado encontrado.</p></div>';
        return;
    }

    result[0].values.forEach(([book, chapter, verse, text]) => {
        const card = document.createElement('div');
        card.className = 'verse-card';

        const reference = `${bookNames[book]} ${chapter}:${verse}`;
        const highlightedText = highlightTerm ? highlightText(text, highlightTerm) : text;

        card.innerHTML = `
            <div class="verse-reference">${reference} - ${currentVersion.toUpperCase()}</div>
            <div class="verse-text">${highlightedText}</div>
            <div class="verse-actions">
                <button class="btn-generate" onclick="openImageModal('${reference}', \`${text.replace(/`/g, '\\`')}\`, '${highlightTerm}')">
                    📷 Gerar Imagem
                </button>
            </div>
        `;

        resultsDiv.appendChild(card);
    });
}

// Destacar texto
function highlightText(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Abrir modal de imagem
function openImageModal(reference, text, highlightTerm) {
    currentVerseData = { reference, text, highlightTerm };
    document.getElementById('imageModal').classList.remove('hidden');
    
    // Selecionar cor branca por padrão
    const whiteBtn = document.querySelector('.color-btn[data-color="#FFFFFF"]');
    selectColor(whiteBtn);
}

// Fechar modal
function closeModal() {
    document.getElementById('imageModal').classList.add('hidden');
}

// Selecionar cor
function selectColor(btn) {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    generateImagePreview(btn.dataset.color);
}

// Gerar preview da imagem
function generateImagePreview(bgColor) {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const { reference, text, highlightTerm } = currentVerseData;

    // Configurações
    const padding = 40;
    const maxWidth = 600;
    const lineHeight = 32;
    const fontSize = 24;

    canvas.width = maxWidth + (padding * 2);
    
    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configurar texto
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Quebrar texto em linhas
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine.trim());

    // Calcular altura total
    const textHeight = lines.length * lineHeight;
    const referenceHeight = 40;
    const totalHeight = textHeight + referenceHeight + (padding * 3);
    
    canvas.height = totalHeight;

    // Redesenhar background com altura correta
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cor do texto baseada no fundo
    const textColor = isLightColor(bgColor) ? '#000000' : '#FFFFFF';
    ctx.fillStyle = textColor;

    // Desenhar texto com destaque
    let y = padding;
    lines.forEach(line => {
        if (highlightTerm) {
            drawLineWithHighlight(ctx, line, padding, y, highlightTerm, textColor, maxWidth);
        } else {
            ctx.fillText(line, padding, y);
        }
        y += lineHeight;
    });

    // Desenhar referência
    y += 20;
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillStyle = textColor;
    ctx.fillText(`${reference} - ${currentVersion.toUpperCase()}`, padding, y);

    // Mostrar preview
    const preview = document.getElementById('imagePreview');
    const img = canvas.toDataURL('image/png');
    preview.innerHTML = `<img src="${img}" alt="Preview">`;
}

// Desenhar linha com destaque
function drawLineWithHighlight(ctx, line, x, y, highlightTerm, textColor, maxWidth) {
    const regex = new RegExp(`(${highlightTerm})`, 'gi');
    const parts = line.split(regex);
    
    let currentX = x;
    parts.forEach(part => {
        if (part.toLowerCase() === highlightTerm.toLowerCase()) {
            // Desenhar destaque amarelo
            const metrics = ctx.measureText(part);
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(currentX, y, metrics.width, 28);
            ctx.fillStyle = '#000000';
            ctx.fillText(part, currentX, y);
            currentX += metrics.width;
            ctx.fillStyle = textColor;
        } else {
            ctx.fillText(part, currentX, y);
            currentX += ctx.measureText(part).width;
        }
    });
}

// Verificar se cor é clara
function isLightColor(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
}

// Download da imagem
function downloadImage() {
    const canvas = document.getElementById('imageCanvas');
    const link = document.createElement('a');
    link.download = `biblia-tripla-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Copiar imagem
async function copyImage() {
    try {
        const canvas = document.getElementById('imageCanvas');
        canvas.toBlob(async (blob) => {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            alert('Imagem copiada para a área de transferência!');
        });
    } catch (error) {
        alert('Erro ao copiar imagem. Tente fazer o download.');
    }
}

// Compartilhar no WhatsApp
function shareWhatsApp() {
    const { reference, text } = currentVerseData;
    const message = encodeURIComponent(`${text}\n\n${reference} - ${currentVersion.toUpperCase()}\n\n📖 Bíblia Tripla`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
}

// Loading
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('results').innerHTML = '';
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}
