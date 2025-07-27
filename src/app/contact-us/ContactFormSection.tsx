"use client"
import React, { useState } from "react";

const ContactFormSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle form submission (e.g., send to API)
  };

  return (
    <div className="bg-[#222] text-white p-8 rounded shadow-lg w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-medium mb-2">LET&apos;S TALK HERE</h2>
      <p className="mb-6 text-gray-200 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-gray-300 text-black bg-white focus:outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-gray-300 text-black bg-white focus:outline-none"
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-gray-300 text-black bg-white focus:outline-none min-h-[100px]"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium mt-2 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactFormSection; 