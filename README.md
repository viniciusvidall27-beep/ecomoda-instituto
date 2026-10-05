# ecomoda-instituto

Loja virtual com rastreabilidade de impacto para o **Instituto EcoModa Sustentável**.
Projeto da disciplina Design Profissional (Estudo de Caso 4), Universidade Positivo.

## 1. Briefing do problema

O Instituto EcoModa é uma ONG e marca autoral de moda sustentável (upcycling) coordenada por Sofia Andrade. Emprega mulheres em situação de vulnerabilidade social (10 artesãs e 2 assistentes administrativas) e vende em feiras, eventos e em um show-room.

**Dor:** a produção cresceu e a ONG precisa vender para o Brasil todo, mas as vendas por Instagram e mensagens privadas não escalam. A equipe perde horas respondendo se a peça única ainda existe, calculando frete na mão e enviando dados de PIX, e muitos compradores desistem no meio da conversa.

**Oportunidade:** grandes marcas fazem greenwashing. A EcoModa pode mostrar o que elas não mostram: qual artesã fez a peça e qual foi o impacto ecológico daquela compra.

## 2. Solução e justificativa

**Escolha: site com vitrine e sacola (web app estático).**

- **Por que não um aplicativo móvel:** exigiria instalação, loja de apps e manutenção por plataforma. Quem compra de uma ONG chega por link no Instagram, então precisa abrir e comprar em segundos.
- **Por que não um sistema/dashboard:** resolveria o problema interno, mas não o de alcance nacional. Pode ser uma segunda fase.
- **Por que um site:** abre por link, funciona no celular, é indexável no Google e pode ser publicado de graça no GitHub Pages, o que importa para uma ONG com orçamento limitado.

Como cada dor foi resolvida:

| Dor | Solução no site |
| --- | --- |
| Perguntas sobre disponibilidade | Catálogo público de peças únicas; peça na sacola fica marcada e não pode ser adicionada duas vezes |
| Frete calculado manualmente | Cálculo automático por CEP (frete grátis acima de R$ 400) |
| Envio de dados de PIX no chat | Pagamento por PIX com código copia e cola gerado na sacola |
| Desistência no meio da conversa | Compra sem conversa: escolher, informar CEP, pagar |
| Greenwashing / diferencial | Página de cada peça com artesã, horas de trabalho, tecido reaproveitado, água poupada e CO₂ evitado; totais de impacto no topo |

## 3. Protótipo / telas

```
+--------------------------------------------------+
| EcoModa              Coleção  Impacto  Sacola(2) |
+--------------------------------------------------+
| Quem costurou a sua roupa tem nome.             |
| [Ver peças disponíveis]                          |
+--------------------------------------------------+
| As 4 peças reaproveitaram 4 kg de tecido ...    |
+--------------------------------------------------+
| Coleção            [Todas] [Roupas] [Acessórios] |
| +--------+ +--------+ +--------+ +--------+      |
| | foto   | | foto   | | foto   | | foto   |      |
| | nome   | | nome   | | nome   | | nome   |      |
| | artesã | | artesã | | artesã | | artesã |      |
| | R$     | | R$     | | R$     | | R$     |      |
| |[história][+]|                                  |
+--------------------------------------------------+
```

Telas implementadas: vitrine com filtro, modal "Ver história" (rastreabilidade da peça) e gaveta da sacola (CEP, frete, total, impacto da compra e PIX).

> Adicione aqui os prints do site rodando (pasta `docs/`).

Observação: as fotos em `img/` são ilustrativas, de outros vendedores, usadas só para este projeto acadêmico. Em uso real, devem ser trocadas por fotos das peças da ONG.

## 4. Arquitetura

Site estático, sem backend e sem build.

```
index.html        estrutura da página
css/style.css     visual (tema claro/escuro, responsivo)
img/              fotos das peças (ilustrativas)
js/products.js    dados das peças e artesãs (fictícios)
js/app.js         vitrine, filtro, sacola (localStorage), frete por CEP, PIX
```

- HTML, CSS e JavaScript puros, sem dependências.
- A sacola é guardada no navegador (`localStorage`).
- Frete e código PIX são **simulados** nesta versão.

**Evolução para produção:** trocar `products.js` por uma API ou planilha que as assistentes administrativas possam editar; calcular frete via API dos Correios; gerar o PIX e confirmar o pagamento por um backend integrado a um provedor de pagamento, com chaves guardadas em variáveis de ambiente (nunca no repositório).

## 5. Como executar

Não precisa instalar nada.

1. Clone o repositório: `git clone <url-do-repositorio>`
2. Abra o arquivo `index.html` no navegador.

Opcional, com servidor local: `python3 -m http.server 8000` e acesse `http://localhost:8000`.

## 6. Publicação (GitHub Pages)

No GitHub: **Settings > Pages > Deploy from a branch > main / (root)**. O site fica em `https://<usuario>.github.io/ecomoda-instituto/`.

## 7. Segurança

Nenhuma credencial, token ou chave de API está no código ou no histórico. O `.gitignore` bloqueia `.env`, chaves e `node_modules`. O código PIX gerado é apenas demonstração.

## 8. Licença

MIT. Veja o arquivo [LICENSE](LICENSE).
