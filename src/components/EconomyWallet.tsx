import React, { useState } from 'react';
import { CoinTransaction, UserProfile } from '../types';
import { CreditCard, Wallet, ArrowDownCircle, ArrowUpCircle, History, BadgeCheck, ShieldAlert, KeyRound } from 'lucide-react';

interface EconomyWalletProps {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
  transactions: CoinTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<CoinTransaction[]>>;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  xp: number;
  setXp: (xp: number) => void;
}

export default function EconomyWallet({
  walletBalance,
  setWalletBalance,
  transactions,
  setTransactions,
  profile,
  setProfile,
  xp,
  setXp
}: EconomyWalletProps) {
  // Deposit system states
  const [depositAmount, setDepositAmount] = useState<string>('50');
  const [cardNumber, setCardNumber] = useState<string>('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState<string>('Apex Tactician');

  // Withdraw states
  const [withdrawAmount, setWithdrawAmount] = useState<string>('20');
  const [bankRouting, setBankRouting] = useState<string>('021000021');

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(depositAmount);

    if (isNaN(amountVal) || amountVal <= 0) {
      alert("Please input a valid positive decimal currency amount.");
      return;
    }

    const newTx: CoinTransaction = {
      id: "tx_" + Date.now().toString(),
      type: 'deposit',
      amount: amountVal,
      description: `Card Deposit Visa **${cardNumber.slice(-4) || '4242'}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setWalletBalance(walletBalance + amountVal);
    setTransactions([newTx, ...transactions]);
    setXp(xp + 50); // XP bonus for depositing
    alert(`Success! Card deposit of $${amountVal.toFixed(2)} processed to secure digital wallet ledger.`);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(withdrawAmount);

    if (isNaN(amountVal) || amountVal <= 0) {
      alert("Please input a valid positive withdrawal amount.");
      return;
    }

    if (amountVal > walletBalance) {
      alert("Insufficient wallet balance for withdrawal settlement.");
      return;
    }

    const newTx: CoinTransaction = {
      id: "tx_" + Date.now().toString(),
      type: 'withdrawal',
      amount: amountVal,
      description: `ACH Withdrawal to Local Routing ****${bankRouting.slice(-3) || '021'}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setWalletBalance(walletBalance - amountVal);
    setTransactions([newTx, ...transactions]);
    alert(`Withdrawal pending! $${amountVal.toFixed(2)} is routed for clearing. Expect 2-3 deposit business cycles.`);
  };

  const handleSubTierUpgrade = (tier: 'Free' | 'Pro Player' | 'Elite Academy', price: number) => {
    if (price > 0 && walletBalance < price) {
      alert(`Upgrade to ${tier} is failed. Insufficient funds to clear subscription premium.`);
      return;
    }

    // Process payment if not free
    if (price > 0) {
      setWalletBalance(walletBalance - price);
      // Log transaction
      const newTx: CoinTransaction = {
        id: "tx_" + Date.now().toString(),
        type: 'course_buy', // general billing
        amount: price,
        description: `Subscribed to Tier: ${tier} Monthly Plan`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
      setTransactions([newTx, ...transactions]);
    }

    setProfile(prev => ({
      ...prev,
      isPremium: tier
    }));

    setXp(xp + 100);
    alert(`Upgrade complete! Welcome to the ${tier} member network.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="economy-wallet-workbench">
      
      {/* 1. Wallet Balance & Transactions Log Left 2 Col Spans */}
      <div className="lg:col-span-2 space-y-6" id="wallet-balance-ledger">
        
        {/* Balance Grid Card */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-500/10 rounded-xl p-6 relative overflow-hidden" id="card-digital-wallet">
          <div className="absolute top-0 right-0 p-8 text-indigo-500/10 pointer-events-none">
            <Wallet className="w-40 h-40" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-450 uppercase font-mono tracking-widest block">
                  On-Platform Security escrow
                </span>
                <span className="text-2xl font-mono text-slate-200 mt-1 block">Digital Ledger Wallet</span>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 uppercase font-mono tracking-wider">
                Active Encrypted
              </span>
            </div>

            <div className="py-2">
              <span className="text-[10.5px] text-slate-500 font-mono block">SETTLED BALANCES AVAILABLE</span>
              <h1 className="text-4xl font-black font-mono text-indigo-300 mt-1">${walletBalance.toFixed(2)} <span className="text-lg font-normal text-slate-400">USD</span></h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 font-mono text-xs text-slate-400">
              <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded border border-slate-850">
                <BadgeCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Match earnings</span>
                  <span className="text-slate-200 font-semibold">$2,450.00 Locked in Vault</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded border border-slate-850">
                <ShieldAlert className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Verification NFT status</span>
                  <span className="text-slate-200 font-semibold">Gamer Security Level II Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit/Withdraw Forms Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="digital-routing-options">
          {/* Action A: Deposit Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="deposit-options-panel">
            <h3 className="font-semibold text-sm text-slate-200 mb-4 flex items-center gap-2 font-mono">
              <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
              Deposit Escrow Funds
            </h3>
            
            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-550 block mb-1">STAKE AMOUNT (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500font-bold">$</span>
                  <input
                    type="number"
                    min="5"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-100 rounded pl-7 pr-3 py-1.5 focus:outline-none focus:border-indigo-600 font-bold w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-550 block mb-1">MOCK CREDIT CARD STRING</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5 w-full focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-550 block mb-1">HOLDER</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-350 p-1.5 w-full rounded focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 font-sans rounded transition tracking-wide text-xs uppercase"
                  >
                    Confirm Deposit
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Action B: Withdraw Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="withdraw-options-panel">
            <h3 className="font-semibold text-sm text-slate-200 mb-4 flex items-center gap-2 font-mono">
              <ArrowUpCircle className="w-5 h-5 text-indigo-400" />
              Request Payouts (ACH Vault)
            </h3>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-555 block mb-1">WITHDRAWAL SUM (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    min="5"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-100 rounded pl-7 pr-3 py-1.5 focus:outline-none focus:border-indigo-600 font-bold w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-550 block mb-1">BANK CO-ROUTING NUMBER index</label>
                <input
                  type="text"
                  value={bankRouting}
                  onChange={(e) => setBankRouting(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-250 p-1.5 w-full rounded focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 font-sans rounded transition uppercase text-xs"
                >
                  Confirm Liquidation ACH
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Transaction History scroll table */}
        <div className="bg-slate-900 border border-slate-850 rounded-xl p-5" id="transaction-history-table">
          <div className="flex items-center gap-2 mb-4 font-mono">
            <History className="w-4.5 h-4.5 text-slate-400" />
            <h3 className="font-semibold text-slate-200 text-sm">Escrow Transaction Audit Trails</h3>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1" id="transactions-log-viewport">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-slate-950 p-3 rounded border border-slate-850 flex justify-between gap-4 text-xs font-mono" id={`tx-item-${tx.id}`}>
                <div className="space-y-1">
                  <span className="text-slate-250 font-bold block leading-tight">{tx.description}</span>
                  <span className="text-[10px] text-slate-550 block">Audit Stamp: {tx.date}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className={`font-bold block text-sm ${
                    tx.type === 'deposit' || tx.type === 'prize_payout' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'deposit' || tx.type === 'prize_payout' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-650 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850 block mt-1">
                    {tx.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. Premium Membership options Right Column Grid */}
      <div className="lg:col-span-1 space-y-6" id="subscription-memberships-side">
        <div className="bg-slate-900 border border-slate-850 rounded-xl p-5" id="membership-tiers-card">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100 text-sm">Premium Passes</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Unlock specific on-chain tournament lobbies, specialized LMS development curriculums, and direct strategic whiteboards.
          </p>

          <div className="space-y-4" id="membership-tier-cards-options">
            
            {/* Tier 1: Free */}
            <div className={`p-4 rounded-lg border transition ${
              profile.isPremium === 'Free' ? 'bg-indigo-950/20 border-indigo-500' : 'bg-slate-950 border-slate-805'
            }`} id="tier-free-card">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Free Participant</span>
              <h4 className="text-sm font-bold text-slate-200 mt-0.5">Gladiator Tier</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Unlock standard Single Elimination ladders, basic guides, playtester showcases, and click aim assessments.
              </p>
              <div className="mt-3.5 pt-3.5 border-t border-slate-805 flex justify-between items-center">
                <span className="text-sm font-bold font-mono text-indigo-300">Free Tier</span>
                <button
                  type="button"
                  disabled={profile.isPremium === 'Free'}
                  onClick={() => handleSubTierUpgrade('Free', 0)}
                  className="bg-slate-800 disabled:opacity-50 text-slate-350 text-[10px] font-mono font-bold px-3 py-1 rounded transition border border-slate-700"
                >
                  {profile.isPremium === 'Free' ? 'Active pass' : 'Enlist'}
                </button>
              </div>
            </div>

            {/* Tier 2: Pro Player */}
            <div className={`p-4 rounded-lg border transition ${
              profile.isPremium === 'Pro Player' ? 'bg-indigo-950/20 border-indigo-500' : 'bg-slate-950 border-slate-805'
            }`} id="tier-pro-card">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-amber-500 uppercase font-bold block">Pro Gamer Stake</span>
                <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono font-bold">TOP CHOICE</span>
              </div>
              <h4 className="text-sm font-bold text-slate-200 mt-0.5">Titan Pro Tier</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Gain access to double prize pool tournaments, unlimited 1-on-1 scheduling discounts, full-stack strategy masterclasses, and certified master badges.
              </p>
              <div className="mt-3.5 pt-3.5 border-t border-slate-805 flex justify-between items-center">
                <span className="text-sm font-bold font-mono text-indigo-300">$9.00 <span className="text-[10px] font-normal text-slate-400">/mo</span></span>
                <button
                  type="button"
                  onClick={() => handleSubTierUpgrade('Pro Player', 9)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-bold px-3 py-1 rounded transition"
                >
                  {profile.isPremium === 'Pro Player' ? 'Active pass' : 'Spend $9'}
                </button>
              </div>
            </div>

            {/* Tier 3: Elite Academy */}
            <div className={`p-4 rounded-lg border transition ${
              profile.isPremium === 'Elite Academy' ? 'bg-indigo-950/20 border-indigo-500' : 'bg-slate-950 border-slate-805'
            }`} id="tier-academy-card">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block">Digital Creator Pass</span>
              <h4 className="text-sm font-bold text-slate-200 mt-0.5">Epic Academy Pass</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                For developers and professional team managers. Publishes your indie prototypes directly into sandbox showcasing, unlocks full Godot/Unreal curriculum modules, and provides on-chain certificates.
              </p>
              <div className="mt-3.5 pt-3.5 border-t border-slate-805 flex justify-between items-center">
                <span className="text-sm font-bold font-mono text-indigo-300">$19.00 <span className="text-[10px] font-normal text-slate-400">/mo</span></span>
                <button
                  type="button"
                  onClick={() => handleSubTierUpgrade('Elite Academy', 19)}
                  className="bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-mono font-bold px-2 py-1 rounded transition"
                >
                  {profile.isPremium === 'Elite Academy' ? 'Active pass' : 'Spend $19'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
