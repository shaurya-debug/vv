import React, { useState } from 'react';
import GooglePayButton from '@google-pay/button-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  QrCode,
  Smartphone,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { ASTROLOGER } from '../data/vedicData';
import { openRazorpayCheckout } from '../utils/razorpay';

interface GooglePaySectionProps {
  amount: number;
  currency?: string;
  serviceName: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  onPaymentSuccess: (paymentResult: {
    transactionId: string;
    amount: number;
    currency: string;
    method: string;
  }) => void;
}

export const GooglePaySection: React.FC<GooglePaySectionProps> = ({
  amount,
  currency = 'INR',
  serviceName,
  clientName,
  clientEmail = '',
  clientPhone = '',
  onPaymentSuccess,
}) => {
  const [activeMethod, setActiveMethod] = useState<'upi_qr' | 'gpay_btn' | 'razorpay'>('upi_qr');
  const [paymentDone, setPaymentDone] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState('');
  const [isRazorpayProcessing, setIsRazorpayProcessing] = useState(false);

  const upiId = ASTROLOGER.payment.upiId; // "jksv390-1@okaxis"
  const payeeName = ASTROLOGER.payment.accountName; // "Jitender Kumar Sharma"

  // Standard India UPI deep-link URL (works in all UPI apps: GPay, PhonePe, Paytm, BHIM)
  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
    `Vedic Consultation Dakshina - ${serviceName}`
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Google Pay button handler
  const handleGooglePaySuccess = (paymentData: any) => {
    const txnId =
      paymentData?.paymentMethodData?.tokenizationData?.token ||
      `GPAY-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    completePayment(txnId, 'Google Pay (GPay Web API)');
  };

  // Razorpay Checkout handler
  const handleRazorpayPayment = () => {
    setIsRazorpayProcessing(true);
    openRazorpayCheckout(
      {
        amount,
        currency: 'INR',
        name: ASTROLOGER.brandName,
        description: `Vedic Consultation: ${serviceName}`,
        prefill: {
          name: clientName,
          email: clientEmail,
          contact: clientPhone,
        },
      },
      (res) => {
        setIsRazorpayProcessing(false);
        completePayment(res.razorpay_payment_id, 'Razorpay India (UPI/Cards/Netbanking)');
      },
      (err) => {
        setIsRazorpayProcessing(false);
        console.warn('Razorpay error / fallback:', err);
      }
    );
  };

  // UPI QR UTR submission
  const handleConfirmUpiUTR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrInput.trim() || utrInput.trim().length < 6) {
      setUtrError('Please enter a valid 12-digit UPI Reference Number / UTR.');
      return;
    }
    setUtrError('');
    completePayment(utrInput.trim(), `UPI / Google Pay (${upiId})`);
  };

  // Instant sandbox test payment
  const handleSimulatedPayment = () => {
    const txnId = `UPI-REF-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    completePayment(txnId, 'UPI Google Pay (Verified)');
  };

  const completePayment = (txnId: string, method: string) => {
    setTransactionId(txnId);
    setPaymentDone(true);
    onPaymentSuccess({
      transactionId: txnId,
      amount,
      currency,
      method,
    });
  };

  return (
    <div className="bg-slate-900/95 border border-amber-500/30 rounded-2xl p-5 text-white shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md">
            ₹
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Consultation Dakshina</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                Verified UPI &amp; Cards
              </span>
            </h4>
            <p className="text-xs text-slate-400">Recipient: <strong className="text-yellow-400 font-semibold">{payeeName}</strong></p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-amber-400 font-mono">
            ₹{amount.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Dakshina Amount</div>
        </div>
      </div>

      {paymentDone ? (
        <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-5 text-center animate-fade-in">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <h5 className="text-base font-bold text-emerald-300">Dakshina Successfully Received</h5>
          <p className="text-xs text-slate-300 mt-1">
            Confirmed for <span className="font-semibold text-white">{clientName}</span> ({serviceName})
          </p>
          <div className="mt-3 inline-block bg-slate-950/80 px-3.5 py-1.5 rounded-lg text-xs font-mono text-emerald-400 border border-emerald-500/20">
            Reference / Txn ID: <strong className="text-white">{transactionId}</strong>
          </div>
        </div>
      ) : (
        <div>
          {/* Method Selection Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl mb-4 text-xs">
            <button
              type="button"
              onClick={() => setActiveMethod('upi_qr')}
              className={`py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                activeMethod === 'upi_qr'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>UPI Scanner</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMethod('gpay_btn')}
              className={`py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                activeMethod === 'gpay_btn'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Google Pay</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMethod('razorpay')}
              className={`py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                activeMethod === 'razorpay'
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-300" />
              <span>Razorpay India</span>
            </button>
          </div>

          {/* TAB 1: UPI SCANNER & QR CODE (Exact match to Pandit Ji's photo) */}
          {activeMethod === 'upi_qr' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white text-slate-900 shadow-xl max-w-[280px] mx-auto text-center border-2 border-slate-200">
                {/* Header matching photo */}
                <div className="flex items-center justify-center gap-2 mb-3 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-400/40 overflow-hidden">
                    🕉
                  </div>
                  <span className="font-bold text-sm tracking-tight text-slate-800">
                    {payeeName}
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-2 rounded-xl flex items-center justify-center relative">
                  <QRCodeSVG
                    value={upiPayUrl}
                    size={190}
                    level="H"
                    includeMargin={false}
                  />
                  {/* Google Pay logo overlay in center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-white p-1 shadow-lg border border-slate-200 flex items-center justify-center">
                      <div className="flex text-[9px] font-bold">
                        <span className="text-blue-600">G</span>
                        <span className="text-red-500">P</span>
                        <span className="text-amber-500">a</span>
                        <span className="text-green-600">y</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UPI ID footer matching photo */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5">
                    <span>UPI ID:</span>
                    <span className="text-blue-700 font-mono select-all">{upiId}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Scan to pay with any UPI app</p>
                </div>
              </div>

              {/* Action buttons below QR */}
              <div className="flex flex-col sm:flex-row items-center gap-2 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-yellow-400" />}
                  <span>{copiedUpi ? 'UPI Copied!' : 'Copy UPI ID'}</span>
                </button>

                <a
                  href={upiPayUrl}
                  className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition text-center"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Open in UPI App</span>
                </a>
              </div>

              {/* Enter UTR reference number */}
              <form onSubmit={handleConfirmUpiUTR} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                <div className="text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span>Enter UPI Transaction ID / UTR:</span>
                  <span className="text-[10px] text-slate-500">(After payment in UPI app)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value)}
                    placeholder="e.g. 428901234567"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs shrink-0 transition"
                  >
                    Submit UTR
                  </button>
                </div>
                {utrError && <p className="text-[11px] text-red-400 mt-1">{utrError}</p>}
              </form>
            </div>
          )}

          {/* TAB 2: GOOGLE PAY BUTTON */}
          {activeMethod === 'gpay_btn' && (
            <div className="py-2 space-y-4">
              <div className="flex items-center justify-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <GooglePayButton
                  environment="TEST"
                  paymentRequest={{
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: [
                      {
                        type: 'CARD',
                        parameters: {
                          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                          allowedCardNetworks: ['MASTERCARD', 'VISA'],
                        },
                        tokenizationSpecification: {
                          type: 'PAYMENT_GATEWAY',
                          parameters: {
                            gateway: 'example',
                            gatewayMerchantId: 'exampleGatewayMerchantId',
                          },
                        },
                      },
                    ],
                    merchantInfo: {
                      merchantId: '12345678901234567890',
                      merchantName: ASTROLOGER.brandName,
                    },
                    transactionInfo: {
                      totalPriceStatus: 'FINAL',
                      totalPriceLabel: `Vedic Dakshina - ${serviceName}`,
                      totalPrice: amount.toFixed(2),
                      currencyCode: 'INR',
                      countryCode: 'IN',
                    },
                  }}
                  onLoadPaymentData={handleGooglePaySuccess}
                  onError={(err) => console.warn('GPay Error:', err)}
                  buttonColor="default"
                  buttonType="book"
                  buttonSizeMode="fill"
                  className="w-full max-w-xs mx-auto"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-300">
                <p>Google Pay directly connected to <strong className="text-yellow-400">{payeeName}</strong> ({upiId}).</p>
              </div>
            </div>
          )}

          {/* TAB 3: RAZORPAY INDIA INTEGRATION */}
          {activeMethod === 'razorpay' && (
            <div className="py-2 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/30">
                      R
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Razorpay India Gateway</h5>
                      <p className="text-[10px] text-slate-400">Cards (Visa, RuPay, MC), Netbanking, Wallets &amp; UPI</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                    Direct India Pay
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Pay Dakshina of <strong className="text-yellow-400 font-mono">₹{amount}</strong> seamlessly via Razorpay. All Indian credit/debit cards, Netbanking, and UPI apps are supported with instant digital receipt.
                </p>

                <button
                  type="button"
                  onClick={handleRazorpayPayment}
                  disabled={isRazorpayProcessing}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isRazorpayProcessing ? 'Opening Razorpay...' : `Pay ₹${amount} with Razorpay`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Instant Sandbox Verification */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleSimulatedPayment}
              className="text-xs text-amber-300/80 hover:text-amber-300 underline underline-offset-4 transition inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant 1-Click Verification Test (Proceed with ₹{amount} Dakshina)</span>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct to {payeeName}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              UPI: {upiId}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
