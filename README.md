# 📖 Bíblia Tripla

Web app moderno para leitura e busca da Bíblia Sagrada em 3 versões: NVI, ACF e AA.

## 🚀 Funcionalidades

- ✅ **3 Versões da Bíblia**: NVI, ACF e AA
- 🔍 **Busca por Palavra/Frase**: Encontre versículos específicos
- 📚 **Navegação por Livro/Capítulo/Versículo**: Acesso direto
- 🖍️ **Destaque Amarelo**: Palavras buscadas destacadas como marca-texto
- 📷 **Geração de PNG**: Crie imagens personalizadas dos versículos
- 🎨 **Cores Personalizáveis**: Escolha a cor de fundo da imagem
- 📱 **Compartilhamento**: WhatsApp, download ou copiar para área de transferência
- ⚡ **Performance**: SQLite em memória para buscas rápidas
- 📱 **Responsivo**: Funciona perfeitamente em mobile e desktop

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Banco de Dados**: SQLite (sql.js)
- **Deploy**: Vercel
- **Geração de Imagens**: Canvas API

## 📦 Estrutura do Projeto

```
biblia-web-2/
├── index.html          # Estrutura HTML
├── styles.css          # Estilos responsivos
├── app.js              # Lógica JavaScript
├── vercel.json         # Configuração Vercel
├── bible_unified.db    # Banco SQLite unificado
└── README.md           # Documentação
```

## 🚀 Deploy na Vercel

### Opção 1: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
cd biblia-web-2
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
2. Arraste a pasta `biblia-web-2` para a área de upload
3. Deploy instantâneo!

## 💡 Como Usar

### Busca por Palavra/Frase
1. Selecione a versão da Bíblia (NVI, ACF ou AA)
2. Digite uma palavra ou frase na aba "Palavra/Frase"
3. Clique em "Buscar"
4. Palavras encontradas serão destacadas em amarelo

### Busca por Referência
1. Selecione a versão da Bíblia
2. Vá para a aba "Livro/Capítulo/Versículo"
3. Escolha o livro, capítulo e versículo (opcional)
4. Clique em "Buscar"

### Gerar Imagem
1. Após encontrar um versículo, clique em "📷 Gerar Imagem"
2. Escolha a cor de fundo desejada
3. Opções disponíveis:
   - **Baixar PNG**: Download direto
   - **Copiar Imagem**: Cola em qualquer aplicativo
   - **Compartilhar WhatsApp**: Envia o texto via WhatsApp

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

O arquivo `bible_unified.db` contém:

**Tabela: verses**
- `id`: Identificador único
- `version`: Versão (nvi, acf, aa)
- `testament`: Testamento (1=Velho, 2=Novo)
- `book`: ID do livro (1-66)
- `chapter`: Número do capítulo
- `verse`: Número do versículo
- `text`: Texto do versículo

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
  - ES6+
  - Canvas API
  - Clipboard API
  - Fetch API
  - WebAssembly (para sql.js)

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
