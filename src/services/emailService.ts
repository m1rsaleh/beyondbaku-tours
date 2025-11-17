import emailjs from '@emailjs/browser';
import type { Booking } from '../types';

console.log('🔧 EmailJS init ediliyor...');
console.log('Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
console.log('Public Key:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export const emailService = {
  // 1. MÜŞTERİYE REZERVASYON ONAYI
  async sendBookingConfirmation(booking: Booking): Promise<boolean> {
    try {
      console.log('📧 Müşteriye onay email\'i gönderiliyor...', booking.email);

      const templateParams = {
        to_email: booking.email,
        subject: '🎉 Rezervasyon Onayınız - Beyond Baku',
        header_title: '🎉 Rezervasyonunuz Alındı!',
        customer_name: booking.customer_name,
        message: 'Rezervasyonunuz başarıyla oluşturuldu. Ekibimiz en kısa sürede sizinle iletişime geçerek detayları paylaşacaktır.',
        tour_title: booking.tour?.title_tr || 'Tour',
        tour_date: new Date(booking.tour_date).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        guests: booking.guests,
        total_price: booking.total_price,
        footer_message: 'Herhangi bir sorunuz varsa bizimle iletişime geçmekten çekinmeyin.',
        // CTA button (opsiyonel)
        cta_button: '',
        cta_link: '',
        // Admin bilgileri YOK
        email: '',
        phone: '',
        // Status bilgisi YOK
        new_status: ''
      };

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING,
        templateParams
      );

      console.log('✅ Onay email\'i gönderildi:', response.status);
      return true;
    } catch (error: any) {
      console.error('❌ Email hatası:', error);
      return false;
    }
  },

  // 2. ADMIN'E YENİ REZERVASYON BİLDİRİMİ
  async sendNewBookingNotification(booking: Booking): Promise<boolean> {
    try {
      console.log('📧 Admin\'e bildirim gönderiliyor...');

      const templateParams = {
        to_email: import.meta.env.VITE_ADMIN_EMAIL,
        subject: `🔔 Yeni Rezervasyon - ${booking.customer_name}`,
        header_title: '🎉 Yeni Rezervasyon Aldınız!',
        customer_name: '', // Admin email'inde müşteri adı header'da gösterilmez
        message: `${booking.customer_name} adlı müşteriden yeni bir rezervasyon aldınız. Lütfen en kısa sürede müşteri ile iletişime geçin.`,
        tour_title: booking.tour?.title_tr || 'Tour',
        tour_date: new Date(booking.tour_date).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        guests: booking.guests,
        total_price: booking.total_price,
        footer_message: 'Rezervasyon yönetim panelinden tüm detaylara ulaşabilirsiniz.',
        // CTA button
        cta_button: 'Rezervasyon Paneline Git',
        cta_link: 'https://yourdomain.com/admin/bookings',
        // Admin için ekstra bilgiler VAR!
        email: booking.email,
        phone: booking.phone,
        // Status bilgisi YOK
        new_status: ''
      };

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING,
        templateParams
      );

      console.log('✅ Admin bildirimi gönderildi:', response.status);
      return true;
    } catch (error: any) {
      console.error('❌ Admin bildirimi hatası:', error);
      return false;
    }
  },

  // 3. MÜŞTERİYE DURUM DEĞİŞİKLİĞİ
  async sendStatusChangeEmail(
    booking: Booking,
    oldStatus: string,
    newStatus: string
  ): Promise<boolean> {
    try {
      console.log('📧 Durum değişikliği email\'i gönderiliyor...');

      const statusMessages: Record<string, string> = {
        pending: '⏳ Beklemede',
        confirmed: '✅ Onaylandı',
        cancelled: '❌ İptal Edildi',
        completed: '🎉 Tamamlandı'
      };

      const statusEmojis: Record<string, string> = {
        pending: '⏳',
        confirmed: '🎉',
        cancelled: '❌',
        completed: '✨'
      };

      const statusColors: Record<string, string> = {
        pending: '#f59e0b',
        confirmed: '#10b981',
        cancelled: '#ef4444',
        completed: '#8b5cf6'
      };

      const templateParams = {
        to_email: booking.email,
        subject: `🔔 Rezervasyon Durumu Güncellendi - Beyond Baku`,
        header_title: `${statusEmojis[newStatus] || '🔔'} Rezervasyon Durumu Güncellendi`,
        customer_name: booking.customer_name,
        message: `Rezervasyonunuzun durumu "${statusMessages[oldStatus]}" iken "${statusMessages[newStatus]}" olarak güncellendi.`,
        tour_title: booking.tour?.title_tr || 'Tour',
        tour_date: new Date(booking.tour_date).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        guests: booking.guests,
        total_price: booking.total_price,
        footer_message: newStatus === 'confirmed' 
          ? 'Rezervasyonunuz onaylandı! Tur tarihinden önce sizinle iletişime geçeceğiz.' 
          : newStatus === 'cancelled'
          ? 'Rezervasyonunuz iptal edildi. Herhangi bir sorunuz varsa bizimle iletişime geçin.'
          : 'Herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.',
        // CTA button (opsiyonel)
        cta_button: newStatus === 'confirmed' ? 'Rezervasyonumu Görüntüle' : '',
        cta_link: newStatus === 'confirmed' ? 'https://yourdomain.com/my-bookings' : '',
        // Admin bilgileri YOK
        email: '',
        phone: '',
        // Status bilgisi VAR!
        new_status: statusMessages[newStatus] || newStatus
      };

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING,
        templateParams
      );

      console.log('✅ Durum değişikliği email\'i gönderildi:', response.status);
      return true;
    } catch (error: any) {
      console.error('❌ Durum değişikliği email hatası:', error);
      return false;
    }
  },

  // 4. REVIEW TALEBİ
  async sendReviewRequest(booking: Booking): Promise<boolean> {
    try {
      console.log('📧 Review talebi gönderiliyor...');

      const templateParams = {
        to_email: booking.email,
        subject: '⭐ Deneyiminizi Paylaşın - Beyond Baku',
        header_title: '⭐ Deneyiminizi Paylaşır Mısınız?',
        customer_name: booking.customer_name,
        message: `${booking.tour?.title_tr} turuna katıldığınız için çok teşekkür ederiz! Deneyiminizi diğer gezginlerle paylaşarak onlara da yardımcı olabilirsiniz.`,
        tour_title: booking.tour?.title_tr || 'Tour',
        tour_date: new Date(booking.tour_date).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        guests: booking.guests,
        total_price: booking.total_price,
        footer_message: 'Görüşleriniz bizim için çok değerli!',
        // CTA button
        cta_button: '⭐ Yorum Yap',
        cta_link: `https://yourdomain.com/tours/${booking.tour_id}?review=true`,
        // Admin bilgileri YOK
        email: '',
        phone: '',
        new_status: ''
      };

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING,
        templateParams
      );

      console.log('✅ Review talebi gönderildi:', response.status);
      return true;
    } catch (error: any) {
      console.error('❌ Review talebi hatası:', error);
      return false;
    }
  }
};
