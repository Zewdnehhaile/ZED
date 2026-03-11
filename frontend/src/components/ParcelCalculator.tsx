import React, { useState } from 'react';
import { Package, MapPin, Weight, DollarSign, Clock, ShieldCheck, Tag, Info } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ParcelCalculatorProps {
  onConfirm: (data: any) => void;
}

export default function ParcelCalculator({ onConfirm }: ParcelCalculatorProps) {
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>('medium');
  const [weight, setWeight] = useState<string>('1');
  const [packageType, setPackageType] = useState('document');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [serviceType, setServiceType] = useState<'express' | 'same_day' | 'next_day'>('same_day');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Mock distance calculation
  const distance = pickup && dropoff ? 12.5 : 0; // km

  const calculatePrice = () => {
    const baseFare = 50;
    const perKmRate = 10;
    const distanceFare = distance * perKmRate;
    
    const weightVal = Number(weight) || 0;
    const weightMultiplier = weightVal * 5;

    const sizeMultipliers = { small: 1, medium: 1.5, large: 2, xlarge: 3 };
    const sizeMultiplier = sizeMultipliers[size];

    let subtotal = (baseFare + distanceFare + weightMultiplier) * sizeMultiplier;

    const insuranceCost = hasInsurance ? subtotal * 0.05 : 0; // 5% of subtotal
    const expressFee = serviceType === 'express' ? 100 : 0;
    
    // Peak hour surcharge mock (e.g., 20% extra)
    const peakHourSurcharge = new Date().getHours() >= 16 && new Date().getHours() <= 19 ? subtotal * 0.2 : 0;

    const totalBeforeDiscount = subtotal + insuranceCost + expressFee + peakHourSurcharge;
    const finalTotal = Math.max(0, totalBeforeDiscount - discount);
    const tax = finalTotal * 0.15; // 15% VAT

    return {
      baseFare,
      distanceFare,
      weightMultiplier,
      sizeMultiplier,
      insuranceCost,
      expressFee,
      peakHourSurcharge,
      subtotal,
      discount,
      tax,
      finalTotal: finalTotal + tax
    };
  };

  const pricing = calculatePrice();

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'ZEMEN10') {
      setDiscount(50);
    } else {
      setDiscount(0);
      alert('Invalid promo code');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      size, weight, packageType, pickup, dropoff, serviceType, hasInsurance, pricing
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-[#2A1B7A] mb-6 flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-[#F28C3A]" /> Parcel Calculator
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" /> Pickup Location
              </label>
              <Input required value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Enter pickup address" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" /> Drop-off Location
              </label>
              <Input required value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Enter drop-off address" />
            </div>
          </div>

          {/* Parcel Details */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Parcel Size</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['small', 'medium', 'large', 'xlarge'].map((s) => (
                <div 
                  key={s}
                  onClick={() => setSize(s as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all ${size === s ? 'border-[#F28C3A] bg-[#F28C3A]/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <Package className={`h-8 w-8 mx-auto mb-2 ${size === s ? 'text-[#F28C3A]' : 'text-gray-400'}`} />
                  <span className="capitalize font-medium text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Weight className="h-4 w-4 text-gray-400" /> Weight (kg)
              </label>
              <Input type="number" step="0.1" min="0.1" required value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="1.0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Package Type</label>
              <select 
                className="w-full h-12 rounded-xl border border-gray-300 px-3 bg-white"
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
              >
                <option value="document">Document</option>
                <option value="electronics">Electronics</option>
                <option value="food">Food</option>
                <option value="fragile">Fragile</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Service Options */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Service Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'express', label: 'Express (90 min)', icon: Clock },
                { id: 'same_day', label: 'Same Day', icon: Clock },
                { id: 'next_day', label: 'Next Day', icon: Clock }
              ].map((s) => (
                <div 
                  key={s.id}
                  onClick={() => setServiceType(s.id as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${serviceType === s.id ? 'border-[#2A1B7A] bg-[#2A1B7A]/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <s.icon className={`h-5 w-5 ${serviceType === s.id ? 'text-[#2A1B7A]' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <input 
              type="checkbox" 
              id="insurance"
              className="w-5 h-5 rounded text-[#F28C3A] focus:ring-[#F28C3A]"
              checked={hasInsurance}
              onChange={(e) => setHasInsurance(e.target.checked)}
            />
            <label htmlFor="insurance" className="flex-1 flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#F28C3A]" /> Add Package Insurance
              </span>
              <span className="text-xs text-gray-500">5% of subtotal</span>
            </label>
          </div>
        </div>

        {/* Price Breakdown Sidebar */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit space-y-6">
          <h3 className="font-bold text-lg text-[#2A1B7A]">Price Breakdown</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Base Fare</span>
              <span>{pricing.baseFare.toFixed(2)} ETB</span>
            </div>
            {distance > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Distance ({distance} km)</span>
                <span>{pricing.distanceFare.toFixed(2)} ETB</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Weight Surcharge</span>
              <span>{pricing.weightMultiplier.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Size Multiplier</span>
              <span>x{pricing.sizeMultiplier}</span>
            </div>
            {pricing.expressFee > 0 && (
              <div className="flex justify-between text-[#F28C3A]">
                <span>Express Fee</span>
                <span>{pricing.expressFee.toFixed(2)} ETB</span>
              </div>
            )}
            {pricing.peakHourSurcharge > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Peak Hour Surcharge</span>
                <span>{pricing.peakHourSurcharge.toFixed(2)} ETB</span>
              </div>
            )}
            {pricing.insuranceCost > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Insurance</span>
                <span>{pricing.insuranceCost.toFixed(2)} ETB</span>
              </div>
            )}
            
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between font-medium text-gray-800">
                <span>Subtotal</span>
                <span>{pricing.subtotal.toFixed(2)} ETB</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="pt-4 space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Code</label>
              <div className="flex gap-2">
                <Input 
                  value={promoCode} 
                  onChange={(e) => setPromoCode(e.target.value)} 
                  placeholder="ZEMEN10" 
                  className="h-10 text-sm"
                />
                <Button type="button" onClick={handleApplyPromo} className="h-10 px-4 bg-gray-200 text-gray-700 hover:bg-gray-300">
                  Apply
                </Button>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 pt-2">
                  <span>Discount</span>
                  <span>-{discount.toFixed(2)} ETB</span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-gray-600 pt-2">
              <span>VAT (15%)</span>
              <span>{pricing.tax.toFixed(2)} ETB</span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-[#2A1B7A]">{pricing.finalTotal.toFixed(2)} ETB</span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-[#F28C3A] hover:bg-[#F28C3A]/90 text-white rounded-xl font-bold text-lg">
            Confirm Request
          </Button>
        </div>
      </form>
    </div>
  );
}
