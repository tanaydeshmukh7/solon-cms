import {
  SalonSettings,
  ServiceCategory,
  Service,
  Stylist,
  Testimonial,
  Transformation,
  BlogPost,
  Customer,
  Appointment,
  ReminderJob,
  Payment,
  Expense,
  InventoryProduct,
} from '@/types';
import {
  initialSalonSettings,
  initialCategories,
  initialServices,
  initialStylists,
  initialTestimonials,
  initialTransformations,
  initialCustomers,
  initialAppointments,
  initialReminderJobs,
  initialPayments,
  initialExpenses,
  initialInventory,
  initialBlogPosts,
} from './mock-data';

// Key for local storage persistence during demo/development
const STORAGE_KEY = 'glama_studio_data_v1';

export interface SalonDataState {
  settings: SalonSettings;
  categories: ServiceCategory[];
  services: Service[];
  stylists: Stylist[];
  testimonials: Testimonial[];
  transformations: Transformation[];
  customers: Customer[];
  appointments: Appointment[];
  reminderJobs: ReminderJob[];
  payments: Payment[];
  expenses: Expense[];
  inventory: InventoryProduct[];
  blogPosts: BlogPost[];
}

export const getInitialData = (): SalonDataState => {
  if (typeof window === 'undefined') {
    return {
      settings: initialSalonSettings,
      categories: initialCategories,
      services: initialServices,
      stylists: initialStylists,
      testimonials: initialTestimonials,
      transformations: initialTransformations,
      customers: initialCustomers,
      appointments: initialAppointments,
      reminderJobs: initialReminderJobs,
      payments: initialPayments,
      expenses: initialExpenses,
      inventory: initialInventory,
      blogPosts: initialBlogPosts,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        settings: parsed.settings || initialSalonSettings,
        categories: parsed.categories || initialCategories,
        services: parsed.services || initialServices,
        stylists: parsed.stylists || initialStylists,
        testimonials: parsed.testimonials || initialTestimonials,
        transformations: parsed.transformations || initialTransformations,
        customers: parsed.customers || initialCustomers,
        appointments: parsed.appointments || initialAppointments,
        reminderJobs: parsed.reminderJobs || initialReminderJobs,
        payments: parsed.payments || initialPayments,
        expenses: parsed.expenses || initialExpenses,
        inventory: parsed.inventory || initialInventory,
        blogPosts: parsed.blogPosts || initialBlogPosts,
      };
    }
  } catch (e) {
    console.error('Failed to load local storage state:', e);
  }

  return {
    settings: initialSalonSettings,
    categories: initialCategories,
    services: initialServices,
    stylists: initialStylists,
    testimonials: initialTestimonials,
    transformations: initialTransformations,
    customers: initialCustomers,
    appointments: initialAppointments,
    reminderJobs: initialReminderJobs,
    payments: initialPayments,
    expenses: initialExpenses,
    inventory: initialInventory,
    blogPosts: initialBlogPosts,
  };
};

export const saveDataState = (data: Partial<SalonDataState>): SalonDataState => {
  const current = getInitialData();
  const updated: SalonDataState = {
    ...current,
    ...data,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('glama_data_updated'));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }

  return updated;
};
