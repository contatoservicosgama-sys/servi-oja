
export enum ProviderStatus {
  ACTIVE = 'Ativo',
  PENDING = 'Pendente',
  BLOCKED = 'Bloqueado'
}

export enum PaymentStatus {
  PENDING = 'Pendente',
  APPROVED = 'Aprovado',
  REJECTED = 'Rejeitado'
}

export enum MessageType {
  REGISTRATION_CONFIRM = 'Confirmação de Cadastro',
  PAYMENT_APPROVED = 'Pagamento Aprovado',
  PAYMENT_REJECTED = 'Pagamento Rejeitado',
  PLAN_EXPIRED = 'Plano Vencido',
  BLOCK_NOTICE = 'Aviso de Bloqueio'
}

export interface Service {
  id: string;
  name: string;
  active: boolean;
  priority: number;
}

export interface City {
  id: string;
  name: string;
  active: boolean;
}

export interface Provider {
  id: string;
  name: string;
  phone: string;
  email?: string;
  document?: string; // CPF or CNPJ
  cityId: string;
  serviceIds: string[];
  status: ProviderStatus;
  dueDate: string; // ISO string
  createdAt: string;
  activatedAt?: string; // ISO string of last activation
  profileImage?: string;
  description?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  additionalInfo?: string;
}

export interface Payment {
  id: string;
  providerId: string;
  value: number;
  date: string;
  proofUrl?: string;
  status: PaymentStatus;
}

export interface MessageTemplate {
  id: string;
  type: MessageType;
  content: string;
}

export interface DashboardStats {
  activeProviders: number;
  pendingProviders: number;
  blockedProviders: number;
  monthlyRevenue: number;
  expiringToday: number;
}