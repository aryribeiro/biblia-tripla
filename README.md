<img width="1125" height="568" alt="image" src="https://github.com/user-attachments/assets/45eb9706-0ff8-4a63-866c-289e63e34f17" />

Web app moderno para leitura e busca na Bíblia Sagrada em 3 versões: NVI, ACF e AA.

## 🚀 Funcionalidades

### 🔍 Busca Avançada
- ✅ **Busca por Palavra/Frase**: Encontre versículos específicos com destaque amarelo
- ✅ **Busca Direta**: Navegue por Livro → Capítulo → Versículo
- ✅ **Capítulo Completo**: Sempre exibe o capítulo inteiro na busca direta
- ✅ **Destaque de Versículo**: Versículo selecionado aparece destacado em azul

### 📚 Navegação Inteligente
- ⬅️ **Botão Voltar**: Navega para o capítulo anterior (canto inferior esquerdo)
- ➡️ **Botão Avançar**: Navega para o próximo capítulo (canto inferior direito)
- 🔄 **Troca de Versão**: Reseta automaticamente as seleções ao mudar de versão
- 📜 **3 Versões**: NVI, ACF e AA disponíveis

### 📸 Geração de Imagens (Alta Qualidade)
- 🎨 **6 Cores de Fundo**: Branco, Preto, Azul, Roxo, Verde, Vermelho
- 📷 **Resolução 2x**: Imagens em alta qualidade para compartilhamento
- ✍️ **Fonte Elegante**: Georgia com espaçamento otimizado
- 📊 **Layout Profissional**: Linha separadora e referência completa

### 📤 Compartilhamento
- 📱 **WhatsApp**: Compartilha texto formatado com link do app
- 💾 **Download PNG**: Salva imagem em alta resolução
- 📋 **Copiar Imagem**: Cola diretamente em qualquer aplicativo

### ⚡ Performance
- 💾 **SQLite em Memória**: Banco de 23MB carregado para buscas instantâneas
- 🔍 **93.315 versículos**: Acesso rápido a todo conteúdo bíblico
- 📱 **Responsivo**: Design mobile-first, funciona perfeitamente em todos os dispositivos

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Banco de Dados**: SQLite (sql.js)
- **Deploy**: Vercel
- **Geração de Imagens**: Canvas API

## 📦 Estrutura do Projeto

```
biblia-tripla/
├── index.html          # Estrutura HTML com tabs e modal
├── styles.css          # Design responsivo e moderno
├── app.js              # Lógica completa (busca, navegação, geração de imagem)
├── vercel.json         # Configuração otimizada para Vercel
├── bible_unified.db    # Banco SQLite unificado (23MB, 93.315 versículos)
├── .gitignore          # Arquivos ignorados
├── .vercelignore       # Arquivos excluídos do deploy
└── README.md           # Documentação completa
```

## 🚀 Deploy na Vercel

### Opção 1: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
cd biblia-tripla
vercel --prod
```

### Opção 2: Via GitHub

1. Crie um repositório no GitHub
2. Faça push do projeto:
```bash
git init
git add .
git commit -m "Initial commit - Bíblia Tripla"
git branch -M main
git remote add origin https://github.com/seu-usuario/biblia-tripla.git
git push -u origin main
```
3. Acesse [vercel.com](https://vercel.com)
4. Clique em "Import Project"
5. Selecione seu repositório
6. Deploy automático!

### Opção 3: Via Interface Web

1. Acesse [vercel.com](https://vercel.com)
2. Arraste a pasta `biblia-tripla` para a área de upload
3. Deploy instantâneo!

## 💡 Como Usar

### 🔍 Busca por Palavra/Frase
1. Selecione a versão da Bíblia (NVI, ACF ou AA)
2. Digite uma palavra ou frase na aba "Palavra/Frase"
3. Clique em "Buscar"
4. Palavras encontradas serão destacadas em amarelo nos resultados
5. Limite de 100 resultados por busca

### 📚 Busca Direta (Livro/Capítulo/Versículo)
1. Selecione a versão da Bíblia
2. Vá para a aba "Livro/Capítulo/Versículo"
3. Escolha o livro (66 livros disponíveis)
4. Escolha o capítulo
5. (Opcional) Escolha um versículo específico
6. Clique em "Buscar"
7. **O capítulo inteiro será exibido** (versículo selecionado destacado em azul)
8. Use os botões "← Capítulo Anterior" e "Próximo Capítulo →" para navegar

### 📸 Gerar Imagem de Versículo
1. Após encontrar um versículo, clique em "📷 Gerar Imagem"
2. Escolha a cor de fundo desejada (6 opções)
3. Visualize o preview da imagem
4. Opções disponíveis:
   - **Baixar PNG**: Download em alta resolução (2x)
   - **Copiar Imagem**: Cola em qualquer aplicativo
   - **Compartilhar WhatsApp**: Envia texto formatado com link

### 🔄 Trocar Versão da Bíblia
- Ao trocar de versão, todas as seleções são resetadas automaticamente
- Resultados anteriores são limpos
- Faça uma nova busca com a versão selecionada

## 🎨 Personalização

### Adicionar Novas Cores de Fundo

Edite o arquivo `index.html` na seção de cores:

```html
<button class="color-btn" data-color="#SUA_COR" style="background: #SUA_COR;">Nome</button>
```

### Modificar Estilo do Destaque

Edite o arquivo `styles.css`:

```css
.highlight {
    background: #FFFF00; /* Altere a cor aqui */
    padding: 2px 4px;
    border-radius: 3px;
}
```

## 📊 Estrutura do Banco de Dados

O arquivo `bible_unified.db` (23MB) contém:

**Tabela: verses** (93.315 registros)
- `id`: Identificador único (INTEGER PRIMARY KEY)
- `version`: Versão (TEXT: 'NVI', 'ACF', 'AA')
- `book_id`: ID do livro (INTEGER: 1-66)
- `chapter`: Número do capítulo (INTEGER)
- `verse`: Número do versículo (INTEGER)
- `text`: Texto do versículo (TEXT)

**Tabelas auxiliares:**
- `testament`: Informações sobre Velho e Novo Testamento
- `books`: Nomes e metadados dos 66 livros bíblicos

## 🔧 Desenvolvimento Local

```bash
# Servir localmente (requer servidor HTTP)
npx serve .

# Ou use Python
python -m http.server 8000

# Ou use Node.js
npx http-server
```

Acesse: `http://localhost:8000`

## ⚠️ Requisitos

- Navegador moderno com suporte a:
  - ES6+ (Arrow Functions, Async/Await, Template Literals)
  - Canvas API (geração de imagens)
  - Clipboard API (copiar imagem)
  - Fetch API (carregar banco de dados)
  - WebAssembly (sql.js para SQLite no browser)
- Conexão com internet (para carregar sql.js via CDN e banco de dados)

## 🚀 Performance

- **Carregamento inicial**: ~3-5 segundos (download do banco de 23MB)
- **Buscas**: Instantâneas (SQLite em memória)
- **Geração de imagem**: < 1 segundo
- **Navegação entre capítulos**: Instantânea
- **Tamanho total do app**: ~25MB (HTML + CSS + JS + DB)

## 📚 Fonte dos Dados

Os datasets bíblicos utilizados neste projeto foram obtidos do excelente repositório:

**[Bíblia: XML + SQL + JSON](https://github.com/thiagobodruk/biblia)** por [@thiagobodruk](https://github.com/thiagobodruk)

Grande crédito e agradecimento ao Thiago Bodruk por disponibilizar esses dados de forma aberta e acessível.

## 📝 Licença

Este projeto é distribuído sob a licença Creative Commons BY-NC. As traduções bíblicas são de autoria e propriedade intelectual de:
- **NVI**: Sociedade Bíblica Internacional
- **ACF**: Sociedade Bíblica Trinitariana
- **AA**: Imprensa Bíblica Brasileira

Todos os direitos das traduções pertencem aos respectivos autores.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Melhorar a documentação
- Otimizar o código

## 👨‍💻 Desenvolvedor

**Ary Ribeiro**
- 📧 Email: [aryribeiro@gmail.com](mailto:aryribeiro@gmail.com)
- 💼 LinkedIn: [@aryribeiro](https://linkedin.com/in/aryribeiro)
- 🐙 GitHub: [@aryribeiro](https://github.com/aryribeiro)

---

**Desenvolvido com ❤️ para democratizar o acesso à Palavra de Deus.**

**🌟 Se este projeto foi útil, considere dar uma estrela no GitHub!**
