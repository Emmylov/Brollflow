import React, { useState } from 'react';
import { ArrowUpRight, Clock, DollarSign, Sliders } from 'lucide-react';
import { ThemeMode } from '../types';

interface RoiCalculatorProps {
  theme: ThemeMode;
  onStartTrial: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({
  theme,
  onStartTrial,
}) => {
  const [videosPerMonth, setVideosPerMonth] = useState<number>(24);
  const [hoursPerVideo, setHoursPerVideo] = useState<number>(6);
  const [hourlyRate, setHourlyRate] = useState<number>(85);

  const isDark = theme === 'dark';

  // B-Roll Flow automates 78% of timeline assembly, B-roll sourcing, and captioning
  const totalManualHours = videosPerMonth * hoursPerVideo;
  const savedHoursPerMonth = Math.round(totalManualHours * 0.78);
  const remainingStudioHours = Math.max(1, totalManualHours - savedHoursPerMonth);
  const monthlyDollarSavings = savedHoursPerMonth * hourlyRate;
  const annualDollarSavings = monthlyDollarSavings * 12;

  return (
    <section
      id="roi-calculator"
      className={`py-20 border-b transition-colors duration-200 ${
        isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
            <span>03. Production Economics</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">78% Assembly Compression</span>
          </div>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-balance">
            Quantify Your Editorial Time & Margin Recovery.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Calibrate your monthly release cadence and average manual timeline assembly hours to model hours reclaimed across B-roll sourcing,rough-cut syncing, and kinetic captioning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Sliders */}
          <div
            className={`lg:col-span-7 rounded-xl border p-7 flex flex-col justify-between ${
              isDark
                ? 'bg-[#0C0C0C] border-[#161616]'
                : 'bg-white border-[#E1E1E1]'
            }`}
          >
            <div className="space-y-8">
              {/* Slider 1: Videos Created Per Month (1 to 100) */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <label
                    htmlFor="slider-videos"
                    className="text-sm font-medium"
                  >
                    Videos Created Per Month
                  </label>
                  <span
                    className={`font-mono-tabular text-lg font-semibold ${
                      isDark ? 'text-[#C9A063]' : 'text-[#111111]'
                    }`}
                  >
                    {videosPerMonth} {videosPerMonth === 1 ? 'video' : 'videos'} / mo
                  </span>
                </div>
                <input
                  id="slider-videos"
                  type="range"
                  min={1}
                  max={100}
                  value={videosPerMonth}
                  onChange={(e) => setVideosPerMonth(Number(e.target.value))}
                  className={`w-full editorial-slider ${
                    isDark ? 'bg-[#161616]' : 'bg-[#E1E1E1]'
                  }`}
                />
                <div className="flex justify-between text-[11px] font-mono-tabular text-zinc-500 mt-2">
                  <span>01 Solo Essayist</span>
                  <span>25 Weekly Studio</span>
                  <span>50 Growth Agency</span>
                  <span>100 Media Network</span>
                </div>
              </div>

              {/* Slider 2: Editing Hours Per Video (1 to 20) */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <label
                    htmlFor="slider-hours"
                    className="text-sm font-medium"
                  >
                    Editing Hours Per Video
                  </label>
                  <span
                    className={`font-mono-tabular text-lg font-semibold ${
                      isDark ? 'text-[#C9A063]' : 'text-[#111111]'
                    }`}
                  >
                    {hoursPerVideo} {hoursPerVideo === 1 ? 'hr' : 'hrs'} / video
                  </span>
                </div>
                <input
                  id="slider-hours"
                  type="range"
                  min={1}
                  max={20}
                  value={hoursPerVideo}
                  onChange={(e) => setHoursPerVideo(Number(e.target.value))}
                  className={`w-full editorial-slider ${
                    isDark ? 'bg-[#161616]' : 'bg-[#E1E1E1]'
                  }`}
                />
                <div className="flex justify-between text-[11px] font-mono-tabular text-zinc-500 mt-2">
                  <span>01 hr Shortform</span>
                  <span>08 hrs Midform</span>
                  <span>14 hrs Documentary</span>
                  <span>20 hrs Feature Essay</span>
                </div>
              </div>

              {/* Senior Editor Rate Selector */}
              <div
                className={`pt-6 border-t flex flex-wrap items-center justify-between gap-4 ${
                  isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Sliders className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Benchmark Senior NLE Editor Rate</span>
                </div>
                <div
                  className={`flex items-center gap-1 p-1 rounded-lg border ${
                    isDark
                      ? 'bg-[#050505] border-[#161616]'
                      : 'bg-[#F5F5F7] border-[#E1E1E1]'
                  }`}
                >
                  {[65, 85, 125].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setHourlyRate(rate)}
                      className={`px-3 py-1 rounded-md text-xs font-mono-tabular transition-colors whitespace-nowrap ${
                        hourlyRate === rate
                          ? isDark
                            ? 'bg-[#0C0C0C] text-[#C9A063] border border-[#161616]'
                            : 'bg-white text-[#111111] shadow-xs font-medium'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      ${rate}/hr
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-zinc-800/30 flex items-center justify-between text-xs text-zinc-500">
              <span>Manual Baseline: {totalManualHours} hrs/mo</span>
              <span className="font-mono-tabular">
                With B-Roll Flow: {remainingStudioHours} hrs/mo
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Counter Output */}
          <div
            className={`lg:col-span-5 rounded-xl border p-7 flex flex-col justify-between ${
              isDark
                ? 'bg-[#0C0C0C] border-[#161616]'
                : 'bg-white border-[#E1E1E1]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-6">
                <span>Projected Monthly Net Recovery</span>
                <span className="font-mono-tabular">Real-Time Model</span>
              </div>

              {/* Primary Dollar Savings */}
              <div className="mb-7">
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#C9A063]" />
                  <span>Estimated Monthly Dollar Savings</span>
                </div>
                <div
                  className={`font-mono-tabular text-4xl sm:text-5xl font-semibold tracking-tight ${
                    isDark ? 'text-[#C9A063]' : 'text-[#111111]'
                  }`}
                >
                  ${monthlyDollarSavings.toLocaleString('en-US')}
                  <span className="text-base font-normal text-zinc-500 ml-1.5">
                    / mo
                  </span>
                </div>
              </div>

              {/* Hours Reclaimed */}
              <div
                className={`py-5 border-y grid grid-cols-2 gap-4 ${
                  isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Hours Saved / Month</span>
                  </div>
                  <div className="font-mono-tabular text-2xl sm:text-3xl font-semibold">
                    {savedHoursPerMonth.toLocaleString('en-US')} hrs
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-400 mb-1">
                    Annualized Margin Lift
                  </div>
                  <div className="font-mono-tabular text-2xl sm:text-3xl font-semibold">
                    ${annualDollarSavings.toLocaleString('en-US')}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={onStartTrial}
                className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isDark
                    ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d4af76]'
                    : 'bg-[#111111] text-white hover:bg-zinc-800'
                }`}
              >
                <span>Lock In Recovery & Launch Studio</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
