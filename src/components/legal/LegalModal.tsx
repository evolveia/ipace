import React, { useState } from 'react';
import { IpaceLogo } from '../IpaceLogo';
import { Shield, FileText, CheckCircle2, Lock, AlertTriangle, HeartPulse, X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: 'terms' | 'privacy';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'terms',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl max-w-2xl w-full shadow-2xl relative my-auto overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[var(--ipace-border)] flex items-center justify-between bg-[var(--ipace-surface)] shrink-0">
          <div className="flex items-center gap-3">
            <IpaceLogo variant="compact" size="sm" />
            <div>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Termos &amp; Privacidade
              </h3>
              <p className="text-[11px] text-[var(--ipace-text-2)]">
                Diretrizes oficiais e segurança da comunidade IPACE
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-2 border-b border-[var(--ipace-border)] flex items-center gap-2 bg-[var(--ipace-surface-2)] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[var(--ipace-primary)] text-white shadow-xs'
                : 'text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] bg-[var(--ipace-surface)]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Termos de Uso
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[var(--ipace-primary)] text-white shadow-xs'
                : 'text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] bg-[var(--ipace-surface)]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Política de Privacidade (LGPD)
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-[var(--ipace-text)]">
          {activeTab === 'terms' ? (
            // TERMOS DE USO
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                <HeartPulse className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-xs">
                    Declaração de Aptidão Física e Saúde
                  </h4>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                    A prática de corrida de rua, caminhada e treinos intervalados exige avaliação médica prévia.
                    O IPACE não se responsabiliza por lesões, acidentes de percurso ou agravos à saúde
                    decorrentes da realização de atividades físicas sem supervisão qualificada.
                  </p>
                </div>
              </div>

              <section className="space-y-1.5">
                <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                  1. Aceitação dos Termos
                </h4>
                <p className="text-[var(--ipace-text-2)]">
                  Ao criar uma conta ou utilizar as funcionalidades do aplicativo web IPACE — Running App,
                  você concorda expressamente com as presentes condições. Caso discorde de qualquer cláusula,
                  o uso da plataforma deve ser descontinuado imediatamente.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                  2. Conduta Comunitária e Rede Social
                </h4>
                <p className="text-[var(--ipace-text-2)]">
                  O feed e comentários do IPACE são espaços de incentivo ao esporte. É estritamente proibido:
                  publicar conteúdo que configure assédio, incitação ao ódio, discriminação de qualquer natureza,
                  spam, propaganda não autorizada ou violação de propriedade intelectual. Qualquer usuário que violar
                  estas regras estará sujeito a suspensão e banimento definitivo.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                  3. Inscrições em Eventos e Desafios
                </h4>
                <p className="text-[var(--ipace-text-2)]">
                  A confirmação de inscrição gera um comprovante digital único (QR Code e número de peito).
                  Eventos presenciais possuem regulamento próprio do organizador. A entrega de medalhas em desafios
                  remotos é realizada após validação de trajeto e dados de GPS pelo sistema.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                  4. Marketplace de Produtos e Serviços
                </h4>
                <p className="text-[var(--ipace-text-2)]">
                  O Marketplace é um ponto de conexão entre atletas, assessorias e profissionais de saúde e esporte.
                  As negociações entre compradores e anunciantes são de responsabilidade direta das partes.
                  Profissionais com selo &ldquo;Verificado&rdquo; apresentaram registro ativo (CREF, CRN ou CREFITO).
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                  5. Inteligência Artificial e Algoritmos de Ritmo
                </h4>
                <p className="text-[var(--ipace-text-2)]">
                  As projeções de tempo para provas (Fórmula de Riegel), tendências de pace e alertas de carga são
                  estimativas estatísticas geradas por IA para suporte ao treino e <strong>não substituem prescrição
                  médica ou de treinador habilitado</strong>.
                </p>
              </section>
            </div>
          ) : (
            // POLÍTICA DE PRIVACIDADE
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                    Compromisso com a LGPD (Lei nº 13.709/2018)
                  </h4>
                  <p className="text-[11px] text-blue-800 dark:text-blue-300 mt-0.5">
                    Seus dados biométricos, históricos de GPS e informações esportivas são tratados com
                    criptografia de ponta e nunca serão vendidos para terceiros.
                  </p>
                </div>
              </div>

              <section className="space-y-1.5">
                <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                  1. Dados Pessoais e Biométricos Coletados
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[var(--ipace-text-2)]">
                  <li><strong>Dados cadastrais:</strong> Nome completo, e-mail, nome de usuário, peso e altura.</li>
                  <li><strong>Dados de telemetria esportiva:</strong> Coordenadas de GPS de percursos, tempo, ritmo, elevação e cadência.</li>
                  <li><strong>Interações comunitárias:</strong> Fotos enviadas, comentários, curtidas e registros de eventos.</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                  2. Finalidade do Tratamento
                </h4>
                <p className="text-[var(--ipace-text-2)]">
                  Os dados são coletados exclusivamente para permitir a sincronização das suas corridas, cálculo
                  de gasto calórico personalizado, exibição de classificações e rankings comunitários (quando
                  autorizado pelo atleta), e alimentação dos modelos de IA do Treinador IPACE.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                  3. Privacidade e Visibilidade do Perfil
                </h4>
                <p className="text-[var(--ipace-text-2)]">
                  Você possui controle total sobre sua privacidade. É possível alternar seu perfil entre
                  Público e Privado nas configurações a qualquer momento, ocultando suas rotas do feed geral.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                  4. Direitos do Titular de Dados
                </h4>
                <p className="text-[var(--ipace-text-2)]">
                  Em conformidade com a LGPD, você tem direito a solicitar a exportação de todos os seus
                  treinos (em formato GPX/JSON) ou a exclusão completa e definitiva da sua conta e de todo o
                  histórico associado.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--ipace-border)] bg-[var(--ipace-surface)] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[var(--ipace-text-2)]">
            Última atualização: Outubro de 2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-6 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-sm cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
