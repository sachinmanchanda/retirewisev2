import { ArrowLeft, Shield, Layers, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface StrategyGuideProps {
  onBack: () => void;
}

export function StrategyGuide({ onBack }: StrategyGuideProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Calculator</span>
      </button>

      <div className="space-y-16">
        <header>
          <h1 className="text-5xl font-bold tracking-tight mb-4">Retirement Withdrawal Strategies</h1>
          <p className="text-xl text-zinc-500 max-w-2xl">
            Choosing how you withdraw your money is just as important as how you save it. Explore the two primary methods used in RetireWise.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Normal Strategy */}
          <section className="space-y-6">
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-zinc-900" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Normal Strategy</h2>
              <p className="text-zinc-600 leading-relaxed">
                The traditional approach where your entire corpus remains invested in a single portfolio (usually a mix of equity and debt) throughout your retirement.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1"><Shield size={16} className="text-emerald-500" /></div>
                <div>
                  <h4 className="font-bold text-sm">How it works</h4>
                  <p className="text-sm text-zinc-500">You withdraw a fixed amount (adjusted for inflation) every month directly from your main investment account.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1"><Layers size={16} className="text-emerald-500" /></div>
                <div>
                  <h4 className="font-bold text-sm">Pros</h4>
                  <p className="text-sm text-zinc-500">Simple to manage. Maximizes time-in-market for your entire corpus, potentially leading to higher long-term growth.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1"><AlertTriangle size={16} className="text-rose-500" /></div>
                <div>
                  <h4 className="font-bold text-sm">Cons</h4>
                  <p className="text-sm text-zinc-500">High "Sequence of Returns" risk. If the market crashes early in your retirement, you are forced to sell assets at a loss to fund your life.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Bucket Strategy */}
          <section className="space-y-6">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center">
              <Layers className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Bucket (Block) Strategy</h2>
              <p className="text-zinc-600 leading-relaxed">
                A more defensive approach that divides your wealth into "buckets" based on when you need the money.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1"><Shield size={16} className="text-emerald-500" /></div>
                <div>
                  <h4 className="font-bold text-sm">How it works</h4>
                  <p className="text-sm text-zinc-500">You keep 3-5 years of expenses in a safe "Cash/Debt Bucket" (like an FD) and the rest in an "Equity Bucket". You spend from the safe bucket first.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1"><Layers size={16} className="text-emerald-500" /></div>
                <div>
                  <h4 className="font-bold text-sm">Pros</h4>
                  <p className="text-sm text-zinc-500">Psychological peace of mind. If the market crashes, you don't care because your next 5 years of survival are already locked in cash.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1"><AlertTriangle size={16} className="text-rose-500" /></div>
                <div>
                  <h4 className="font-bold text-sm">Cons</h4>
                  <p className="text-sm text-zinc-500">"Cash Drag". Because a portion of your money is in low-return accounts, your overall portfolio might grow slower than the Normal strategy.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
          <h3 className="text-xl font-bold mb-4">Which one should you choose?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-zinc-600 mb-4">
                The **Normal Strategy** is often better for those with a very large corpus or those who can tolerate high volatility. It relies on the long-term upward trend of the market.
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-600 mb-4">
                The **Bucket Strategy** is ideal for those who want to avoid the stress of market fluctuations. It trades a bit of potential growth for significant downside protection and stability.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <p className="text-xs text-zinc-400 italic">
              *RetireWise simulations for the Bucket Strategy assume the "Safe Bucket" earns returns equal to inflation, while the "Growth Bucket" earns your Expected Annual Return.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
