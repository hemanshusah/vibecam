"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { X, Heart, Loader2 } from "lucide-react";

type SupportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Extends Window to avoid TS error: Property 'Razorpay' does not exist on type 'Window & typeof globalThis'.
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [amount, setAmount] = useState<number | string>(100);
  const presetAmounts = [100, 500, 1000];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Razorpay script when modal opens
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = async () => {
    setError(null);
    const numericAmount = Number(amount);
    
    if (isNaN(numericAmount) || numericAmount < 1 || numericAmount > 1000000) {
      setError("Please enter a valid amount between ₹1 and ₹1,000,000.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. Open Razorpay Checkout popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use Razorpay Key ID
        amount: orderData.amount, // Amount in paisa
        currency: orderData.currency,
        name: "VibeCam",
        description: "Support VibeCam",
        order_id: orderData.id,
        handler: function (response: any) {
          // You could verify the signature here if you want
          alert(`Payment Successful! Thank you for your support. Payment ID: ${response.razorpay_payment_id}`);
          onClose();
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#000000", // Using dark theme to match VibeCam
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on("payment.failed", function (response: any) {
        setError(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err: any) {
        setError(err.message || "Something went wrong.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in pointer-events-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl flex flex-col items-center">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-muted hover:text-text transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/20 flex items-center justify-center mb-6">
          <Heart size={32} className="text-[#FF0000] fill-[#FF0000]" />
        </div>

        <h3 className="font-syne font-bold text-2xl text-text mb-2 text-center">Support VibeCam</h3>
        <p className="font-mono text-xs text-muted text-center mb-8 px-4">
          All processing is free. If you like what we build, consider dropping a tip.
        </p>

        {error && (
          <div className="w-full mb-6 p-3 rounded-xl bg-red/10 border border-red/20 font-mono text-xs text-red text-center shadow-inner">
            {error}
          </div>
        )}

        <div className="w-full space-y-6">
          {/* Preset Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`py-3 rounded-xl font-mono text-sm font-bold transition-all ${
                  amount === preset 
                    ? "bg-accent text-surface shadow-md" 
                    : "bg-bg border border-border text-text hover:border-accent hover:text-accent"
                }`}
              >
                ₹ {preset}
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="font-mono text-lg text-muted">₹</span>
            </div>
            <input
              type="number"
              min="1"
              max="1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Custom Amount"
              className="w-full pl-10 pr-4 py-4 bg-bg border border-border rounded-xl font-mono text-xl text-text font-bold text-center placeholder:text-muted/50 placeholder:font-normal outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] font-syne font-bold text-base rounded-xl hover:bg-[#FF0000] hover:text-white transition-colors shadow-lg shadow-[#FF0000]/10 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Pay securely with Razorpay <Heart size={16} className="group-hover:fill-white transition-colors" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
