import React from 'react';
import { TESTIMONIALS } from '../data/vedicData';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            <span>Client Experiences</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            What Our Clients Say
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Read heartfelt reflections from individuals, families, and professionals guided by Acharya Jitender Shastri.
          </p>
        </div>

        {/* Three Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-yellow-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative group hover:-translate-y-1.5"
            >
              {/* Subtle quote watermark */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-yellow-400/10 group-hover:text-yellow-400/20 transition-colors pointer-events-none" />

              <div>
                {/* Five gold stars */}
                <div className="flex items-center gap-1.5 mb-6">
                  {[...Array(testimonial.rating)].map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                    />
                  ))}
                </div>

                {/* Italic quote */}
                <p className="text-slate-200 text-base italic leading-relaxed mb-6 font-light">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              {/* Name below */}
              <div className="pt-4 border-t border-white/10">
                <div className="font-cinzel text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {testimonial.name}
                </div>
                <div className="text-xs text-yellow-400/80 font-medium mt-0.5">
                  Verified Client
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
