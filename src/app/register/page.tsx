"use client";

import { motion } from "framer-motion";

export default function ContactForm() {
  return (
    <motion.form
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-4 max-w-md mx-auto p-4 bg-white rounded shadow"
      onSubmit={(e) => {
        e.preventDefault();
        // handle submit logic here
      }}
    >
      <input
        type="text"
        placeholder="Your Name"
        className="p-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        className="p-2 border rounded"
        required
      />
      <textarea
        placeholder="Your Message"
        className="p-2 border rounded"
        required
      ></textarea>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        Send Message
      </motion.button>
    </motion.form>
  );
}
