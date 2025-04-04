import React from "react";
import Link from 'next/link';
import Button from '@/components/base/Button';

export const FinancialJourneySection = function () {
  return (
    <section className="w-full bg-[#004a7c] py-20">
      <div className="container mx-auto max-w-[1280px] flex flex-col items-center justify-center gap-8">
        <h2 className="font-poppins text-4xl text-white text-center leading-9 max-w-[648px]">
          Start Your Financial Journey Today
        </h2>

        <p className="font-poppins text-xl text-white text-center leading-5 max-w-[741px]">
          Join thousands of users who are already managing their finances
          smarter
        </p>

        <Link
          href={'/signup'}
          passHref
        >
          <Button
            className="bg-white text-[#004a7c] hover:bg-white/90 rounded-full h-12 px-8 font-poppins text-base"
          >
            Create Free Account
          </Button>
        </Link>
      </div>
    </section>
  );
};
