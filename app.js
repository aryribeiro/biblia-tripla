let db = null;
let currentVersion = 'NVI';
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
    const dbStatus = document.getElementById('dbStatus');
    dbStatus.textContent = '⏳ Carregando banco de dados...';
    dbStatus.className = 'db-status loading';
    
    await initDatabase();
    
    if (db) {
        dbStatus.textContent = '✅ Banco carregado com sucesso!';
        dbStatus.className = 'db-status ready';
        setTimeout(() => {
            dbStatus.style.display = 'none';
        }, 3000);
    } else {
        dbStatus.textContent = '❌ Erro ao carregar banco';
        dbStatus.className = 'db-status error';
    }
    
    setupEventListeners();
    populateBookSelect();
});

// Inicializar banco de dados SQLite
async function initDatabase() {
    try {
        console.log('Iniciando carregamento do banco de dados...');
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        console.log('sql.js carregado, baixando bible_unified.db (23MB)...');
        const response = await fetch('/bible_unified.db');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('Banco baixado, carregando na memória...');
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));
        
        console.log('✅ Database loaded successfully');
        
        // Testar query
        const test = db.exec('SELECT COUNT(*) FROM verses');
        console.log('📊 Total de versículos:', test[0].values[0][0]);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error loading database:', error);
        alert('Erro ao carregar o banco de dados: ' + error.message);
        return false;
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
        console.log('Versão alterada para:', currentVersion);
        
        // Resetar seleções ao mudar versão
        document.getElementById('bookSelect').value = '';
        document.getElementById('chapterSelect').innerHTML = '<option value="">Selecione o capítulo...</option>';
        document.getElementById('chapterSelect').disabled = true;
        document.getElementById('verseSelect').innerHTML = '<option value="">Selecione o versículo...</option>';
        document.getElementById('verseSelect').disabled = true;
        document.getElementById('referenceBtn').disabled = true;
        document.getElementById('results').innerHTML = '';
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
    console.log('onBookChange chamado, db:', db ? 'carregado' : 'não carregado');
    
    if (!db) {
        alert('Aguarde o carregamento do banco de dados...');
        return;
    }

    const bookId = document.getElementById('bookSelect').value;
    console.log('Livro selecionado:', bookId);
    
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

    try {
        const query = `SELECT DISTINCT chapter FROM verses WHERE book_id = ? AND version = ? ORDER BY chapter`;
        console.log('Executando query:', query, 'com parâmetros:', [bookId, currentVersion]);
        
        const result = db.exec(query, [bookId, currentVersion]);
        console.log('Resultado da query:', result);

        if (result.length > 0 && result[0].values.length > 0) {
            console.log('Capítulos encontrados:', result[0].values.length);
            result[0].values.forEach(([chapter]) => {
                const option = document.createElement('option');
                option.value = chapter;
                option.textContent = `Capítulo ${chapter}`;
                chapterSelect.appendChild(option);
            });
            chapterSelect.disabled = false;
        } else {
            console.log('Nenhum capítulo encontrado');
        }
    } catch (error) {
        console.error('Error loading chapters:', error);
        alert('Erro ao carregar capítulos: ' + error.message);
    }
}

// Quando seleciona capítulo
function onChapterChange() {
    console.log('onChapterChange chamado');
    
    if (!db) {
        alert('Aguarde o carregamento do banco de dados...');
        return;
    }

    const bookId = document.getElementById('bookSelect').value;
    const chapter = document.getElementById('chapterSelect').value;
    const verseSelect = document.getElementById('verseSelect');
    const referenceBtn = document.getElementById('referenceBtn');

    console.log('Capítulo selecionado:', chapter, 'do livro:', bookId);

    verseSelect.innerHTML = '<option value="">Todos os versículos</option>';

    if (!chapter) {
        verseSelect.disabled = true;
        referenceBtn.disabled = true;
        return;
    }

    try {
        const query = `SELECT DISTINCT verse FROM verses WHERE book_id = ? AND chapter = ? AND version = ? ORDER BY verse`;
        console.log('Executando query versículos:', query, [bookId, chapter, currentVersion]);
        
        const result = db.exec(query, [bookId, chapter, currentVersion]);
        console.log('Versículos encontrados:', result);

        if (result.length > 0 && result[0].values.length > 0) {
            result[0].values.forEach(([verse]) => {
                const option = document.createElement('option');
                option.value = verse;
                option.textContent = `Versículo ${verse}`;
                verseSelect.appendChild(option);
            });
            verseSelect.disabled = false;
            referenceBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error loading verses:', error);
        alert('Erro ao carregar versículos: ' + error.message);
    }
}

// Busca por palavra/frase
function searchByWord() {
    if (!db) {
        alert('Aguarde o carregamento do banco de dados...');
        return;
    }

    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (!searchTerm) {
        alert('Digite uma palavra ou frase para buscar');
        return;
    }

    currentSearchTerm = searchTerm;
    showLoading();

    try {
        const query = `SELECT book_id, chapter, verse, text FROM verses WHERE version = ? AND text LIKE ? LIMIT 100`;
        const result = db.exec(query, [currentVersion, `%${searchTerm}%`]);
        displayResults(result, searchTerm);
    } catch (error) {
        console.error('Search error:', error);
        hideLoading();
        alert('Erro ao realizar busca. Tente novamente.');
    }
}

// Busca por referência
function searchByReference() {
    if (!db) {
        alert('Aguarde o carregamento do banco de dados...');
        return;
    }

    const bookId = document.getElementById('bookSelect').value;
    const chapter = document.getElementById('chapterSelect').value;
    const verse = document.getElementById('verseSelect').value;

    if (!bookId || !chapter) {
        alert('Selecione pelo menos o livro e o capítulo');
        return;
    }

    currentSearchTerm = '';
    showLoading();

    try {
        // SEMPRE buscar o capítulo inteiro
        const query = `SELECT book_id, chapter, verse, text FROM verses WHERE version = ? AND book_id = ? AND chapter = ? ORDER BY verse`;
        const params = [currentVersion, bookId, chapter];

        const result = db.exec(query, params);
        displayResults(result, '', bookId, chapter, verse);
    } catch (error) {
        console.error('Reference search error:', error);
        hideLoading();
        alert('Erro ao realizar busca. Tente novamente.');
    }
}

// Exibir resultados
function displayResults(result, highlightTerm = '', bookId = null, chapter = null, highlightVerse = null) {
    hideLoading();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!result.length || !result[0].values.length) {
        resultsDiv.innerHTML = '<div class="verse-card"><p>Nenhum resultado encontrado.</p></div>';
        return;
    }

    // Container para os versículos
    const versesContainer = document.createElement('div');
    versesContainer.className = 'verses-container';

    result[0].values.forEach(([resultBookId, resultChapter, verse, text]) => {
        const card = document.createElement('div');
        card.className = 'verse-card';
        
        // Destacar versículo selecionado
        if (highlightVerse && verse == highlightVerse) {
            card.classList.add('verse-highlighted');
        }

        const reference = `${bookNames[resultBookId]} ${resultChapter}:${verse}`;
        const highlightedText = highlightTerm ? highlightText(text, highlightTerm) : text;

        card.innerHTML = `
            <div class="verse-reference">${reference} - ${currentVersion}</div>
            <div class="verse-text">${highlightedText}</div>
            <div class="verse-actions">
                <button class="btn-generate" onclick="openImageModal('${reference}', \`${text.replace(/`/g, '\\`')}\`, '${highlightTerm}')">
                    📷 Gerar Imagem
                </button>
            </div>
        `;

        versesContainer.appendChild(card);
    });

    resultsDiv.appendChild(versesContainer);

    // Adicionar botões de navegação se for busca por referência
    if (bookId && chapter) {
        addNavigationButtons(resultsDiv, bookId, parseInt(chapter));
    }
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

    // Configurações de alta qualidade
    const scale = 2;
    const padding = 60;
    const maxWidth = 800;
    const lineHeight = 50;
    const fontSize = 32;
    const fontFamily = 'Georgia, serif';

    canvas.width = (maxWidth + (padding * 2)) * scale;
    
    ctx.scale(scale, scale);
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

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

    const textHeight = lines.length * lineHeight;
    const referenceHeight = 70;
    const totalHeight = textHeight + referenceHeight + (padding * 2) + 50;
    
    canvas.height = totalHeight * scale;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const textColor = isLightColor(bgColor) ? '#1a1a1a' : '#ffffff';
    
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    
    let y = padding;
    lines.forEach(line => {
        ctx.fillText(line, padding, y);
        y += lineHeight;
    });

    y += 25;
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(maxWidth + padding, y);
    ctx.stroke();

    y += 30;
    ctx.font = `bold 24px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.fillText(`${reference} - ${currentVersion}`, padding, y);

    const preview = document.getElementById('imagePreview');
    const img = canvas.toDataURL('image/png', 1.0);
    preview.innerHTML = `<img src="${img}" alt="Preview">`;
}

// Desenhar linha com destaque
function drawLineWithHighlight(ctx, line, x, y, highlightTerm, textColor, fontSize) {
    if (!highlightTerm) {
        ctx.fillText(line, x, y);
        return;
    }

    const regex = new RegExp(`(${escapeRegex(highlightTerm)})`, 'gi');
    const parts = line.split(regex);
    
    let currentX = x;
    parts.forEach(part => {
        if (part && part.toLowerCase() === highlightTerm.toLowerCase()) {
            const metrics = ctx.measureText(part);
            const highlightPadding = 6;
            const highlightHeight = fontSize + 8;
            
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(
                currentX - highlightPadding, 
                y - 4, 
                metrics.width + (highlightPadding * 2), 
                highlightHeight
            );
            
            ctx.fillStyle = '#000000';
            ctx.fillText(part, currentX, y);
            
            currentX += metrics.width;
            ctx.fillStyle = textColor;
        } else if (part) {
            ctx.fillText(part, currentX, y);
            currentX += ctx.measureText(part).width;
        }
    });
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
async function shareWhatsApp() {
    const { reference, text } = currentVerseData;
    
    if (navigator.share && navigator.canShare) {
        try {
            const canvas = document.getElementById('imageCanvas');
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
            
            const file = new File([blob], 'biblia-tripla.png', { type: 'image/png' });
            
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Bíblia Tripla',
                    text: `${text}\n\n${reference} - ${currentVersion}`
                });
                return;
            }
        } catch (error) {
            console.log('Compartilhamento de imagem não suportado:', error);
        }
    }
    
    const message = encodeURIComponent(`${text}\n\n${reference} - ${currentVersion}\n\n📖 Bíblia Tripla\nhttps://biblia-tripla.vercel.app`);
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

// Adicionar botões de navegação entre capítulos
function addNavigationButtons(container, bookId, chapter) {
    const navDiv = document.createElement('div');
    navDiv.className = 'chapter-navigation';

    // Verificar se existe capítulo anterior
    const hasPrevious = chapter > 1;
    
    // Verificar se existe próximo capítulo
    const query = `SELECT DISTINCT chapter FROM verses WHERE book_id = ? AND version = ? ORDER BY chapter`;
    const result = db.exec(query, [bookId, currentVersion]);
    const chapters = result[0].values.map(([ch]) => ch);
    const hasNext = chapters.includes(chapter + 1);

    if (hasPrevious) {
        const btnPrev = document.createElement('button');
        btnPrev.className = 'btn-nav btn-prev';
        btnPrev.innerHTML = '← Capítulo Anterior';
        btnPrev.onclick = () => navigateToChapter(bookId, chapter - 1);
        navDiv.appendChild(btnPrev);
    }

    if (hasNext) {
        const btnNext = document.createElement('button');
        btnNext.className = 'btn-nav btn-next';
        btnNext.innerHTML = 'Próximo Capítulo →';
        btnNext.onclick = () => navigateToChapter(bookId, chapter + 1);
        navDiv.appendChild(btnNext);
    }

    if (hasPrevious || hasNext) {
        container.appendChild(navDiv);
    }
}

// Navegar para capítulo específico
function navigateToChapter(bookId, chapter) {
    showLoading();
    
    try {
        const query = `SELECT book_id, chapter, verse, text FROM verses WHERE version = ? AND book_id = ? AND chapter = ? ORDER BY verse`;
        const result = db.exec(query, [currentVersion, bookId, chapter]);
        
        displayResults(result, '', bookId, chapter);
        
        // Scroll suave para o topo dos resultados
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error('Navigation error:', error);
        hideLoading();
        alert('Erro ao navegar. Tente novamente.');
    }
}
