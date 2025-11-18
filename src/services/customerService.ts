import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  status: 'active' | 'inactive';
}

export const customerService = {
  async getAllCustomers(): Promise<Customer[]> {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Müşterileri grupla
    const customerMap = new Map<string, Customer>();

    bookings?.forEach(booking => {
      const existing = customerMap.get(booking.email);

      if (existing) {
        existing.totalBookings += 1;
        existing.totalSpent += booking.total_price;
        
        if (new Date(booking.created_at) > new Date(existing.lastBooking)) {
          existing.lastBooking = booking.created_at;
        }
      } else {
        customerMap.set(booking.email, {
          id: booking.email, // Email'i ID olarak kullan
          name: booking.customer_name,
          email: booking.email,
          phone: booking.phone,
          totalBookings: 1,
          totalSpent: booking.total_price,
          lastBooking: booking.created_at,
          status: 'active'
        });
      }
    });

    return Array.from(customerMap.values());
  },

  async getCustomerByEmail(email: string) {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        tour:tours(*)
      `)
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!bookings || bookings.length === 0) return null;

    const firstBooking = bookings[0];

    return {
      customer: {
        id: email,
        name: firstBooking.customer_name,
        email: firstBooking.email,
        phone: firstBooking.phone,
        country: 'N/A',
        registeredDate: bookings[bookings.length - 1].created_at,
        totalBookings: bookings.length,
        totalSpent: bookings.reduce((sum, b) => sum + b.total_price, 0),
        status: 'active' as const,
        notes: ''
      },
      bookings,
      reviews: [] // Yorumlar için ayrı çekilebilir
    };
  }
};
