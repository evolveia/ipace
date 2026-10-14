import React from 'react';
import { IpaceLogo } from '../IpaceLogo';
import {
  ArrowLeft,
  Shield,
  Lock,
  MapPin,
  Eye,
  Database,
  Trash2,
  FileCheck,
  CheckCircle2,
  Download,
} from 'lucide-react';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
  onOpenTerms?: () => void;
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({
  onBack,
  onOpenTerms,
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
            {onOpenTerms && (
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-xs font-bold text-[var(--ipace-primary)] hover:underline cursor-pointer"
              >
                Ver Termos de Uso →
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
                  Privacidade &amp; LGPD
                </span>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] mt-0.5">
                  Política de Privacidade
                </h1>
                <p className="text-xs text-[var(--ipace-text-2)] mt-1">
                  Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - Brasil)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                LGPD Compliance
              </span>
            </div>
          </div>
        </div>

        {/* LGPD Highlight summary box */}
        <div className="bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-800/60 rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-heading font-black text-base text-blue-900 dark:text-blue-200">
                Seus Dados Pertencem a Você
              </h2>
              <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                No IPACE, respeitamos sua privacidade física e digital. Não comercializamos seus dados de localização GPS nem suas métricas de saúde com corretores de dados (data brokers) ou empresas de seguros. Todos os dados coletados têm a finalidade exclusiva de enriquecer sua experiência de corrida, fornecer análises de ritmo por inteligência artificial e permitir sua interação comunitária.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Section 1 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-heading font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Dados Pessoais que Coletamos
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed space-y-2 pl-9">
              <p>O IPACE coleta as seguintes categorias de informações:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <strong>Dados Cadastrais:</strong> Nome completo, nome de usuário, e-mail, foto de perfil, cidade, estado e país.
                </li>
                <li>
                  <strong>Dados Biométricos e Esportivos (opcionais):</strong> Peso corporal, altura, data de nascimento e meta semanal de quilometragem (usados para estimar gasto calórico e zonas de treinamento).
                </li>
                <li>
                  <strong>Geolocalização e Trajetos (GPS):</strong> Coordenadas de latitude, longitude, altitude e timestamp capturadas durante treinos de corrida e caminhada.
                </li>
                <li>
                  <strong>Interações Sociais:</strong> Publicações no feed, curtidas, comentários, eventos inscritos e atletas seguidos.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-heading font-black text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Uso da Geolocalização e Permissões de GPS
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed space-y-2 pl-9">
              <p>
                O acesso à localização é solicitado através da <strong>Web Geolocation API</strong> do navegador. O rastreamento contínuo é ativado <em>apenas</em> quando você clica em &ldquo;Iniciar Corrida/Caminhada&rdquo; e cessa imediatamente quando a atividade é finalizada ou descartada.
              </p>
              <p>
                Caso a permissão de GPS seja recusada, o IPACE disponibiliza o <strong>Modo Demo / Rastreamento Simulado</strong> para que você possa usufruir da interface e recursos do aplicativo sem compartilhar dados de sua posição real.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-heading font-black text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Base Legal para Tratamento (Art. 7º da LGPD)
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed space-y-2 pl-9">
              <p>Tratamos seus dados com base nas seguintes hipóteses legais autorizadas pela LGPD:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li><strong>Execução de Contrato:</strong> Para possibilitar o registro de suas corridas, participação em eventos e uso das ferramentas da plataforma.</li>
                <li><strong>Consentimento do Titular:</strong> Para o uso de dados de localização e envio de notificações motivacionais.</li>
                <li><strong>Legítimo Interesse:</strong> Para aprimoramento dos recursos de segurança, combate a fraudes e estabilidade dos algoritmos esportivos.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-heading font-black text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Armazenamento, Cookies e Segurança
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed space-y-2 pl-9">
              <p>
                No ambiente cliente, suas preferências (tema escuro/claro, sessão de login e histórico de corridas) são gravadas no <code>localStorage</code> do seu navegador de forma segura.
              </p>
              <p>
                As transmissões de dados são protegidas por criptografia HTTPS (TLS 1.3). Senhas são processadas de forma segura e não temos acesso à sua senha em texto claro.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-heading font-black text-xs flex items-center justify-center shrink-0">
                5
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Direitos do Titular de Dados (Art. 18 da LGPD)
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed space-y-2 pl-9">
              <p>Você pode a qualquer momento exercer seus direitos garantidos pela legislação brasileira:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li><strong>Confirmação e Acesso:</strong> Verificar quais dados estão armazenados na sua conta;</li>
                <li><strong>Correção:</strong> Atualizar nome, peso, altura, foto e dados desatualizados na aba de Perfil;</li>
                <li><strong>Anonimização ou Bloqueio:</strong> Solicitar a desativação da visibilidade pública do seu perfil nos rankings;</li>
                <li><strong>Portabilidade de Dados:</strong> Exportar suas rotas e atividades em formato padronizado (GPX / JSON);</li>
                <li><strong>Eliminação e Exclusão Definitiva:</strong> Solicitar a remoção permanente de todos os seus dados e histórico.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-heading font-black text-xs flex items-center justify-center shrink-0">
                6
              </span>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Canal de Contato do Encarregado de Dados (DPO)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--ipace-text-2)] leading-relaxed pl-9">
              Para solicitações relativas à privacidade, dúvidas sobre tratamento de dados ou exercício dos direitos do titular, entre em contato diretamente com o nosso Encarregado de Proteção de Dados (DPO):
              <br />
              <strong>E-mail:</strong> <a href="mailto:privacidade@ipace.app" className="text-[var(--ipace-primary)] underline">privacidade@ipace.app</a>
              <br />
              <strong>Prazo de resposta:</strong> Até 15 dias úteis, conforme estipulado pela Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </section>
        </div>

        {/* Footer buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--ipace-border)]">
          <p className="text-xs text-[var(--ipace-text-2)]">
            IPACE Running App • Todos os direitos reservados.
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
