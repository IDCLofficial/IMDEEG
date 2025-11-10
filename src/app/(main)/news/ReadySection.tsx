export default function ReadySection() {
  return (
    <section className="w-full bg-[#232e3e] py-14 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg px-8 py-10 w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Ready to Experience the New Imo?</h2>
          <p className="text-gray-600">Discover our vision for an inclusive, empowered, and connected state.</p>
        </div>
        <button className="bg-green-600 text-white px-8 py-3 rounded font-semibold">Contact Us</button>
      </div>
    </section>
  );
} 