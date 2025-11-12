import { FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/994501234567"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center"
    >
      <FaWhatsapp className="text-3xl sm:text-4xl" />
    </motion.a>
  )
}

export default WhatsAppButton
