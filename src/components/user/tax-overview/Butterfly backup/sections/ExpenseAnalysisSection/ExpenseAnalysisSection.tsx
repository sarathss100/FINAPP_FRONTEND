import { DownloadIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";

export const ExpenseAnalysisSection = (): JSX.Element => {
  return (
    <div className="w-full flex justify-between items-center mb-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl text-[#004a7c] font-['Roboto',Helvetica] leading-6">
          Butterfly Effect
        </h1>
        <p className="text-gray-500 text-base font-['Roboto',Helvetica] font-normal leading-4">
          This is a butterfly effect
        </p>
      </div>

      <Button variant="outline" className="flex items-center gap-2">
        <DownloadIcon className="h-4 w-4" />
        <span>Import/Export</span>
      </Button>
    </div>
  );
};
