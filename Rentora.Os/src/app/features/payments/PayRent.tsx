import { useState } from "react";
import { Calendar, Clock, CreditCard, Info, Lock, Phone, Smartphone } from "lucide-react";
import { BackButton, GlassCard, PageHeader, Spinner } from "@/app/components";
import { currentHome } from "@/app/data/mock-data";
import { useTheme } from "@/app/theme";
import type { NavState } from "@/app/types";

export function PayRent({ onNav }: { onNav: (nav: NavState) => void }) {
  const theme = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<"mpesa" | "airtel" | "card">("mpesa");
  const [phone, setPhone] = useState("0712 345 678");
  const [cardNum, setCardNum] = useState("");
  const [paying, setPaying] = useState(false);

  const total = currentHome.rentAmount + currentHome.serviceCharge;

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => onNav({ page: "payment-success" }), 1800);
  };

  const methods = [
    { id: "mpesa" as const, label: "M-Pesa", icon: Smartphone, color: "green", desc: "STK Push to phone" },
    { id: "airtel" as const, label: "Airtel Money", icon: Phone, color: "red", desc: "Airtel wallet" },
    { id: "card" as const, label: "Bank Card", icon: CreditCard, color: "blue", desc: "Visa / Mastercard" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => onNav({ page: "dashboard" })} />
      <PageHeader title="Pay Rent" subtitle="Secure payment portal" accent="indigo" />

      {/* Summary */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-white/50 mb-1">Paying for</p>
            <p className="font-medium text-white/90">{currentHome.unit}</p>
            <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> Due {currentHome.rentDue}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-2">
              <Clock className="w-3 h-3" /> {currentHome.daysUntilDue} days left
            </div>
          </div>
        </div>
        <div className="space-y-3 border-t border-white/[0.05] pt-5">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Monthly Rent</span>
            <span className="text-white/90">Kes {currentHome.rentAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Service Charge</span>
            <span className="text-white/90">Kes {currentHome.serviceCharge.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-white/[0.05]">
            <span className="font-medium text-white/90">Total Due</span>
            <span className="text-xl font-light text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Kes {total.toLocaleString()}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Payment Method */}
      <div className="mb-6">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Payment Method</p>
        <div className="grid grid-cols-3 gap-3">
          {methods.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setSelectedMethod(id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                selectedMethod === id
                  ? "bg-white/[0.08] border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                  : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]"
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${selectedMethod === id ? "text-blue-400" : "text-white/50"}`} />
              <p className="text-sm font-medium text-white/90">{label}</p>
              <p className="text-xs text-white/40 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <GlassCard className="p-6 mb-6">
        {selectedMethod !== "card" ? (
          <div>
            <label className="text-sm font-medium text-white/60 block mb-3">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] transition-all"
                placeholder="07XX XXX XXX"
              />
            </div>
            <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" /> An STK push will be sent to this number
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/60 block mb-3">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={cardNum}
                  onChange={(e) => setCardNum(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
                  placeholder="4242 4242 4242 4242"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white/60 block mb-3">Expiry</label>
                <input type="text" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all" placeholder="MM / YY" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 block mb-3">CVV</label>
                <input type="text" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all" placeholder="•••" />
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Security note */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <Lock className="w-4 h-4 text-teal-400/60" />
        <p className="text-xs text-white/30">Payments are encrypted and secured via PCI-DSS standards</p>
      </div>

      <button
        onClick={handlePay}
        disabled={paying}
        className="w-full py-4 rounded-2xl text-white font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        style={{ background: theme.ctaBlue, boxShadow: `0 0 30px ${theme.glow1}` }}
      >
        {paying ? (
          <>
            <Spinner />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pay Kes {total.toLocaleString()}
          </>
        )}
      </button>
    </main>
  );
}
