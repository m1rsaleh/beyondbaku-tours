import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.VITE_GMAIL_USER,
    pass: process.env.VITE_GMAIL_APP_PASSWORD?.replace(/\s/g, '')
  }
});

async function testEmail() {
  console.log('📧 Gmail Email Testi\n');
  
  console.log('📍 Bilgiler:');
  console.log('  Gmail:', process.env.VITE_GMAIL_USER);
  console.log('  App Password:', process.env.VITE_GMAIL_APP_PASSWORD ? '✅ Var' : '❌ Yok');
  console.log('');
  
  try {
    const info = await transporter.sendMail({
      from: `"Beyond Baku" <${process.env.VITE_GMAIL_USER}>`,
      to: process.env.VITE_ADMIN_EMAIL,
      subject: '🎉 NodeMailer Test - Beyond Baku',
      html: `
        <div style="font-family: Arial; padding: 40px; background: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px;">
            <h1 style="color: #10b981;">🎉 TEST BAŞARILI!</h1>
            <p>NodeMailer + Gmail email sistemi <strong>TAM OLARAK ÇALIŞIYOR!</strong></p>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #059669;">✅ Başarılı:</h3>
              <p>✓ Gmail SMTP bağlantısı</p>
              <p>✓ Email gönderimi</p>
              <p>✓ Template rendering</p>
            </div>
            <p><strong>Gönderilme:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          </div>
        </div>
      `
    });

    console.log('✅ EMAIL GÖNDERİLDİ!\n');
    console.log('📋 Detaylar:');
    console.log('  Message ID:', info.messageId);
    console.log('  Alıcı:', process.env.VITE_ADMIN_EMAIL);
    console.log('');
    console.log('🔍 Gmail\'ini kontrol et!');
    console.log('   → Inbox\'ta olmalı (Spam değil!)');
    
  } catch (error: any) {
    console.log('❌ HATA:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Çözüm:');
      console.log('  1. Gmail App Password\'u doğru kopyaladın mı?');
      console.log('  2. 2-Step Verification aktif mi?');
      console.log('  3. .env dosyasında boşluk var mı kontrol et');
    }
  }
}

testEmail();
