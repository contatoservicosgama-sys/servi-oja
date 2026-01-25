
import { 
  Provider, Payment, Service, City, MessageTemplate, 
  ProviderStatus, PaymentStatus 
} from '../types';
import { 
  INITIAL_PROVIDERS, INITIAL_PAYMENTS, INITIAL_SERVICES, 
  INITIAL_CITIES, INITIAL_TEMPLATES 
} from '../constants';

const STORAGE_KEYS = {
  PROVIDERS: 'servicos_ja_providers',
  PAYMENTS: 'servicos_ja_payments',
  SERVICES: 'servicos_ja_services',
  CITIES: 'servicos_ja_cities',
  TEMPLATES: 'servicos_ja_templates'
};

class DataService {
  private get<T>(key: string, initial: T): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initial;
  }

  private set<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Providers
  getProviders(): Provider[] {
    return this.get(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
  }

  saveProvider(provider: Provider): void {
    const providers = this.getProviders();
    const index = providers.findIndex(p => p.id === provider.id);
    if (index >= 0) {
      providers[index] = provider;
    } else {
      providers.push(provider);
    }
    this.set(STORAGE_KEYS.PROVIDERS, providers);
  }

  deleteProvider(id: string): void {
    const providers = this.getProviders().filter(p => p.id !== id);
    this.set(STORAGE_KEYS.PROVIDERS, providers);
  }

  // Payments
  getPayments(): Payment[] {
    return this.get(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  }

  savePayment(payment: Payment): void {
    const payments = this.getPayments();
    const index = payments.findIndex(p => p.id === payment.id);
    if (index >= 0) {
      payments[index] = payment;
    } else {
      payments.push(payment);
    }
    this.set(STORAGE_KEYS.PAYMENTS, payments);
  }

  // Services
  getServices(): Service[] {
    return this.get(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }

  saveService(service: Service): void {
    const services = this.getServices();
    const index = services.findIndex(s => s.id === service.id);
    if (index >= 0) services[index] = service;
    else services.push(service);
    this.set(STORAGE_KEYS.SERVICES, services);
  }

  // Cities
  getCities(): City[] {
    return this.get(STORAGE_KEYS.CITIES, INITIAL_CITIES);
  }

  saveCity(city: City): void {
    const cities = this.getCities();
    const index = cities.findIndex(c => c.id === city.id);
    if (index >= 0) cities[index] = city;
    else cities.push(city);
    this.set(STORAGE_KEYS.CITIES, cities);
  }

  // Templates
  getTemplates(): MessageTemplate[] {
    return this.get(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
  }

  saveTemplate(template: MessageTemplate): void {
    const templates = this.getTemplates();
    const index = templates.findIndex(t => t.id === template.id);
    if (index >= 0) templates[index] = template;
    else templates.push(template);
    this.set(STORAGE_KEYS.TEMPLATES, templates);
  }
}

export const dataService = new DataService();
