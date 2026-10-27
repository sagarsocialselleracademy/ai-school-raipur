declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export const META_PIXEL_ID = '762245465547904';

export interface PixelEventData {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  [key: string]: any;
}

/**
 * Track custom or standard Meta Pixel events safely across SSR / client
 */
export function trackPixel(
  eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Lead' | 'Purchase' | 'Contact',
  data?: PixelEventData
) {
  if (typeof window === 'undefined') return;

  if (typeof window.fbq === 'function') {
    if (data) {
      window.fbq('track', eventName, data);
    } else {
      window.fbq('track', eventName);
    }
    // eslint-disable-next-line no-console
    console.log(`[Meta Pixel ${META_PIXEL_ID}] Tracked ${eventName}`, data || {});
  } else {
    // If pixel is still loading, push to queue
    window._fbq = window._fbq || [];
    if (data) {
      window._fbq.push(['track', eventName, data]);
    } else {
      window._fbq.push(['track', eventName]);
    }
  }
}

/**
 * Standard workshop event helpers
 */
export const PixelTracker = {
  pageView: () => {
    trackPixel('PageView');
  },

  viewContent: (details?: { name?: string; price?: number }) => {
    trackPixel('ViewContent', {
      content_name: details?.name || "Raipur's Most Advance Ai & Automation Masterclass",
      content_category: 'Physical Workshop',
      content_ids: ['ai-masterclass-raipur-29-nov'],
      content_type: 'product',
      value: details?.price || 499,
      currency: 'INR',
    });
  },

  initiateCheckout: (buttonLabel?: string, targetUrl?: string) => {
    trackPixel('InitiateCheckout', {
      content_name: "Raipur's Most Advance Ai & Automation Masterclass",
      content_category: 'Ticket Registration',
      content_ids: ['ai-masterclass-raipur-29-nov'],
      value: 499,
      currency: 'INR',
      num_items: 1,
      button_clicked: buttonLabel || 'Register Now',
      target_url: targetUrl || 'https://rzp.io/rzp/hEo9sFF5',
    });
  },

  lead: (leadData?: { name?: string; email?: string; phone?: string }) => {
    trackPixel('Lead', {
      content_name: 'Workshop Seat Reservation Lead',
      content_category: 'Lead Form',
      currency: 'INR',
      value: 499,
    });
  },

  purchase: (details?: { transactionId?: string; amount?: number }) => {
    trackPixel('Purchase', {
      content_name: "Raipur's Most Advance Ai & Automation Masterclass",
      content_ids: ['ai-masterclass-raipur-29-nov'],
      content_type: 'product',
      value: details?.amount || 499,
      currency: 'INR',
      num_items: 1,
      order_id: details?.transactionId || `order_${Date.now()}`,
    });
  },
};
