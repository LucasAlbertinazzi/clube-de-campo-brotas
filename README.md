# Clube de Campo de Brotas — apresentação interativa

Proposta navegável para o futuro site, portal do associado, aplicativo Android/iOS, administração de eventos e portaria com QR Code.

**Apresentação:** https://lucasalbertinazzi.github.io/clube-de-campo-brotas/

Esta é uma demonstração independente, com dados inteiramente fictícios. Não é o portal oficial do clube, não acessa os sistemas existentes e não efetua pagamentos ou envia mensagens.

## Executar

Requisitos: Node.js 24 e pnpm 11.25.0.

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

## Explorar os fluxos

1. Em **Experiências**, alterne entre site, associado e administração.
2. No site, abra **Eventos** e emita um ingresso para um integrante da família fictícia.
3. Consulte o ingresso na área do associado ou no aplicativo.
4. Na administração ou no formulário de eventos, publique um novo evento. Ele aparece na agenda da demonstração.
5. Na portaria, selecione o evento e simule um QR válido, repetido ou inválido. Também é possível digitar o identificador do ingresso.
6. **Ativar câmera** solicita autorização do dispositivo e lê os QR demonstrativos com a câmera traseira, quando disponível. O vídeo é processado localmente e os recursos da câmera são encerrados ao parar, sair da tela ou concluir a leitura.
7. Experimente pagamentos simulados, alteração de nomes fictícios, publicações e atendimento.
8. No menu **Investimento**, consulte implantação de R$7.900, mensalidade de R$2.490 por 48 meses, serviços incluídos e despesas separadas.
9. Na aba **Segurança e 2FA**, alterne entre portal e aplicativo e simule senha → código → acesso. O código fictício é `123456`; não há autenticação real.

## Investimento e segurança

Condições comerciais de referência em 21/10/2026: implantação de R$7.900 e mensalidade de R$2.490 por 48 meses. A mensalidade contempla hospedagem, banco de dados, backups, segurança, manutenção e até quatro horas mensais de atendimento em horário comercial.

O domínio, tarifas bancárias, contas Apple/Google, celulares e internet da portaria ficam por conta do clube. Serviços e funcionalidades adicionais terão orçamento separado. Integração financeira, exportação cadastral, escopo, cronograma e condições contratuais devem ser confirmados antes do fechamento. A apresentação e os dados usados pelo frontend contêm apenas a proposta comercial, sem composição de custos operacionais.

O demonstrador de dois fatores é local e ilustrativo. Não usa segredos TOTP, credenciais, sessão autenticada ou armazenamento de códigos. Criptografia em repouso, MFA real, validação centralizada de ingressos e recuperação de contas são requisitos do produto futuro, não funcionalidades implementadas nesta apresentação.

As alterações ficam no `localStorage` do navegador. Para reiniciar os dados, remova a chave `ccb-presentation-demo-v1` nas ferramentas do navegador. O botão **Reiniciar** da portaria limpa apenas as leituras da demonstração.

## Limites desta apresentação

- Sem backend, autenticação real, cobrança bancária, emissão de boletos válidos ou controle de entrada real.
- Os QR são funcionais como exemplos de identificação, mas não são credenciais de segurança para produção.
- A atualização entre abas do mesmo navegador é uma conveniência local. Dispositivos independentes não compartilham os dados.
- O produto final necessita validação de ingressos no servidor, operação atômica de check-in, permissões por funcionário, auditoria e integrações contratadas.
- Pagamentos, exportação cadastral, regras de convidados e equipamentos existentes dependem de levantamento e homologação.
- Leitura pela câmera depende de HTTPS ou localhost, autorização e compatibilidade do dispositivo.

## Organização

- `src/sections/`: seções da apresentação.
- `src/components/`: prévias e componentes reutilizáveis.
- `src/lib/`: estado e regras da demonstração.
- `tests/`: testes de eventos, ingressos, pagamentos, restauração do estado e condições comerciais publicadas.
- `public/assets/`: identidade e fotos do site público atual.
- `.github/workflows/pages.yml`: testes, build e publicação no GitHub Pages.

## Referências e identidade

- Site institucional: https://www.clubedecampodebrotas.com.br/
- Portal existente: https://portal.multiclubes.com.br/clubedecampodebrotas/login.aspx
- Referência de apresentação: https://make-store-gestao.lucasalbertinazzi.chatgpt.site/apresentacao/
- Logo original branca: https://www.clubedecampodebrotas.com.br/wp-content/uploads/2025/04/Logo-clube-branco-1.png
- Ícone original: https://www.clubedecampodebrotas.com.br/wp-content/uploads/2025/04/Logo-clube-azul-e-branco-1.png
- Foto do lago: https://www.clubedecampodebrotas.com.br/wp-content/uploads/2014/11/PANO_20190724_155917.jpeg
- Foto do pergolado: https://www.clubedecampodebrotas.com.br/wp-content/uploads/2014/11/PANO_20190724_161345.jpeg

As marcas e fotografias permanecem pertencentes aos seus respectivos titulares. Os prints privados enviados na conversa não fazem parte deste repositório.
