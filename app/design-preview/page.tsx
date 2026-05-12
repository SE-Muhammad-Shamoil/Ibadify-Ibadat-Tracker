import React from 'react';

export default function DesignPreviewPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 py-16 space-y-16">
      <header className="space-y-4">
        <h1 className="text-display-lg font-medium">Sacred Minimalism</h1>
        <p className="text-body-lg text-charcoal/80">
          Design system preview for Ibadify.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-headline-md border-b border-border-warm pb-2">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-24 rounded-md bg-cream border border-border-warm shadow-sm flex items-end p-2">
              <span className="text-label-caps">#FAF8F5</span>
            </div>
            <p className="text-label-sm font-semibold">Cream (Surface)</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-md bg-teal-dust shadow-sm flex items-end p-2 text-white">
              <span className="text-label-caps">#4A7C6F</span>
            </div>
            <p className="text-label-sm font-semibold">Dusty Teal (Accent)</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-md bg-charcoal shadow-sm flex items-end p-2 text-white">
              <span className="text-label-caps">#2D2D2D</span>
            </div>
            <p className="text-label-sm font-semibold">Charcoal (Text)</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-md bg-border-warm shadow-sm flex items-end p-2">
              <span className="text-label-caps">#E8E3DC</span>
            </div>
            <p className="text-label-sm font-semibold">Warm Border</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-headline-md border-b border-border-warm pb-2">Typography</h2>
        <div className="space-y-8">
          <div>
            <p className="text-label-caps mb-2 text-teal-dust">Display Large (Lora, 40px, 500)</p>
            <h1 className="text-[40px] leading-[1.2] font-medium tracking-[-0.02em] font-[family-name:var(--font-lora)]">
              The heart finds peace in remembrance
            </h1>
          </div>
          <div>
            <p className="text-label-caps mb-2 text-teal-dust">Headline Medium (Lora, 24px, 500)</p>
            <h2 className="text-[24px] leading-[1.4] font-medium font-[family-name:var(--font-lora)]">
              Nightly Reflection
            </h2>
          </div>
          <div>
            <p className="text-label-caps mb-2 text-teal-dust">Headline Small (Lora, 20px, 500)</p>
            <h3 className="text-[20px] leading-[1.4] font-medium font-[family-name:var(--font-lora)]">
              Morning Dhikr
            </h3>
          </div>
          <div>
            <p className="text-label-caps mb-2 text-teal-dust">Body Large (DM Sans, 17px, 400)</p>
            <p className="text-[17px] leading-[1.6] font-normal font-[family-name:var(--font-dm-sans)]">
              O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.
            </p>
          </div>
          <div>
            <p className="text-label-caps mb-2 text-teal-dust">Body Medium (DM Sans, 15px, 400)</p>
            <p className="text-[15px] leading-[1.6] font-normal font-[family-name:var(--font-dm-sans)]">
              Your daily streak is a reflection of your consistency, not perfection.
            </p>
          </div>
          <div>
            <p className="text-label-caps mb-2 text-teal-dust">Label Caps (DM Sans, 12px, 600)</p>
            <p className="text-[12px] leading-[1.0] font-semibold tracking-[0.1em] uppercase font-[family-name:var(--font-dm-sans)]">
              Mandatory Prayers
            </p>
          </div>
          <div>
            <p className="text-label-caps mb-2 text-teal-dust">Label Small (DM Sans, 13px, 500)</p>
            <p className="text-[13px] leading-[1.2] font-medium font-[family-name:var(--font-dm-sans)]">
              Completed at 5:42 AM
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-headline-md border-b border-border-warm pb-2">Components</h2>
        
        <div className="space-y-8">
          {/* Buttons */}
          <div className="space-y-4">
            <h3 className="text-label-caps text-charcoal/70">Buttons</h3>
            <div className="flex gap-4">
              <button className="bg-teal-dust text-white px-6 py-2.5 rounded text-[15px] font-medium hover:bg-teal-dust/90 transition-colors">
                Primary Action
              </button>
              <button className="bg-transparent border border-border-warm text-charcoal px-6 py-2.5 rounded text-[15px] font-medium hover:bg-border-warm/30 transition-colors">
                Secondary Action
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <h3 className="text-label-caps text-charcoal/70">Cards & Lists</h3>
            <div className="bg-white border border-border-warm rounded-lg p-6 w-full max-w-md shadow-[0px_4px_20px_rgba(45,45,45,0.04)]">
              <h4 className="text-[20px] font-medium font-[family-name:var(--font-lora)] mb-4">Daily Tracker</h4>
              <div className="flex flex-col">
                <label className="flex items-center space-x-3 py-3 border-b border-border-warm">
                  <div className="w-5 h-5 rounded-[4px] border border-border-warm flex items-center justify-center cursor-pointer hover:border-teal-dust transition-colors"></div>
                  <span className="text-[15px]">Fajr</span>
                </label>
                <label className="flex items-center space-x-3 py-3 border-b border-border-warm">
                  <div className="w-5 h-5 rounded-[4px] bg-teal-dust text-white flex items-center justify-center cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-[15px] line-through text-charcoal/50">Dhuhr</span>
                </label>
                <label className="flex items-center space-x-3 py-3 border-border-warm">
                  <div className="w-5 h-5 rounded-[4px] border border-border-warm flex items-center justify-center cursor-pointer hover:border-teal-dust transition-colors"></div>
                  <span className="text-[15px]">Asr</span>
                </label>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-4">
            <h3 className="text-label-caps text-charcoal/70">Progress</h3>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="var(--color-border-warm)" strokeWidth="2" fill="none" />
                <circle cx="32" cy="32" r="28" stroke="var(--color-teal-dust)" strokeWidth="2" fill="none" strokeDasharray="175" strokeDashoffset="44" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[13px] font-medium">75%</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
