import React from 'react';
import { IpaceLogo } from '../IpaceLogo';
import {
  ArrowLeft,
  FileText,
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Sparkles,
  ShoppingBag,
  Calendar,
  Share2,
} from 'lucide-react';

interface TermsOfUseScreenProps {
  onBack: () => void;
  onOpenPrivacy?: () => void;
}

export const TermsOfUseScreen: React.FC<TermsOfUseScreenProps> = ({
  onBack,
  onOpenPrivacy,
}) => {
  return (
    <div className="min-h-screen bg-[var(--ipace-bg)] text-[var(--ipace-text)] py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-[var(--ipace-border)] pb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface)] text-xs font-bold text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="flex items-center gap-3">
            {onOpenPrivacy && (
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-xs font-bold text-[var(--ipace-primary)] hover:underline cursor-pointer"
              >
                Ver Política de Privacidade →
              </button>
            )}
          </div>
        </div>

        {/* Title banner */}
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <IpaceLogo variant="compact" size="md" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--ipace-primary)]">
                  Documento Legal Oficial
                </span>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] mt-0.5">
                  Termos de Uso
                </h1>
                <p className="text-xs text-[var(--ipace-text-2)] mt-1">
                  Última atualização: Outubro de 2026 • Versão 2.4 (Brasil)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-[var(--ipace-primary)] dark:bg-red-950/60 dark:text-red-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                Vigência Ativa
              </span>
            </div>
          </div>
        </div>

        {/* Crucial Health Warning Notice */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-200 shrink-0">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-heading font-black text-base text-amber-900 dark:text-amber-200">
                Aviso Médico &amp; Declaração de Aptidão Física
              </h2>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                A prática de corrida de rua, caminhadas de longa distância e treinos intervalados de alta intensidade
                (HIIT) envolve esforço cardiovascular e muscular expressivo. Recomendamos fortemente a realização de
                consulta e avaliação médica prévia com cardiologista ou médico do esporte (PAR-Q / Teste Ergométrico)
                antes de iniciar qualquer programa de treinamento.
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300 font-bold mt-2">
                O aplicativo IPACE — Running App não fornece aconselhamento médico de emergência ou prescrição clínica individualizada. O uso da plataforma é de sua exclusiva responsabilidade.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Section 1 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[var(--ipace-soft)] text-[var(--ipace-primary)] font-heading font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Aceitação e Objeto dos Termos
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed pl-9">
              Ao acessar, cadastrar-se ou utilizar qualquer serviço da plataforma web e aplicativo <strong>IPACE — Running App</strong>, você concorda expressamente em aderir a estes Termos de Uso e à nossa Política de Privacidade. Estes termos constituem contrato vinculante entre o usuário e a equipe do IPACE. Caso não concorde com qualquer disposição aqui estabelecida, interrompa imediatamente o uso do sistema.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[var(--ipace-soft)] text-[var(--ipace-primary)] font-heading font-black text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Cadastro, Segurança e Acesso
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed space-y-2 pl-9">
              <p>
                O usuário é o único responsável pela veracidade e atualização das informações prestadas durante o cadastro (nome, e-mail, biometria e contatos de emergência).
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>A conta é pessoal e intransferível. Não compartilhe sua senha com terceiros.</li>
                <li>Por questões de segurança contra força bruta, o sistema suspende temporariamente o login após 5 tentativas consecutivas incorretas.</li>
                <li>Menores de 16 anos devem possuir autorização prévia de pais ou responsáveis legais para participar de eventos e corridas monitoradas.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[var(--ipace-soft)] text-[var(--ipace-primary)] font-heading font-black text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Conduta da Comunidade e Rede Social
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed space-y-2 pl-9">
              <p>
                O feed do IPACE, os comentários e o sistema de seguidores têm como finalidade a motivação esportiva mútua, a celebração de recordes e a troca respeitosa de experiências.
              </p>
              <p>São expressamente proibidos:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Discurso de ódio, assédio moral ou sexual, racismo, homofobia ou intolerância religiosa;</li>
                <li>Falsificação de dados de GPS ou percurso com o objetivo de obter vantagem indevida em rankings ou premiações de desafios;</li>
                <li>Spam, correntes, publicidade não autorizada ou invasão da privacidade de outros atletas;</li>
                <li>Publicação de fotos ou vídeos sem a devida cessão de imagem dos indivíduos retratados.</li>
              </ul>
              <p>
                O IPACE reserva-se o direito de remover qualquer conteúdo em desacordo e banir contas reincidentes sem aviso prévio.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[var(--ipace-soft)] text-[var(--ipace-primary)] font-heading font-black text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Eventos Presenciais e Desafios Remotos
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed space-y-2 pl-9">
              <p>
                As inscrições realizadas pelo módulo <strong>Eventos</strong> do IPACE emitem comprovante digital autenticado contendo QR Code e número de peito.
              </p>
              <p>
                Em corridas presenciais, a responsabilidade de infraestrutura, trânsito, hidratação, postos médicos e entrega física de kits compete exclusivamente ao organizador oficial informado na página do evento.
              </p>
              <p>
                Em desafios remotos ou virtuais, a validação de medalhas e certificados ocorre mediante envio do registro de GPS concluído dentro do período regulamentar.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[var(--ipace-soft)] text-[var(--ipace-primary)] font-heading font-black text-xs flex items-center justify-center shrink-0">
                5
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Marketplace de Produtos e Serviços Esportivos
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed space-y-2 pl-9">
              <p>
                O Marketplace do IPACE conecta atletas a vendedores de equipamentos (tênis com placa de carbono, relógios GPS, suplementos, vestuário) e a profissionais autônomos de esporte e saúde (treinadores, nutricionistas, fisioterapeutas).
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>O IPACE não intermedeia custódia financeira nem garante a garantia dos itens seminovos anunciados por usuários comuns.</li>
                <li>Profissionais com o selo <strong>Verificado</strong> comprovaram registro ativo no respectivo conselho de classe profissional (CREF, CRN ou CREFITO).</li>
                <li>É vedado o anúncio de substâncias proibidas pela Agência Mundial Antidopagem (WADA) ou medicamentos controlados.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[var(--ipace-soft)] text-[var(--ipace-primary)] font-heading font-black text-xs flex items-center justify-center shrink-0">
                6
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Inteligência Artificial &amp; Algoritmos de Pace
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed pl-9">
              O módulo <strong>IPACE Coach IA</strong> e as estimativas de prova (como a Fórmula de Riegel para 5K, 10K, 21K e 42K) são cálculos estatísticos preditivos baseados no seu histórico de treinos. Tais ferramentas servem como orientações de apoio esportivo e não substituem o acompanhamento presencial de um treinador profissional habilitado nem constituem laudo médico esportivo.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[var(--ipace-soft)] text-[var(--ipace-primary)] font-heading font-black text-xs flex items-center justify-center shrink-0">
                7
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Propriedade Intelectual e Logomarca
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed pl-9">
              A marca <strong>IPACE</strong>, sua identidade visual oficial com badge rotacionado a -6°, o silhueta de corredor em aquarela, o design system e o código-fonte são protegidos pelas leis de propriedade intelectual e direitos autorais. O usuário detém os direitos autorais das fotografias e relatos que submeter ao feed, conferindo ao IPACE licença gratuita, não exclusiva e mundial para exibição na plataforma.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[var(--ipace-soft)] text-[var(--ipace-primary)] font-heading font-black text-xs flex items-center justify-center shrink-0">
                8
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Disposições Gerais e Foro
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed pl-9">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, em particular o Código de Defesa do Consumidor e o Marco Civil da Internet. Fica eleito o Foro da Comarca de São Paulo/SP para dirimir quaisquer dúvidas oriundas deste instrumento.
            </p>
          </section>
        </div>

        {/* Footer buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--ipace-border)]">
          <p className="text-xs text-[var(--ipace-text-2)]">
            Em caso de dúvidas: <a href="mailto:contato@ipace.app" className="text-[var(--ipace-primary)] underline">contato@ipace.app</a>
          </p>

          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] text-white font-heading font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Entendido e Voltar
          </button>
        </div>
      </div>
    </div>
  );
};
