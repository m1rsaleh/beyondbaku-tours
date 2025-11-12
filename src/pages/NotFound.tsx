import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-dark-blue to-primary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="text-9xl sm:text-[200px] font-bold text-gold mb-8"
        >
          404
        </motion.div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6">
          Sayfa Bulunamadı
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold/90 text-white font-bold rounded-full transition shadow-xl"
          >
            <FaHome />
            Ana Sayfaya Dön
          </Link>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-full border-2 border-white/30 transition"
          >
            Turları Keşfet
          </Link>
        </div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-12 text-6xl"
        >
          🧭
        </motion.div>
      </motion.div>
    </div>
  )
}
