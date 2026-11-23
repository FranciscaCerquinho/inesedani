# Site de casamento · Inês & Dani

Site estático de uma página (HTML + CSS + JS simples), pensado para a **Netlify** com **Netlify Forms**.

```
index.html      página principal
obrigado.html   página de agradecimento depois de submeter
css/style.css   estilos
js/main.js      menu, campos condicionais do RSVP, copiar IBAN
img/            favicon e imagens
netlify.toml    configuração da Netlify
```

## Ver o site localmente

```bash
python3 -m http.server 8000      # depois abre http://localhost:8000
# ou, para testar também os formulários da Netlify:
npx netlify-cli dev
```

Abre sempre através de um servidor local (não faças duplo clique no `index.html`), porque os caminhos são absolutos (`/css/style.css`).

## Deploy (GitHub → Netlify)

1. Cria um repositório no GitHub e envia o código (`git add . && git commit -m "site" && git push`).
2. Na Netlify: **Add new site → Import an existing project → GitHub** e escolhe o repositório.
3. Não precisas de comando de build; a pasta de publicação é a raiz (`.`), já definida no `netlify.toml`.
4. A cada `git push` a Netlify faz deploy automático.
5. Em **Site configuration → Forms**, confirma que os formulários `confirmacoes` e `mensagens para os novos` foram detetados após o primeiro deploy.

## Domínio próprio

Netlify → **Domain management → Add a domain** → introduz o domínio. Depois:
- ou usas os nameservers da Netlify (mais simples), ou
- crias no teu registador um registo `CNAME` (subdomínio, ex.: `www`) para `o-teu-site.netlify.app`, ou um registo `A` para o IP indicado pela Netlify.

O HTTPS (Let's Encrypt) é ativado automaticamente. Depois troca `O-VOSSO-DOMINIO.pt` nas meta tags `og:` do `index.html`.

## Respostas dos formulários

- Netlify → o teu site → **Forms** → escolhe o formulário → vês cada submissão.
- **Export to CSV** (botão no topo da lista) e abre no Excel. As colunas são: `nome`, `presenca`, `num_pessoas`, `alergias`, `observacoes` (RSVP) e `nome`, `mensagem` (mensagens).

## Notificações por email

Netlify → **Site configuration → Notifications → Form submission notifications → Add notification → Email notification**. Escolhe o formulário (ou "Any form") e o email. Podes adicionar vários destinatários.

## Placeholders a trocar

| O quê | Onde (procura o comentário `TROCAR` / o texto) |
|---|---|
| IBAN | `index.html`, `id="iban"` (o botão copia este texto sem espaços) |
| Data limite do RSVP | `index.html`, `[DATA LIMITE]` |
| Link Maps da igreja | `index.html`, secção hero (`href` da Igreja Paroquial de Cambra) |
| Link Maps da Eira dos Aidos | `index.html`, secção hero |
| Domínio na pré-visualização | `index.html`, meta tags `og:image` e `og:url` |
| Imagem de pré-visualização (já está) | `img/og.jpg` (1200×630). O WhatsApp só a mostra se o `og:image` apontar para o domínio real |
| Ilustração do casal (já está) | `img/casal.svg` (vetorial, nítida em qualquer tamanho; fundo transparente). Para trocar, substitui o ficheiro |

## Notas

- O site tem `noindex, nofollow` (meta tag e cabeçalho `X-Robots-Tag`) para não aparecer no Google.
- Os campos "Sim" do RSVP existem sempre no HTML (a Netlify precisa deles); o JS só os esconde quando não é "Sim". Sem JS aparecem sempre.
- Se alterares o nome de um formulário ou campo, faz novo deploy para a Netlify o voltar a detetar.
