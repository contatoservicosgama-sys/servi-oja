
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
    content: 'Olá! Seu cadastro na plataforma Sua Mão de Obra foi recebido com sucesso. Em breve analisaremos seus dados.' 
  },
  { 
    id: '2', 
    type: MessageType.PAYMENT_APPROVED, 
    content: 'Parabéns! Seu pagamento foi aprovado e seu anúncio já está ativo no Sua Mão de Obra. Boas vendas!' 
  },
  { 
    id: '3', 
    type: MessageType.PAYMENT_REJECTED, 
    content: 'Olá. Seu comprovante de pagamento foi rejeitado pela equipe do Sua Mão de Obra. Por favor, envie um comprovante válido.' 
  },
  { 
    id: '4', 
    type: MessageType.PLAN_EXPIRED, 
    content: 'Olá! Seu plano no Sua Mão de Obra venceu. Renove agora para continuar recebendo novos clientes.' 
  },
  { 
    id: '5', 
    type: MessageType.BLOCK_NOTICE, 
    content: 'Aviso: Seu perfil no Sua Mão de Obra foi bloqueado temporariamente por falta de pagamento ou denúncia.' 
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
    activatedAt: new Date().toISOString(),
    description: 'Especialista em instalações residenciais e reparos elétricos rápidos.',
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
    activatedAt: new Date().toISOString(),
    description: 'Reparos de vazamentos e instalação de louças sanitárias.',
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
