import { supabase } from '../lib/supabase';
import type { Booking } from '../types';
import { emailService } from './emailService';

export const bookingService = {
  async getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        tour:tours(id, title_tr, title_en, price, image, duration, location)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Rezervasyonlar getirilemedi:', error);
      return [];
    }

    return data || [];
  },

  async getBookingById(id: string): Promise<Booking | null> {
    console.log('📥 getBookingById çağrıldı:', id);
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        tour:tours(id, title_tr, title_en, price, image, duration, location)
      `)
      .eq('id', id)
      .order('updated_at', { ascending: false })
      .single();

    console.log('📥 getBookingById sonucu:', { status: data?.status, data });

    if (error) {
      console.error('Rezervasyon getirilemedi:', error);
      return null;
    }

    return data;
  },

  // YENİ REZERVASYON + EMAIL
  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'tour'>): Promise<Booking | null> {
    console.log('📝 bookingService.createBooking BAŞLADI');
    console.log('📝 Booking data:', booking);

    try {
      // 1. Veritabanına kaydet
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select(`
          *,
          tour:tours(*)
        `)
        .single();

      if (error) {
        console.error('❌ Database Error:', error);
        throw error;
      }

      console.log('✅ Rezervasyon kaydedildi:', data.id);
      console.log('✅ Booking data with tour:', data);

      // 2. EMAIL GÖNDER
      try {
        console.log('📧 Email servisi çağrılıyor...');
        
        await emailService.sendBookingConfirmation(data);
        console.log('✅ Müşteri email\'i gönderildi!');
        
        await emailService.sendNewBookingNotification(data);
        console.log('✅ Admin email\'i gönderildi!');
      } catch (emailError: any) {
        console.error('⚠️ Email hatası:', emailError);
        // Email hatası olsa bile rezervasyon başarılı
      }

      return data;
    } catch (error) {
      console.error('❌ createBooking hatası:', error);
      throw error;
    }
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<boolean> {
  console.log('🔄 updateBookingStatus BAŞLADI:', { id, status });
  
  // 1. Auth kontrolü
  const { data: { session } } = await supabase.auth.getSession();
  console.log('🔐 Auth session:', session ? 'VAR ✅' : 'YOK ❌');
  
  // 2. ESKİ DURUMU AL (email için lazım!)
  const { data: before } = await supabase
    .from('bookings')
    .select(`
      *,
      tour:tours(*)
    `)
    .eq('id', id)
    .single();
  
  console.log('📥 ÖNCE:', before?.status);
  
  if (!before) {
    console.error('❌ Rezervasyon bulunamadı');
    return false;
  }
  
  const oldStatus = before.status;
  
  // 3. DURUMU GÜNCELLE
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select(`
      *,
      tour:tours(*)
    `);
  
  console.log('✅ UPDATE sonucu:', { data, error });
  
  if (error) {
    console.error('❌ HATA:', error.message);
    return false;
  }
  
  // 4. DURUM DEĞİŞTİYSE EMAIL GÖNDER
  if (data && data[0] && oldStatus !== status) {
    try {
      console.log('📧 Durum değişikliği email\'i gönderiliyor...');
      console.log('📧 Eski durum:', oldStatus, '→ Yeni durum:', status);
      
      await emailService.sendStatusChangeEmail(data[0], oldStatus, status);
      console.log('✅ Durum değişikliği email\'i gönderildi!');
    } catch (emailError) {
      console.error('⚠️ Email hatası:', emailError);
      // Email hatası olsa bile durum güncellemesi başarılı
    }
  } else {
    console.log('⏭️ Durum değişmedi, email gönderilmedi');
  }
  
  // 5. SON DURUMU KONTROL ET
  const { data: after } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('id', id)
    .single();
  
  console.log('📥 SONRA:', after?.status);
  
  const success = after?.status === status;
  console.log(success ? '✅ BAŞARILI!' : '❌ BAŞARISIZ!');
  
  return true;
},


  async deleteBooking(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Rezervasyon silinemedi:', error);
      return false;
    }

    return true;
  },

  async updateNotes(id: string, notes: string): Promise<boolean> {
    const { error } = await supabase
      .from('bookings')
      .update({ special_requests: notes })
      .eq('id', id);

    if (error) {
      console.error('Not güncellenemedi:', error);
      return false;
    }

    return true;
  }
};
