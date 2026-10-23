# Clube de Campo de Brotas — apresentação interativa

Desenvolvido pela Nevuma Tech.

## Proposta comercial de 23/10/2026

Esta revisão separa o pacote web do aplicativo opcional. Os valores web foram mantidos por orientação do responsável; os prazos e a oferta mobile abaixo compõem a revisão autorizada para publicação em 23/10/2026. As condições descrevem a proposta comercial e dependem da contratação pelo clube.

| Oferta                              | Desenvolvimento / implantação | Manutenção                                     | Prazo proposto                                                 |
| ----------------------------------- | ----------------------------- | ---------------------------------------------- | -------------------------------------------------------------- |
| Site, portal, painel e portaria web | R$ 7.900                      | R$ 2.490/mês por 48 meses                      | 120 dias corridos até entrada em produção                      |
| App Android/iOS opcional            | R$ 9.900                      | R$ 490/mês adicionais após lançamento e aceite | 90 dias corridos até envio às lojas, mais análise Apple/Google |

O cronograma mobile começa após a implantação e o aceite web, contratação específica e liberação dos acessos necessários. Contratar somente o web é suficiente para usar site, portal, painel e portaria online/offline. O desenvolvimento do app, ingresso salvo no app e notificações mobile não pertencem ao pacote web. A vigência e o suporte do app serão definidos no contrato próprio.

As estimativas pressupõem escopo aprovado e disponibilização de conteúdo, dados e acessos. A cobrança web começa após implantação e aceite; a adicional mobile, após lançamento e aceite. As condições serão formalizadas em contrato. A implantação pública do app depende da aprovação das lojas e do aceite do clube.

Proposta navegável para o futuro site, portal do associado, aplicativo Android/iOS, administração de eventos e portaria com QR Code online e contingência offline.

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
9. Na aba **Segurança e 2FA**, alterne entre portal e aplicativo opcional e simule senha → código → acesso. O código fictício é `123456`; não há autenticação real.
10. Na portaria, clique em **Baixar lista do evento**, depois **Simular modo offline**. Uma leitura válida registra uma entrada pendente no aparelho; a repetição é bloqueada nessa lista. **Reconectar e sincronizar** reconcilia as entradas com a base local da demonstração e sinaliza conflitos.
11. No aplicativo, em **Ingressos**, use **Salvar para usar offline** e depois **Simular offline**. A prévia mostra o mesmo QR Code usando apenas a cópia salva. Sem cópias, mostra uma orientação para voltar ao modo online.

## Ingresso salvo pelo associado

O uso online continua sendo o padrão, tanto para o associado quanto para a portaria. O salvamento é opcional: antes de ficar sem conexão, o associado poderá salvar um ingresso liberado no aplicativo e abrir o mesmo QR Code depois. A portaria poderá validar esse código online; se a própria portaria estiver offline, precisará ter preparado sua lista antes. Mostrar uma cópia não registra entrada nem garante autorização. Cancelamentos e alterações posteriores ao salvamento só serão conhecidos após atualização dos dados consultados.

A prévia guarda as cópias fictícias em `ccb-member-tickets-demo-v1`, no `localStorage`. O modo **Simular offline** consulta somente essas cópias, sem buscar ingressos novos na base da demonstração; a atualização da página recupera as cópias e volta ao modo online. Uma cópia existente pode ser atualizada enquanto o ingresso estiver liberado. Falhas no armazenamento são mostradas ao usuário. A prévia não faz instalação nem cache completo da página para iniciar sem rede; o aplicativo final terá armazenamento protegido e recursos disponíveis no aparelho. As cópias da apresentação não são credenciais reais e não usam criptografia.

## Portaria offline

O produto proposto permitirá que um funcionário autenticado prepare o aparelho e baixe a lista atualizada antes do evento, leia ingressos sem internet e sincronize depois. No uso de vários aparelhos desconectados, o plano operacional deve usar listas exclusivas por portaria/aparelho; como alternativa de contingência, usar um único aparelho offline. Sem comunicação, o bloqueio de duplicidade é local: conflitos entre aparelhos ou cancelamentos posteriores ao download só são detectados na reconciliação e não desfazem uma entrada já ocorrida.

A prévia usa a chave `ccb-offline-gate-demo-v1` no `localStorage`, somente com dados fictícios, sem criptografia nem credenciais reais. A fila sobrevive à atualização da página enquanto o armazenamento do navegador estiver disponível; um novo download é bloqueado se houver entradas pendentes. O botão **Reiniciar** apaga a lista e as leituras fictícias. A sincronização é local, idempotente por registro e não usa um servidor.

Esta apresentação não é um aplicativo instalado ou uma PWA para iniciar sem rede. O botão offline simula a indisponibilidade da conexão na lógica de validação; não desliga a internet do aparelho. O produto final requer leitor e recursos disponíveis no dispositivo, lista e credenciais autorizadas com validade limitada, verificação de integridade/assinatura, armazenamento protegido, regras de divisão de ingressos e sincronização com auditoria e tratamento de conflitos. Deve ser homologado em evento piloto com conectividade interrompida e vários aparelhos.

## Investimento e segurança

Condições da proposta em 23/10/2026: o pacote web mantém implantação de R$7.900 e mensalidade de R$2.490 por 48 meses. Contempla portaria pelo celular com QR Code online e contingência offline. Hospedagem, banco, backups, segurança, manutenção e até quatro horas mensais de atendimento em horário comercial permanecem incluídos. O app Android/iOS, com ingresso salvo e notificações, é opcional e tem a proposta separada descrita no início deste README.

O domínio, tarifas bancárias, contas Apple/Google, celulares e internet da portaria ficam por conta do clube. Serviços e funcionalidades adicionais terão orçamento separado. Integração financeira, exportação cadastral, escopo, cronograma e condições contratuais devem ser confirmados antes do fechamento. A apresentação e os dados usados pelo frontend contêm apenas a proposta comercial, sem composição de custos operacionais.

O demonstrador de dois fatores é local e ilustrativo. Não usa segredos TOTP, credenciais, sessão autenticada ou armazenamento de códigos. Criptografia em repouso, MFA real, validação centralizada de ingressos e recuperação de contas são requisitos do produto futuro, não funcionalidades implementadas nesta apresentação.

As alterações ficam no `localStorage` do navegador. Para reiniciar os dados, remova a chave `ccb-presentation-demo-v1` nas ferramentas do navegador. O botão **Reiniciar** da portaria limpa apenas as leituras da demonstração.

## Limites desta apresentação

- Sem backend, autenticação real, cobrança bancária, emissão de boletos válidos ou controle de entrada real.
- Os QR são funcionais como exemplos de identificação, mas não são credenciais de segurança para produção.
- A atualização entre abas do mesmo navegador é uma conveniência local. Dispositivos independentes não compartilham os dados.
- O produto final necessita validação centralizada quando online, registro local autorizado quando offline, sincronização idempotente, permissões por funcionário, auditoria e integrações contratadas.
- Pagamentos, exportação cadastral, regras de convidados e equipamentos existentes dependem de levantamento e homologação.
- Leitura pela câmera depende de HTTPS ou localhost, autorização e compatibilidade do dispositivo.

## Organização

- `src/sections/`: seções da apresentação.
- `src/components/`: prévias e componentes reutilizáveis.
- `src/lib/`: estado e regras da demonstração.
- `tests/`: testes de eventos, ingressos, pagamentos, restauração, condições comerciais, cópias do associado e lista offline da portaria com sincronização e conflitos.
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
