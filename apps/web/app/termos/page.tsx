import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — PapoAuto",
  description:
    "Termos de Uso da comunidade PapoAuto: regras de cadastro, conteúdo, avaliações, moderação, privacidade e uso da plataforma.",
};

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

type Section = {
  title: string;
  blocks: Block[];
};

const intro: string[] = [
  "Bem-vindo ao PapoAuto.",
  "Estes Termos de Uso regulam o acesso e a utilização da plataforma PapoAuto, uma comunidade online criada para reunir avaliações, experiências, opiniões, dúvidas e discussões sobre veículos, especialmente carros, versões, anos, motores, câmbios, manutenção, consumo, custos de uso, confiabilidade e experiência de posse.",
  "Ao criar uma conta, acessar, publicar conteúdo, comentar, votar, avaliar ou utilizar qualquer funcionalidade da plataforma, você declara que leu, compreendeu e concorda com estes Termos de Uso.",
  "Caso você não concorde com estes termos, não utilize a plataforma.",
];

const sections: Section[] = [
  {
    title: "1. Objetivo da plataforma",
    blocks: [
      {
        type: "p",
        text: "O PapoAuto tem como objetivo construir uma comunidade colaborativa, útil e confiável para pessoas interessadas em veículos.",
      },
      {
        type: "p",
        text: "A plataforma permite que usuários publiquem avaliações, relatos de experiência, dúvidas, comentários e discussões sobre carros, com o objetivo de ajudar outras pessoas a tomar decisões mais informadas sobre compra, venda, manutenção, uso diário e comparação entre veículos.",
      },
      {
        type: "p",
        text: "Valorizamos conteúdos honestos, respeitosos, úteis e baseados em experiências reais, dados verificáveis ou opiniões claramente identificadas como opinião pessoal.",
      },
    ],
  },
  {
    title: "2. Cadastro e conta do usuário",
    blocks: [
      {
        type: "p",
        text: "Para utilizar determinadas funcionalidades da plataforma, como publicar avaliações, comentar, votar ou interagir com outros usuários, poderá ser necessário criar uma conta.",
      },
      {
        type: "p",
        text: "Ao se cadastrar, o usuário se compromete a fornecer informações verdadeiras, atualizadas e suficientes para o funcionamento da plataforma.",
      },
      {
        type: "p",
        text: "O usuário é responsável por manter a segurança de sua conta, incluindo seus dados de acesso, senha, sessões autenticadas e qualquer atividade realizada por meio de sua conta.",
      },
      {
        type: "p",
        text: "É proibido criar contas falsas, usar identidade de terceiros, tentar se passar por outra pessoa ou utilizar múltiplas contas para manipular avaliações, votos, comentários, reputação ou qualquer funcionalidade da plataforma.",
      },
      {
        type: "p",
        text: "A plataforma poderá suspender, restringir ou encerrar contas que violem estes Termos de Uso ou que apresentem comportamento suspeito, abusivo, fraudulento ou prejudicial à comunidade.",
      },
    ],
  },
  {
    title: "3. Conteúdo publicado pelos usuários",
    blocks: [
      {
        type: "p",
        text: "O usuário é o único responsável pelo conteúdo que publica na plataforma, incluindo avaliações, comentários, respostas, textos, imagens, links, notas, votos, dados informados e qualquer outra forma de contribuição.",
      },
      { type: "p", text: "Ao publicar conteúdo, o usuário declara que:" },
      {
        type: "ul",
        items: [
          "possui direito de publicar aquele conteúdo;",
          "não está violando direitos de terceiros;",
          "não está publicando informações falsas de forma intencional;",
          "não está usando a plataforma para enganar, manipular ou prejudicar outros usuários;",
          "está ciente de que seu conteúdo poderá ficar visível publicamente.",
        ],
      },
      {
        type: "p",
        text: "A plataforma não endossa automaticamente o conteúdo publicado pelos usuários e não garante que todas as informações publicadas sejam corretas, completas, atuais ou adequadas para todos os contextos.",
      },
    ],
  },
  {
    title: "4. Avaliações, notas e relatos de experiência",
    blocks: [
      {
        type: "p",
        text: "As avaliações publicadas na plataforma devem refletir experiências reais, opiniões honestas ou análises feitas de boa-fé pelo usuário.",
      },
      {
        type: "p",
        text: "Ao publicar uma avaliação, o usuário deve buscar apresentar informações úteis, como pontos positivos, pontos negativos, tempo de uso, quilometragem, versão do veículo, ano, custos, consumo, manutenção, confiabilidade e contexto da experiência relatada.",
      },
      {
        type: "p",
        text: "O usuário deve evitar apresentar opiniões pessoais como fatos absolutos quando não houver evidência, vivência direta ou fonte confiável que sustente a afirmação.",
      },
      {
        type: "p",
        text: "Caso o usuário publique uma avaliação baseada em experiência de terceiros, isso deve ser informado de forma clara.",
      },
      {
        type: "p",
        text: "É proibido publicar avaliações falsas, compradas, manipuladas, automatizadas, ofensivas ou criadas com o objetivo de prejudicar ou favorecer artificialmente um veículo, marca, concessionária, oficina, vendedor, empresa ou outro usuário.",
      },
      {
        type: "p",
        text: "Caso o usuário tenha recebido pagamento, desconto, patrocínio, comissão, permuta, benefício, produto, serviço ou qualquer vantagem relacionada ao conteúdo publicado, essa relação deverá ser informada de forma clara na própria publicação.",
      },
    ],
  },
  {
    title: "5. Condutas proibidas",
    blocks: [
      {
        type: "p",
        text: "Ao utilizar a plataforma, o usuário se compromete a não praticar as seguintes condutas:",
      },
      {
        type: "ul",
        items: [
          "publicar conteúdo falso, fraudulento, enganoso ou deliberadamente manipulado;",
          "publicar ataques pessoais, ofensas, ameaças, perseguições, intimidações ou humilhações;",
          "praticar discriminação de qualquer natureza;",
          "divulgar dados pessoais de terceiros sem autorização;",
          "publicar spam, propaganda abusiva ou conteúdo exclusivamente promocional sem valor para a comunidade;",
          "manipular votos, notas, rankings, comentários, avaliações ou reputação;",
          "criar múltiplas contas para obter vantagem indevida;",
          "usar bots, scripts ou automações não autorizadas;",
          "publicar links maliciosos, phishing, malware ou qualquer conteúdo que comprometa a segurança da plataforma ou dos usuários;",
          "copiar conteúdo de terceiros sem autorização ou sem os devidos créditos;",
          "incentivar práticas ilegais, direção perigosa, rachas, adulterações irregulares, fraudes documentais ou burla de fiscalização;",
          "usar a plataforma para golpes, vendas fraudulentas ou intermediações enganosas;",
          "publicar acusações graves contra pessoas, empresas, oficinas, concessionárias ou marcas sem evidência mínima;",
          "tentar explorar falhas técnicas, acessar áreas restritas ou obter dados indevidos da plataforma ou de outros usuários.",
        ],
      },
      {
        type: "p",
        text: "A lista acima não é exaustiva. A plataforma poderá avaliar outros comportamentos prejudiciais à comunidade, ainda que não estejam expressamente descritos nestes Termos de Uso.",
      },
    ],
  },
  {
    title: "6. Moderação",
    blocks: [
      {
        type: "p",
        text: "A plataforma poderá moderar conteúdos, contas e interações para preservar a segurança, a qualidade e a utilidade da comunidade.",
      },
      { type: "p", text: "A moderação poderá incluir, sem limitação:" },
      {
        type: "ul",
        items: [
          "remoção de conteúdo;",
          "edição de visibilidade;",
          "bloqueio de comentários;",
          "restrição de funcionalidades;",
          "redução de alcance;",
          "invalidação de votos, notas ou interações;",
          "suspensão temporária de conta;",
          "encerramento definitivo de conta;",
          "bloqueio de acesso;",
          "adoção de medidas técnicas contra abuso, spam ou fraude.",
        ],
      },
      {
        type: "p",
        text: "Sempre que possível, a plataforma poderá informar o motivo da moderação, mas não se obriga a fornecer explicações detalhadas em todos os casos, especialmente quando houver risco de abuso, fraude, segurança, violação de direitos ou prejuízo à comunidade.",
      },
      {
        type: "p",
        text: "A ausência de moderação imediata sobre determinado conteúdo não significa aprovação, concordância ou renúncia ao direito de agir posteriormente.",
      },
    ],
  },
  {
    title: "7. Votos, reputação e mecanismos de destaque",
    blocks: [
      {
        type: "p",
        text: "A plataforma poderá utilizar mecanismos de votos, notas, reputação, rankings, recomendações, filtros, ordenações ou outros critérios para organizar e destacar conteúdos.",
      },
      {
        type: "p",
        text: "Esses mecanismos existem para melhorar a experiência da comunidade e facilitar a descoberta de conteúdos úteis.",
      },
      {
        type: "p",
        text: "É proibido manipular artificialmente qualquer mecanismo de avaliação, votação, reputação, ranqueamento ou recomendação.",
      },
      {
        type: "p",
        text: "A plataforma poderá remover, reprocessar, ocultar ou invalidar interações consideradas artificiais, suspeitas, abusivas, fraudulentas ou prejudiciais ao funcionamento da comunidade.",
      },
    ],
  },
  {
    title: "8. Conteúdo comercial, publicidade e afiliados",
    blocks: [
      {
        type: "p",
        text: "A plataforma poderá exibir anúncios, links afiliados, conteúdos patrocinados, parcerias comerciais ou outras formas de monetização.",
      },
      {
        type: "p",
        text: "Quando houver relação comercial relevante da própria plataforma com determinado conteúdo, produto ou serviço, essa relação poderá ser sinalizada de forma adequada.",
      },
      {
        type: "p",
        text: "Usuários não podem utilizar a plataforma apenas como canal de venda, captação de leads, propaganda, autopromoção ou spam.",
      },
      {
        type: "p",
        text: "Conteúdos comerciais poderão ser permitidos quando agregarem informação real à comunidade, desde que sejam transparentes, relevantes e não violem estes Termos de Uso.",
      },
      {
        type: "p",
        text: "A plataforma poderá remover publicações comerciais consideradas abusivas, enganosas, repetitivas, irrelevantes ou prejudiciais à experiência dos usuários.",
      },
    ],
  },
  {
    title: "9. Propriedade intelectual",
    blocks: [
      {
        type: "p",
        text: "O usuário mantém os direitos sobre o conteúdo que publica na plataforma, desde que seja titular desses direitos ou tenha autorização para utilizá-los.",
      },
      {
        type: "p",
        text: "Ao publicar qualquer conteúdo na plataforma, o usuário concede ao PapoAuto uma licença não exclusiva, gratuita, mundial e por prazo indeterminado para armazenar, exibir, reproduzir, distribuir, adaptar tecnicamente, indexar e disponibilizar esse conteúdo dentro da plataforma e em canais relacionados à sua divulgação.",
      },
      {
        type: "p",
        text: "Essa licença é necessária para que a plataforma possa operar, exibir publicações, organizar discussões, manter histórico de comentários, gerar páginas públicas, exibir resultados de busca e permitir o funcionamento normal da comunidade.",
      },
      {
        type: "p",
        text: "O usuário não deve publicar conteúdo protegido por direitos autorais, marcas, imagens, textos, fotos, vídeos ou materiais de terceiros sem autorização adequada.",
      },
      {
        type: "p",
        text: "O nome, marca, logotipo, identidade visual, layout, código, banco de dados, design, funcionalidades e demais elementos do PapoAuto pertencem aos seus respectivos titulares e não podem ser copiados, reproduzidos ou utilizados sem autorização.",
      },
    ],
  },
  {
    title: "10. Privacidade e dados pessoais",
    blocks: [
      {
        type: "p",
        text: "A plataforma poderá coletar e tratar dados pessoais necessários para seu funcionamento, como nome, e-mail, dados de autenticação, dados técnicos, cookies essenciais, logs de acesso, conteúdos publicados e interações realizadas.",
      },
      { type: "p", text: "Esses dados poderão ser utilizados para:" },
      {
        type: "ul",
        items: [
          "permitir cadastro e autenticação;",
          "manter a segurança da conta;",
          "operar funcionalidades da plataforma;",
          "exibir conteúdos publicados;",
          "prevenir fraude, abuso e spam;",
          "realizar moderação;",
          "melhorar a experiência do usuário;",
          "cumprir obrigações legais.",
        ],
      },
      {
        type: "p",
        text: "A plataforma deverá tratar dados pessoais de acordo com a legislação aplicável, incluindo a Lei Geral de Proteção de Dados Pessoais — LGPD.",
      },
      {
        type: "p",
        text: "A plataforma não deve vender dados pessoais dos usuários.",
      },
      {
        type: "p",
        text: "Mais informações sobre coleta, uso, armazenamento e direitos dos titulares poderão ser apresentadas em uma Política de Privacidade específica.",
      },
    ],
  },
  {
    title: "11. Cookies e tecnologias semelhantes",
    blocks: [
      {
        type: "p",
        text: "A plataforma poderá utilizar cookies e tecnologias semelhantes para autenticação, segurança, funcionamento da sessão, preferências do usuário, análise de uso e melhoria da experiência.",
      },
      {
        type: "p",
        text: "Cookies essenciais poderão ser necessários para que determinadas funcionalidades funcionem corretamente.",
      },
      {
        type: "p",
        text: "Ao utilizar a plataforma, o usuário reconhece que determinadas tecnologias podem ser utilizadas para viabilizar o funcionamento adequado do serviço.",
      },
    ],
  },
  {
    title: "12. Segurança e reporte de vulnerabilidades",
    blocks: [
      {
        type: "p",
        text: "Caso o usuário encontre falhas de segurança, vulnerabilidades, exposição indevida de dados ou comportamentos técnicos inesperados, deverá comunicar a plataforma de forma responsável por meio do canal de contato indicado.",
      },
      {
        type: "p",
        text: "É proibido explorar falhas de segurança, acessar dados de terceiros, tentar invadir sistemas, contornar mecanismos de proteção ou divulgar vulnerabilidades antes de sua correção.",
      },
      {
        type: "p",
        text: "A plataforma poderá tomar medidas técnicas e administrativas para proteger seus usuários, seus dados e sua infraestrutura.",
      },
    ],
  },
  {
    title:
      "13. Isenção de responsabilidade sobre decisões de compra, venda e manutenção",
    blocks: [
      {
        type: "p",
        text: "As informações publicadas na plataforma possuem caráter informativo, opinativo e comunitário.",
      },
      {
        type: "p",
        text: "A plataforma não substitui vistoria cautelar, laudo técnico, avaliação mecânica, consulta documental, análise jurídica, avaliação financeira, orientação profissional ou qualquer outro procedimento especializado necessário antes da compra, venda, financiamento, manutenção ou modificação de um veículo.",
      },
      {
        type: "p",
        text: "Avaliações, comentários, notas, relatos de consumo, custos de manutenção, confiabilidade e problemas recorrentes podem variar conforme uso, região, conservação, histórico do veículo, versão, ano, motorização, câmbio, manutenção preventiva e diversos outros fatores.",
      },
      {
        type: "p",
        text: "O usuário é o único responsável por suas decisões de compra, venda, negociação, manutenção, financiamento, contratação de serviços ou qualquer outra ação tomada com base em informações encontradas na plataforma.",
      },
      {
        type: "p",
        text: "A plataforma não garante que as informações publicadas por usuários sejam verdadeiras, completas, atuais, verificadas ou aplicáveis a todos os casos.",
      },
    ],
  },
  {
    title: "14. Relação com marcas, fabricantes, concessionárias e terceiros",
    blocks: [
      {
        type: "p",
        text: "O PapoAuto é uma comunidade independente.",
      },
      {
        type: "p",
        text: "A menção a marcas, modelos, versões, fabricantes, concessionárias, oficinas, lojas, serviços ou produtos não implica parceria, patrocínio, autorização, recomendação ou endosso por parte dessas empresas, salvo quando isso for expressamente informado.",
      },
      {
        type: "p",
        text: "Marcas, nomes comerciais, logotipos e demais sinais distintivos pertencem aos seus respectivos titulares.",
      },
      {
        type: "p",
        text: "Conteúdos publicados por usuários representam exclusivamente a opinião ou experiência de seus autores, e não necessariamente a opinião da plataforma.",
      },
    ],
  },
  {
    title: "15. Disponibilidade e alterações do serviço",
    blocks: [
      {
        type: "p",
        text: "A plataforma poderá passar por manutenções, instabilidades, atualizações, correções, mudanças de funcionalidades, alterações de layout, migrações de dados ou interrupções temporárias.",
      },
      {
        type: "p",
        text: "O PapoAuto não garante disponibilidade contínua, funcionamento ininterrupto, ausência de erros ou preservação permanente de todas as funcionalidades.",
      },
      {
        type: "p",
        text: "Funcionalidades poderão ser criadas, alteradas, limitadas, suspensas ou removidas a qualquer momento, especialmente durante fases iniciais, testes, MVPs ou períodos de evolução do produto.",
      },
    ],
  },
  {
    title: "16. Exclusão de conta e conteúdo",
    blocks: [
      {
        type: "p",
        text: "O usuário poderá solicitar a exclusão de sua conta por meio dos canais disponibilizados pela plataforma.",
      },
      {
        type: "p",
        text: "Ao excluir uma conta, a plataforma poderá remover, desativar ou anonimizar dados pessoais associados ao usuário, respeitando obrigações legais, necessidades de segurança, prevenção a fraudes, auditoria e preservação da integridade da comunidade.",
      },
      {
        type: "p",
        text: "Conteúdos públicos, como avaliações, tópicos, comentários e respostas, poderão ser mantidos de forma anonimizada quando necessário para preservar o contexto das discussões e o histórico da comunidade.",
      },
      {
        type: "p",
        text: "A plataforma também poderá remover ou manter determinados registros técnicos pelo tempo necessário para cumprir obrigações legais, resolver disputas, prevenir abusos ou proteger seus direitos e usuários.",
      },
    ],
  },
  {
    title: "17. Encerramento ou restrição de acesso",
    blocks: [
      {
        type: "p",
        text: "A plataforma poderá restringir, suspender ou encerrar o acesso de qualquer usuário que viole estes Termos de Uso, prejudique a comunidade, comprometa a segurança do serviço ou utilize a plataforma de forma abusiva, fraudulenta ou incompatível com seu propósito.",
      },
      {
        type: "p",
        text: "O usuário também poderá deixar de utilizar a plataforma a qualquer momento.",
      },
      {
        type: "p",
        text: "O encerramento da conta não elimina responsabilidades relacionadas a atos praticados anteriormente pelo usuário.",
      },
    ],
  },
  {
    title: "18. Alterações destes Termos de Uso",
    blocks: [
      {
        type: "p",
        text: "Estes Termos de Uso poderão ser alterados a qualquer momento para refletir mudanças na plataforma, na legislação, em requisitos de segurança, em práticas de moderação ou em regras da comunidade.",
      },
      {
        type: "p",
        text: "Quando houver alterações relevantes, a plataforma poderá comunicar os usuários por meio do próprio site, e-mail ou outro canal adequado.",
      },
      {
        type: "p",
        text: "A data da última atualização será indicada no início deste documento.",
      },
      {
        type: "p",
        text: "O uso contínuo da plataforma após a publicação de alterações representa a aceitação dos novos termos.",
      },
    ],
  },
  {
    title: "19. Contato",
    blocks: [
      {
        type: "p",
        text: "Em caso de dúvidas, solicitações, denúncias, questões relacionadas à conta, privacidade, segurança ou violação destes Termos de Uso, entre em contato pelo e-mail: contato@papoauto.com.br.",
      },
    ],
  },
  {
    title: "20. Disposições finais",
    blocks: [
      {
        type: "p",
        text: "Se qualquer parte destes Termos de Uso for considerada inválida, ilegal ou inexequível, as demais disposições permanecerão válidas e aplicáveis.",
      },
      {
        type: "p",
        text: "A eventual tolerância da plataforma em relação ao descumprimento destes termos não representa renúncia de direito, alteração contratual ou autorização para novas violações.",
      },
      {
        type: "p",
        text: "Estes Termos de Uso representam as regras gerais de utilização do PapoAuto e devem ser interpretados em conjunto com eventuais políticas complementares, como Política de Privacidade, Diretrizes da Comunidade ou regras específicas de funcionalidades.",
      },
    ],
  },
];

function renderBlock(block: Block, index: number) {
  if (block.type === "ul") {
    return (
      <ul
        key={index}
        className="flex flex-col gap-2 pl-5 list-disc text-[15px] leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <p
      key={index}
      className="text-[15px] leading-relaxed"
      style={{ color: "var(--text-muted)" }}
    >
      {block.text}
    </p>
  );
}

export default function TermsPage() {
  return (
    <main className="flex-1" style={{ background: "var(--bg)" }}>
      <div className="container mx-auto px-6 py-12 md:py-16 max-w-3xl flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "var(--text)" }}
          >
            Termos de Uso
          </h1>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            Última atualização: 11 de julho de 2026
          </p>
        </header>

        <section className="flex flex-col gap-3">
          {intro.map((paragraph, index) => (
            <p
              key={index}
              className="text-[15px] leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {paragraph}
            </p>
          ))}
        </section>

        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--text)" }}
            >
              {section.title}
            </h2>
            {section.blocks.map((block, index) => renderBlock(block, index))}
          </section>
        ))}
      </div>
    </main>
  );
}
