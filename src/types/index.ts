export * from './database';

export interface BookingTimeSlot {
  time: string; // "09:30"
  available: boolean;
  stylistId?: string;
  reason?: string;
}

export interface BookingStepData {
  serviceId: string;
  selectedAddOns: string[];
  stylistId: string; // 'any' or specific stylist ID
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNotes: string;
  whatsappConsent: boolean;
  paymentOption: 'salon' | 'deposit_online';
}

export interface AvailabilityRequest {
  serviceId: string;
  date: string; // YYYY-MM-DD
  stylistId?: string;
}

export interface BookingResponse {
  success: boolean;
  referenceCode?: string;
  appointmentId?: string;
  message?: string;
  details?: {
    serviceName: string;
    stylistName: string;
    date: string;
    time: string;
    totalAmount: number;
    depositAmount: number;
  };
}
