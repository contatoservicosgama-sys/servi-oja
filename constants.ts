
import { ProviderStatus, PaymentStatus, MessageType, Service, City, Provider, Payment, MessageTemplate } from './types';

export const INITIAL_SERVICES: Service[] = [
  { id: '1', name: 'Marido de Aluguel', active: true, priority: 1 },
  { id: '2', name: 'Elétrica Simples', active: true, priority: 2 },
  { id: '3', name: 'Hidráulica Simples', active: true, priority: 3 },
  { id: '4', name: 'Montagem de Móveis', active: true, priority: 4 },
  { id: '5', name: 'Troca de Chuveiro', active: true, priority: 5 },
  { id: '6', name: 'Pintura Residencial', active: true, priority: 6 },
  { id: '7', name: 'Gesso e Drywall', active: true, priority: 7 },
  { id: '8', name: 'Jardinagem', active: true, priority: 8 },
  { id: '9', name: 'Ar Condicionado', active: true, priority: 9 },
  { id: '10', name: 'Limpeza Pós-Obra', active: true, priority: 10 },
  { id: '11', name: 'Instalações em Geral', active: true, priority: 11 },
];

export const INITIAL_CITIES: City[] = [
  { id: '1', name: 'Belo Horizonte', active: true },
  { id: '2', name: 'Contagem', active: true },
  { id: '3', name: 'Betim', active: true },
];

export const INITIAL_TEMPLATES: MessageTemplate[] = [
  { 
    id: '1', 
    type: MessageType.REGISTRATION_CONFIRM, 
    content: 'Olá! Seu cadastro no Serviços Já foi recebido com sucesso. Em breve analisaremos seus dados.' 
  },
  { 
    id: '2', 
    type: MessageType.PAYMENT_APPROVED, 
    content: 'Parabéns! Seu pagamento foi aprovado e seu anúncio já está ativo no Serviços Já.' 
  },
  { 
    id: '3', 
    type: MessageType.PAYMENT_REJECTED, 
    content: 'Olá. Seu comprovante de pagamento PIX foi rejeitado. Por favor, envie um comprovante válido para ativar seu plano.' 
  },
  { 
    id: '4', 
    type: MessageType.PLAN_EXPIRED, 
    content: 'Olá! Seu plano no Serviços Já venceu. Faça o PIX para continuar ativo e recebendo contatos.' 
  },
  { 
    id: '5', 
    type: MessageType.BLOCK_NOTICE, 
    content: 'Aviso: Seu perfil foi bloqueado por falta de pagamento. Regularize sua situação para voltar a receber contatos.' 
  },
];

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'p1',
    name: 'João da Elétrica',
    phone: '31999999999',
    cityId: '1',
    serviceIds: ['2', '11'],
    status: ProviderStatus.ACTIVE,
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    description: 'Especialista em instalações residenciais, troca de fiação e reparos em geral. Atendimento rápido em BH.',
    portfolioUrl: 'https://instagram.com'
  },
  {
    id: 'p2',
    name: 'Maria Hidráulica',
    phone: '31988888888',
    cityId: '2',
    serviceIds: ['3'],
    status: ProviderStatus.ACTIVE,
    dueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    createdAt: new Date().toISOString(),
    description: 'Reparos de vazamentos, instalação de torneiras, vasos sanitários e limpeza de caixas d\'água.',
  },
  {
    id: 'p3',
    name: 'Carlos Pinturas',
    phone: '31977777777',
    cityId: '1',
    serviceIds: ['6'],
    status: ProviderStatus.ACTIVE,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    description: 'Pintura residencial e comercial. Grafiato, textura e fino acabamento com 15 anos de experiência.',
    portfolioUrl: 'https://behance.net'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay1',
    providerId: 'p1',
    value: 39.90,
    date: new Date().toISOString(),
    status: PaymentStatus.APPROVED
  }
];
