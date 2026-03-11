import { Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  Clock,
  ClipboardList,
  MapPin,
  CheckCircle,
  Phone,
  Mail,
  MapPinned,
  Star,
  Smartphone,
  Laptop,
  Headphones,
  BadgeCheck,
  Shield,
  PiggyBank,
  Headset
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center w-full -mt-8">
      {/* Hero Section */}
      <div id="home" className="w-full bg-gradient-to-br from-[#2A1B7A]/5 via-white to-[#F28C3A]/5 py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#F28C3A] font-semibold">Zemen Express</p>
            <h1 className="text-5xl md:text-6xl font-bold text-[#2A1B7A] tracking-tight leading-tight">
              Fast delivery
              <span className="block text-[#F28C3A]">for everyone.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Your trusted partner for parcel and package delivery. We connect customers with reliable drivers for seamless logistics.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-[#F28C3A] text-white rounded-2xl font-semibold text-lg hover:bg-[#F28C3A]/90 transition-all shadow-lg shadow-[#F28C3A]/30">
                Get Started Now
              </Link>
              <Link to="/store" className="w-full sm:w-auto px-8 py-4 bg-white text-[#2A1B7A] border-2 border-[#2A1B7A] rounded-2xl font-semibold text-lg hover:bg-[#2A1B7A]/5 transition-all">
                Visit ZED Store
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 h-16 w-28 rounded-full bg-[#F28C3A]/20" />
            <div className="absolute -bottom-8 right-6 h-3 w-16 rounded-full bg-[#F28C3A]" />
            <div className="rounded-[32px] bg-white shadow-xl border border-gray-100 p-6">
              <div className="rounded-3xl bg-gradient-to-br from-[#F28C3A]/20 to-[#2A1B7A]/10 p-6">
                <div className="h-48 rounded-2xl bg-white/80 border border-white shadow-inner flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-[#F28C3A]/20 flex items-center justify-center">
                    <Truck className="h-10 w-10 text-[#F28C3A]" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-2.5 w-3/4 rounded-full bg-[#2A1B7A]/15" />
                  <div className="h-2.5 w-1/2 rounded-full bg-[#2A1B7A]/15" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div id="services" className="w-full max-w-6xl px-4 py-24">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2A1B7A]">Seamless Logistics Services</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Reliable parcel delivery with fast dispatch, secure handling, and transparent tracking for every order.
          </p>
        </div>
        <div className="bg-[#FFF4EB] rounded-[36px] p-8 md:p-10 border border-[#F28C3A]/20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
            <div className="flex items-center justify-center">
              <div className="h-56 w-full max-w-sm rounded-3xl bg-white/80 border border-white shadow-inner flex items-center justify-center">
                <div className="h-28 w-28 rounded-full bg-[#F28C3A]/20 flex items-center justify-center">
                  <Truck className="h-12 w-12 text-[#F28C3A]" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#2A1B7A]">Next‑Day Delivery</h3>
                <p className="text-gray-500 mt-2">
                  Have your order delivered within 24 hours with our nationwide network.
                </p>
                <p className="text-[#F28C3A] font-semibold mt-3">Learn more →</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#2A1B7A]">Same‑Day Delivery</h3>
                <p className="text-gray-500 mt-2">
                  Priority dispatch for urgent parcels, with delivery in hours.
                </p>
                <p className="text-[#F28C3A] font-semibold mt-3">Learn more →</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="w-full max-w-6xl px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A1B7A]">What Our Customers Say</h2>
          <p className="text-gray-500 mt-3">Real experiences from across Addis Ababa.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'Fast delivery from Bole to Summit in just 45 minutes!',
              name: 'Abebe K.'
            },
            {
              quote: 'My documents arrived safely. Great service!',
              name: 'Meron T.'
            },
            {
              quote: 'The tracking feature is amazing. I knew exactly when my package would arrive.',
              name: 'Dawit H.'
            }
          ].map((review) => (
            <div key={review.name} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex gap-1 text-[#F28C3A]">
                <Star className="h-4 w-4 fill-[#F28C3A]" />
                <Star className="h-4 w-4 fill-[#F28C3A]" />
                <Star className="h-4 w-4 fill-[#F28C3A]" />
                <Star className="h-4 w-4 fill-[#F28C3A]" />
                <Star className="h-4 w-4 fill-[#F28C3A]" />
              </div>
              <p className="mt-4 text-gray-600">“{review.quote}”</p>
              <p className="mt-4 text-[#2A1B7A] font-semibold">— {review.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="w-full bg-[#2A1B7A]/5 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A1B7A]">How It Works</h2>
            <p className="text-gray-500 mt-3">Simple steps to send a parcel fast.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 text-[#F28C3A] font-semibold">
                <Smartphone className="h-6 w-6" />
                PLACE ORDER
              </div>
              <p className="mt-4 text-gray-600">Request delivery in 3 simple clicks.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 text-[#F28C3A] font-semibold">
                <Truck className="h-6 w-6" />
                QUICK PICKUP
              </div>
              <p className="mt-4 text-gray-600">Driver arrives in 15-30 minutes.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 text-[#F28C3A] font-semibold">
                <MapPin className="h-6 w-6" />
                TRACK IN REAL‑TIME
              </div>
              <p className="mt-4 text-gray-600">Follow your parcel from pickup to delivery.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Customers Love Zemen */}
      <div className="w-full max-w-6xl px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A1B7A]">Why Customers Love Zemen</h2>
          <p className="text-gray-500 mt-3">Reasons people choose us every day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: <Clock className="h-5 w-5 text-[#F28C3A]" />, text: 'Same‑day delivery — Get it delivered today' },
            { icon: <ShieldCheck className="h-5 w-5 text-[#F28C3A]" />, text: 'Insured packages — Your items are protected' },
            { icon: <MapPin className="h-5 w-5 text-[#F28C3A]" />, text: 'Real‑time tracking — Know where your package is' },
            { icon: <Shield className="h-5 w-5 text-[#F28C3A]" />, text: 'Safe & secure — Verified drivers only' },
            { icon: <PiggyBank className="h-5 w-5 text-[#F28C3A]" />, text: 'Best prices — Affordable delivery rates' },
            { icon: <Headset className="h-5 w-5 text-[#F28C3A]" />, text: '24/7 support — We’re here to help' }
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5">
              <div className="h-10 w-10 rounded-full bg-[#F28C3A]/15 flex items-center justify-center">
                {item.icon}
              </div>
              <p className="text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="px-6 py-3 rounded-full border border-[#F28C3A] text-[#F28C3A] font-semibold hover:bg-[#F28C3A]/10 transition-colors">
            Read more reviews
          </button>
        </div>
      </div>

      {/* ZED Store */}
      <div id="zed-store" className="w-full max-w-6xl px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A1B7A]">Shop From ZED Store</h2>
          <p className="text-gray-500 mt-3">Top devices and accessories delivered fast.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-[#F28C3A]/15 flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-[#F28C3A]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#2A1B7A]">Phones</h3>
            <p className="text-gray-500">Latest smartphones</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-[#F28C3A]/15 flex items-center justify-center">
              <Laptop className="h-6 w-6 text-[#F28C3A]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#2A1B7A]">Laptops</h3>
            <p className="text-gray-500">Best deals on all brands</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-[#F28C3A]/15 flex items-center justify-center">
              <Headphones className="h-6 w-6 text-[#F28C3A]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#2A1B7A]">Accessories</h3>
            <p className="text-gray-500">Headphones, chargers, cases</p>
          </div>
        </div>
        <div className="mt-6 bg-[#FFF4EB] border border-[#F28C3A]/20 rounded-3xl p-6 text-center text-[#2A1B7A] font-semibold">
          ⚡ Fast delivery from ZED Store to your door
        </div>
        <div className="text-center mt-8">
          <Link to="/store" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F28C3A] text-white font-semibold">
            Visit ZED Store →
          </Link>
        </div>
      </div>

      {/* Coverage */}
      <div id="coverage" className="w-full max-w-6xl px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A1B7A]">We Cover All Addis Ababa</h2>
          <p className="text-gray-500 mt-3">Available across all major districts and sub‑cities.</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-gray-700">
            {[
              'Bole',
              'Kazanchis',
              'Piazza',
              'Mexico',
              'Merkato',
              'Sarbet',
              'CMC',
              'Ayat',
              'Gerji',
              'Summit',
              '4 Kilo',
              '6 Kilo',
              '+ All Sub‑Cities'
            ].map((place) => (
              <div key={place} className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-[#F28C3A]" />
                <span>{place}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Easy Steps */}
      <div id="steps" className="w-full bg-[#2A1B7A]/5 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2A1B7A] mb-10">
            Easy Steps to use the Service
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-5">
              <div className="bg-[#F28C3A]/15 p-4 rounded-2xl">
                <ClipboardList className="h-6 w-6 text-[#F28C3A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2A1B7A]">Create a request</h3>
                <p className="text-gray-500">
                  Enter pickup and drop-off details and package size, then confirm your order.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="bg-[#F28C3A]/15 p-4 rounded-2xl">
                <MapPin className="h-6 w-6 text-[#F28C3A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2A1B7A]">Schedule pickup</h3>
                <p className="text-gray-500">
                  Choose a time and we dispatch the best driver for your route.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="bg-[#F28C3A]/15 p-4 rounded-2xl">
                <Truck className="h-6 w-6 text-[#F28C3A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2A1B7A]">Track in real time</h3>
                <p className="text-gray-500">
                  Follow your parcel from pickup to delivery with live status updates.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="bg-[#F28C3A]/15 p-4 rounded-2xl">
                <CheckCircle className="h-6 w-6 text-[#F28C3A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2A1B7A]">Delivered safely</h3>
                <p className="text-gray-500">
                  Get confirmation instantly and share feedback with our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivering Possibilities */}
      <div className="w-full max-w-6xl px-4 py-20">
        <h2 className="text-center text-4xl md:text-5xl font-bold text-[#2A1B7A]">
          Delivering Possibilities Since 2017
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8">
          <div className="rounded-[36px] bg-gradient-to-r from-[#F28C3A] to-[#F2A14A] text-white p-10 md:p-12 shadow-lg">
            <div className="text-4xl md:text-5xl font-bold">350,000</div>
            <div className="mt-2 text-xl font-semibold">Packages Delivered</div>
            <p className="mt-3 text-white/90">
              Thousands of successful deliveries completed with care and precision.
            </p>
          </div>
          <div className="rounded-[36px] bg-gradient-to-r from-[#F28C3A] to-[#F2A14A] text-white p-10 md:p-12 shadow-lg">
            <div className="text-4xl md:text-5xl font-bold">7+</div>
            <div className="mt-2 text-xl font-semibold">Years of Experience</div>
            <p className="mt-3 text-white/90">
              Deep local expertise built across years of reliable service.
            </p>
          </div>
        </div>
      </div>

      {/* Coverage CTA */}
      <div className="w-full px-4 pb-24">
        <div
          className="max-w-6xl mx-auto rounded-[36px] p-12 md:p-16 text-white relative overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgba(242,140,58,0.35), transparent 35%), radial-gradient(circle at 85% 70%, rgba(42,27,122,0.35), transparent 40%), linear-gradient(120deg, #1f1a2e 0%, #2b223b 100%)',
          }}
        >
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold">Delivering Possibilities</h2>
            <p className="mt-4 text-white/80 text-lg">
              Have your packages delivered anywhere in Addis Ababa with Zemen Express.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 rounded-full bg-white text-[#2A1B7A] font-semibold">
                Call 670
              </button>
              <button className="px-8 py-3 rounded-full bg-[#F28C3A] text-white font-semibold">
                Get a quote →
              </button>
            </div>
          </div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white_0,transparent_35%),radial-gradient(circle_at_70%_70%,white_0,transparent_35%)]" />
        </div>
      </div>

      {/* Contact Us */}
      <div id="contact" className="w-full max-w-6xl px-4 py-24">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[3px] w-16 bg-[#F28C3A] rounded-full" />
          <p className="text-sm uppercase tracking-[0.25em] text-[#F28C3A] font-semibold">Contact Us</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#2A1B7A] mb-4">
          Let&apos;s get in touch
        </h2>
        <p className="text-gray-500 max-w-2xl">
          Reach out to our customer service team, we&apos;ll be in touch shortly.
        </p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border-b-2 border-gray-300 pb-3 text-lg outline-none focus:border-[#F28C3A] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border-b-2 border-gray-300 pb-3 text-lg outline-none focus:border-[#F28C3A] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Message</label>
              <textarea
                rows={3}
                placeholder="Your message here"
                className="w-full border-b-2 border-gray-300 pb-3 text-lg outline-none focus:border-[#F28C3A] transition-colors resize-none"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-[#F28C3A] to-[#F05A28] text-white font-semibold shadow-lg shadow-[#F28C3A]/30 hover:opacity-90 transition-opacity"
            >
              Send
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">➜</span>
            </button>
          </form>

          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-[#2A1B7A] mb-2">For more information</h3>
              <p className="text-gray-500">
                Reach out to our customer service team, we&apos;ll be in touch shortly.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-[#2A1B7A] mb-3">Get to Know Us</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>Be a Partner</li>
                  <li>Restaurant</li>
                  <li>LinkedIn</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#2A1B7A] mb-3">Let us help you</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>Account Details</li>
                  <li>Help</li>
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 text-gray-600">
              <p>Phone : 9533, Email : support@beudelivery.com</p>
              <p>Address : Bole, Addis Ababa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
