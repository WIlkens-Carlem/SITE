# Nosso Álbum Digital

## Como compartilhar o site

Para criar um link de acesso ao site e compartilhá-lo com outras pessoas, você pode usar o GitHub Pages, que é um serviço gratuito de hospedagem para sites estáticos.

### Passo a passo para hospedar no GitHub Pages

1. **Crie uma conta no GitHub**
   - Acesse [github.com](https://github.com) e crie uma conta gratuita se ainda não tiver uma

2. **Instale o Git**
   - Baixe e instale o Git em seu computador: [git-scm.com/downloads](https://git-scm.com/downloads)

3. **Crie um novo repositório no GitHub**
   - Após fazer login no GitHub, clique no botão "+" no canto superior direito e selecione "New repository"
   - Dê um nome ao repositório (por exemplo, "nosso-album-digital")
   - Deixe o repositório como público
   - Clique em "Create repository"

4. **Envie os arquivos do site para o GitHub**
   - Abra o prompt de comando (CMD) no Windows
   - Navegue até a pasta do seu projeto:
     ```
     cd "c:\Users\Administrador\Documents\SITE"
     ```
   - Inicialize um repositório Git local:
     ```
     git init
     git add .
     git commit -m "Versão inicial do nosso álbum digital"
     ```
   - Conecte seu repositório local ao GitHub (substitua "SEU-USUARIO" pelo seu nome de usuário do GitHub):
     ```
     git remote add origin https://github.com/SEU-USUARIO/nosso-album-digital.git
     git branch -M main
     git push -u origin main
     ```

5. **Ative o GitHub Pages**
   - No GitHub, vá até o repositório que você acabou de criar
   - Clique na aba "Settings" (Configurações)
   - Role para baixo até encontrar a seção "GitHub Pages"
   - Em "Source", selecione "main" como branch e clique em "Save"
   - Aguarde alguns minutos para que o site seja publicado

6. **Acesse e compartilhe o link**
   - Após a publicação, o GitHub fornecerá um link (geralmente no formato https://SEU-USUARIO.github.io/nosso-album-digital/)
   - Este é o link que você pode compartilhar para que outras pessoas acessem o site

### Observações importantes

- O site hospedado no GitHub Pages é público, ou seja, qualquer pessoa com o link pode acessá-lo
- As imagens e vídeos que você adicionar ao álbum ficarão armazenados no navegador de quem acessar o site (localStorage)
- Para atualizar o site após fazer alterações locais, você precisará enviar as mudanças para o GitHub novamente usando os comandos:
  ```
  git add .
  git commit -m "Descrição das alterações"
  git push
  ```

### Alternativas ao GitHub Pages

Se preferir outras opções de hospedagem gratuita, você também pode usar:

- **Netlify**: [netlify.com](https://www.netlify.com)
- **Vercel**: [vercel.com](https://vercel.com)

Ambos oferecem hospedagem gratuita para sites estáticos e possuem processos de publicação similares ao GitHub Pages.