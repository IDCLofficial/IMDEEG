"use client"
import React, { useState } from "react";

type SupportTicketApiResponse = {
  message?: string;
  ticketId?: string;
  deliveryMethod?: "termii" | "wa_me_link";
  waMeLink?: string;
  deliveryError?: string;
  error?: string;
};

const ContactFormSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"termii" | "wa_me_link" | null>(null);
  const [waMeLink, setWaMeLink] = useState<string | null>(null);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitError(null);
    setIsSubmitted(false);
    setTicketId(null);
    setDeliveryMethod(null);
    setWaMeLink(null);
    setDeliveryError(null);

    try {
      const response = await fetch("/api/support-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as SupportTicketApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit your request right now.");
      }

      setIsSubmitted(true);
      setTicketId(data.ticketId || null);
      setDeliveryMethod(data.deliveryMethod || null);
      setWaMeLink(data.waMeLink || null);
      setDeliveryError(data.deliveryError || null);
      setForm({ name: "", email: "", phone: "", message: "" });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 7000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit your request right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#222] text-white p-8 rounded shadow-lg w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-medium mb-2">LET&rsquo;S TALK HERE</h2>
      <p className="mb-6 text-gray-200 text-sm">Feel free to send us a message</p>
      {isSubmitted && (
        <div className="text-sm mb-4 space-y-2">
          {deliveryMethod === "termii" ? (
            <p className="text-green-400">
              Thank you for your message. A support ticket has been sent to the ministry via WhatsApp.
              {ticketId ? ` Ticket ID: ${ticketId}` : ""}
            </p>
          ) : (
            <>
              <p className="text-yellow-300">
                Your ticket was created, but automatic delivery is currently unavailable.
                {ticketId ? ` Ticket ID: ${ticketId}` : ""}
              </p>
              {deliveryError && <p className="text-yellow-200 text-xs">Provider notice: {deliveryError}</p>}
              {waMeLink && (
                <a
                  href={waMeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
                >
                  Send Ticket via WhatsApp
                </a>
              )}
            </>
          )}
        </div>
      )}
      {submitError && (
        <p className="text-red-300 text-sm mb-4">{submitError}</p>
      )}
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
        <input
          type="tel"
          name="phone"
          placeholder="Phone number (optional)"
          value={form.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-gray-300 text-black bg-white focus:outline-none"
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
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-2 rounded font-medium mt-2 cursor-pointer"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContactFormSection; 