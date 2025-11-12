import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=1920',
    title: 'Azerbaycan\'ın Kalbini Keşfedin',
    subtitle: 'Bakü\'den Gabala\'ya unutulmaz anılar'
  },
  {
    image: 'https://images.unsplash.com/photo-1541873676-a18131494184?w=1920',
    title: 'Görkemli Dağlar ve Vadiler',
    subtitle: 'Doğanın büyüsüne kapılın'
  },
  {
    image: 'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=1920',
    title: 'Tarihi Keşfet',
    subtitle: 'Antik şehirler ve kültürel hazineler'
  }
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setCurrent((current + 1) % slides.length)
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length)

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative h-full flex items-center justify-center text-center px-4 sm:px-6">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
                {slides[current].title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8">
                {slides[current].subtitle}
              </p>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gold hover:bg-gold/90 text-white font-bold rounded-full transition text-base sm:text-lg">
                Turları Keşfet
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition z-10"
      >
        <FaChevronLeft className="text-white text-lg sm:text-xl" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition z-10"
      >
        <FaChevronRight className="text-white text-lg sm:text-xl" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition ${
              i === current ? 'bg-gold' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
