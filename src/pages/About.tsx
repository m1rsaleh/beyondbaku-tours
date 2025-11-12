import { motion } from 'framer-motion'
import { FaAward, FaUsers, FaGlobeAmericas, FaHeart, FaCheckCircle } from 'react-icons/fa'

export default function About() {
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=1920&q=80"
            alt="About Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-secondary/90"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold font-semibold mb-3 sm:mb-4">
              About BeyondBaku
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 sm:mb-6">
              Hayallerinizi <span className="text-gold">Gerçeğe</span> Dönüştürüyoruz
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4">
              Azerbaycan'ın kalbinde, unutulmaz anılar yaratıyoruz
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-gold/20 to-primary/20 rounded-3xl blur-2xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
                  alt="Our Story"
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-primary mb-6">
                Hikayemiz
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  2015 yılında, Azerbaycan'ın eşsiz güzelliklerini dünyaya tanıtma tutkusuyla 
                  yola çıktık. BeyondBaku, sadece bir tur şirketi değil; her seyahati özel kılan, 
                  unutulmaz anılar yaratan bir deneyim platformudur.
                </p>
                <p>
                  Bakü'nün modern mimarisinden Quba'nın mistik dağlarına, Şəki'nin tarihi 
                  atmosferinden Qəbələ'nin doğal güzelliklerine kadar, Azerbaycan'ın her köşesini 
                  özenle keşfettik ve sizin için en iyi rotaları tasarladık.
                </p>
                <p>
                  Bugün, 1000'den fazla mutlu misafirle, Azerbaycan turizminde premium standartların 
                  öncüsü olmaktan gurur duyuyoruz. Her tur, özenle seçilmiş deneyimler, profesyonel 
                  rehberler ve kusursuz hizmet anlayışımızla hazırlanıyor.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
<section className="py-16 sm:py-24 bg-white">
  <div className="container mx-auto px-4 sm:px-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12 sm:mb-16"
    >
      <h2 className="text-4xl sm:text-5xl font-serif font-bold text-primary mb-4">
        Rakamlarla <span className="text-gold">BeyondBaku</span>
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Başarımız, mutlu misafirlerimizin sayısında gizli
      </p>
    </motion.div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { icon: FaUsers, number: '1000+', label: 'Mutlu Misafir' },
        { icon: FaGlobeAmericas, number: '50+', label: 'Benzersiz Destinasyon' },
        { icon: FaAward, number: '10+', label: 'Yıl Deneyim' },
        { icon: FaHeart, number: '4.9/5', label: 'Müşteri Memnuniyeti' }
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -10 }}
          className="text-center group"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl group-hover:blur-2xl transition duration-500"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300">
              <stat.icon className="text-gold text-3xl" />
            </div>
          </div>
          <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-2">{stat.number}</h3>
          <p className="text-gray-600">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Values Section */}
<section className="py-16 sm:py-24 bg-gradient-to-br from-cream via-white to-cream">
  <div className="container mx-auto px-4 sm:px-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12 sm:mb-16"
    >
      <h2 className="text-4xl sm:text-5xl font-serif font-bold text-primary mb-4">
        Değerlerimiz
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Bizi özel kılan prensipler
      </p>
    </motion.div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          title: 'Mükemmellik',
          description: 'Her detayda kusursuzluk arayışı',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          )
        },
        {
          title: 'Şeffaflık',
          description: 'Açık ve dürüst iletişim',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )
        },
        {
          title: 'Yenilikçilik',
          description: 'Sürekli gelişen deneyimler',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        },
        {
          title: 'Sorumluluk',
          description: 'Çevre ve topluma saygı',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        {
          title: 'Müşteri Odaklılık',
          description: 'Sizin memnuniyetiniz önceliğimiz',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )
        },
        {
          title: 'Yerel Değerler',
          description: 'Kültürel mirasa saygı',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )
        }
      ].map((value, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition"
        >
          <div className="text-gold group-hover:text-primary transition-colors mb-4">
            {value.icon}
          </div>
          <h3 className="text-2xl font-bold text-primary mb-3">{value.title}</h3>
          <p className="text-gray-600">{value.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Team Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-primary mb-4">
              Ekibimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Deneyimli ve tutkulu profesyonellerimiz
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Aytən Məmmədova',
                role: 'Kurucu & CEO',
                image: 'https://i.pravatar.cc/400?img=5',
                bio: '15 yıllık turizm deneyimi'
              },
              {
                name: 'Elvin Quliyev',
                role: 'Tur Operasyon Müdürü',
                image: 'https://i.pravatar.cc/400?img=12',
                bio: 'Lider tur organizasyonları'
              },
              {
                name: 'Nigar Həsənova',
                role: 'Baş Rehber',
                image: 'https://i.pravatar.cc/400?img=9',
                bio: '10+ yıl rehberlik tecrübesi'
              },
              {
                name: 'Rəşad Əliyev',
                role: 'Müşteri İlişkileri',
                image: 'https://i.pravatar.cc/400?img=13',
                bio: '24/7 destek uzmanı'
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-cream rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-primary mb-2">{member.name}</h3>
                    <p className="text-gold font-semibold mb-2">{member.role}</p>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary via-dark-blue to-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              Bir Sonraki Maceranız <span className="text-gold">Sizi Bekliyor</span>
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Unutulmaz bir Azerbaycan deneyimi için bizimle iletişime geçin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/tours"
                className="px-8 py-4 bg-gold hover:bg-gold/90 text-white font-bold rounded-full transition text-lg"
              >
                Turları Keşfet
              </a>
              <a
                href="/contact"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-full border-2 border-white/30 transition text-lg"
              >
                İletişime Geç
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
