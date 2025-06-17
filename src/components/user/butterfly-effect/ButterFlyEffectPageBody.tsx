"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Calculator, TrendingUp, Calendar, BarChart3, PieChart, Plus, Target, Award, IndianRupee } from "lucide-react";

interface AdditionalInvestment {
  year: number;
  amount: number;
  id: number;
}

const ButterflyEffectPageBody = function () {
  const [activeTab, setActiveTab] = useState('sip');
  const [sipAmount, setSipAmount] = useState(0);
  const [lumpsumAmount, setLumpsumAmount] = useState(0);
  const [annualReturn, setAnnualReturn] = useState(0);
  const [timePeriod, setTimePeriod] = useState(0);
  const [stepUpRate, setStepUpRate] = useState(0);
  const [enableStepUp, setEnableStepUp] = useState(false);
  const [additionalInvestments, setAdditionalInvestments] = useState<AdditionalInvestment[]>([]);
  const [newAdditionalAmount, setNewAdditionalAmount] = useState(0);
  const [newAdditionalYear, setNewAdditionalYear] = useState(1);
  interface YearlyBreakdown {
    year: number;
    startValue: number;
    sipInvestment: number;
    additionalInvestment: number;
    totalInvestment: number;
    returns: number;
    endValue: number;
    cumulativeInvestment: number;
  }

  const [results, setResults] = useState<{
    totalInvestment: number;
    estimatedReturns: number;
    totalValue: number;
    yearlyBreakdown: YearlyBreakdown[];
  }>({
    totalInvestment: 0,
    estimatedReturns: 0,
    totalValue: 0,
    yearlyBreakdown: []
  });

  // Add new additional investment
  const addAdditionalInvestment = () => {
    if (newAdditionalYear <= timePeriod && newAdditionalAmount > 0) {
      setAdditionalInvestments([...additionalInvestments, {
        year: newAdditionalYear,
        amount: newAdditionalAmount,
        id: Date.now()
      }]);
      setNewAdditionalAmount(0);
      setNewAdditionalYear(Math.min(newAdditionalYear + 1, timePeriod));
    }
  };

  // Remove additional investment
  const removeAdditionalInvestment = (id: number) => {
    setAdditionalInvestments(additionalInvestments.filter(inv => inv.id !== id));
  };

  // Calculate SIP with step-up and additional investments
  const calculateAdvancedSIP = useCallback((monthlyAmount: number, rate: number, years: number, stepUp: number, enableStep: boolean, additionalInvs: AdditionalInvestment[]) => {
    const monthlyRate = rate / 100 / 12;
    let totalInvestment = 0;
    let totalValue = 0;
    let currentMonthlyAmount = monthlyAmount;
    const yearlyBreakdown = [];

    for (let year = 1; year <= years; year++) {
      const yearlyInvestment = currentMonthlyAmount * 12;
      const yearStartValue = totalValue;
      
      // Add monthly SIP for the year
      for (let month = 1; month <= 12; month++) {
        totalValue = (totalValue + currentMonthlyAmount) * (1 + monthlyRate);
        totalInvestment += currentMonthlyAmount;
      }

      // Add any additional investments for this year
      const additionalForYear = additionalInvs.filter(inv => inv.year === year);
      let yearlyAdditional = 0;
      additionalForYear.forEach(inv => {
        totalValue += inv.amount;
        totalInvestment += inv.amount;
        yearlyAdditional += inv.amount;
      });

      const yearEndValue = totalValue;
      const yearlyReturns = yearEndValue - yearStartValue - yearlyInvestment - yearlyAdditional;

      yearlyBreakdown.push({
        year,
        startValue: Math.round(yearStartValue),
        sipInvestment: Math.round(yearlyInvestment),
        additionalInvestment: Math.round(yearlyAdditional),
        totalInvestment: Math.round(yearlyInvestment + yearlyAdditional),
        returns: Math.round(yearlyReturns),
        endValue: Math.round(yearEndValue),
        cumulativeInvestment: Math.round(totalInvestment)
      });

      // Step up SIP amount for next year
      if (enableStep && year < years) {
        currentMonthlyAmount = currentMonthlyAmount * (1 + stepUp / 100);
      }
    }

    return {
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(totalValue - totalInvestment),
      totalValue: Math.round(totalValue),
      yearlyBreakdown
    };
  }, []);

  // Calculate Lumpsum with additional investments
  const calculateAdvancedLumpsum = useCallback((principal: number, rate: number, years: number, additionalInvs: AdditionalInvestment[]) => {
    let totalInvestment = principal;
    let totalValue = principal;
    const yearlyBreakdown = [];

    for (let year = 1; year <= years; year++) {
      const yearStartValue = totalValue;
      
      // Compound the existing amount
      totalValue = totalValue * (1 + rate / 100);
      
      // Add any additional investments for this year
      const additionalForYear = additionalInvs.filter(inv => inv.year === year);
      let yearlyAdditional = 0;
      additionalForYear.forEach(inv => {
        totalValue += inv.amount;
        totalInvestment += inv.amount;
        yearlyAdditional += inv.amount;
      });

      const yearEndValue = totalValue;
      const yearlyReturns = yearEndValue - yearStartValue - yearlyAdditional;

      yearlyBreakdown.push({
        year,
        startValue: Math.round(yearStartValue),
        sipInvestment: 0,
        additionalInvestment: Math.round(yearlyAdditional),
        totalInvestment: Math.round(yearlyAdditional),
        returns: Math.round(yearlyReturns),
        endValue: Math.round(yearEndValue),
        cumulativeInvestment: Math.round(totalInvestment)
      });
    }

    return {
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(totalValue - totalInvestment),
      totalValue: Math.round(totalValue),
      yearlyBreakdown
    };
  }, []);

  // Update calculations when inputs change
  useEffect(() => {
    if (activeTab === 'sip') {
      setResults(calculateAdvancedSIP(sipAmount, annualReturn, timePeriod, stepUpRate, enableStepUp, additionalInvestments));
    } else {
      setResults(calculateAdvancedLumpsum(lumpsumAmount, annualReturn, timePeriod, additionalInvestments));
    }
  }, [activeTab, sipAmount, lumpsumAmount, annualReturn, timePeriod, stepUpRate, enableStepUp, additionalInvestments, calculateAdvancedSIP, calculateAdvancedLumpsum]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Advanced Investment Calculator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Calculate SIP & Lumpsum returns with step-up investments and additional contributions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border">
            <button
              onClick={() => setActiveTab('sip')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'sip'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              SIP Calculator
            </button>
            <button
              onClick={() => setActiveTab('lumpsum')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'lumpsum'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Lumpsum Calculator
            </button>
          </div>
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-1 space-y-6">
            {/* Basic Inputs */}
            <div className="bg-white rounded-2xl shadow-xl border p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-emerald-600" />
                Basic Investment Details
              </h2>

              <div className="space-y-6">
                {activeTab === 'sip' ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Monthly SIP Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={sipAmount}
                        onChange={(e) => setSipAmount(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg font-semibold"
                        placeholder="0"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="500"
                      value={sipAmount}
                      onChange={(e) => setSipAmount(Number(e.target.value))}
                      className="w-full mt-2 h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Lumpsum Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={lumpsumAmount}
                        onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg font-semibold"
                        placeholder="0"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={lumpsumAmount}
                      onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                      className="w-full mt-2 h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Annual Return (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg font-semibold"
                      placeholder="0"
                      step="0.1"
                    />
                    <span className="absolute right-4 top-3 text-gray-500">%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    className="w-full mt-2 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Investment Period (Years)
                  </label>
                  <input
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg font-semibold"
                    placeholder="0"
                  />
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="w-full mt-2 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Step-up SIP */}
            {activeTab === 'sip' && (
              <div className="bg-white rounded-2xl shadow-xl border p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Step-up SIP
                </h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="stepup"
                    checked={enableStepUp}
                    onChange={(e) => setEnableStepUp(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="stepup" className="text-sm font-medium text-gray-700">
                    Enable annual step-up
                  </label>
                </div>

                {enableStepUp && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Annual Step-up Rate (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={stepUpRate}
                        onChange={(e) => setStepUpRate(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg font-semibold"
                        placeholder="0"
                        step="1"
                      />
                      <span className="absolute right-4 top-3 text-gray-500">%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={stepUpRate}
                      onChange={(e) => setStepUpRate(Number(e.target.value))}
                      className="w-full mt-2 h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Your SIP will increase by {stepUpRate}% each year
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Additional Investments */}
            <div className="bg-white rounded-2xl shadow-xl border p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-600" />
                Additional Investments
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={newAdditionalAmount}
                      onChange={(e) => setNewAdditionalAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={newAdditionalYear}
                      onChange={(e) => setNewAdditionalYear(Number(e.target.value))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none text-sm"
                      min="1"
                      max={timePeriod}
                    />
                  </div>
                </div>
                
                <button
                  onClick={addAdditionalInvestment}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Add Investment
                </button>

                {additionalInvestments.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {additionalInvestments.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <span className="text-sm">
                          Year {inv.year}: ₹{formatNumber(inv.amount)}
                        </span>
                        <button
                          onClick={() => removeAdditionalInvestment(inv.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results and Breakdown Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Total Investment</h3>
                  <Target className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold">{formatCurrency(results.totalInvestment)}</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Estimated Returns</h3>
                  <Award className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold">{formatCurrency(results.estimatedReturns)}</p>
              </div>

              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Total Value</h3>
                  <PieChart className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold">{formatCurrency(results.totalValue)}</p>
              </div>
            </div>

            {/* Detailed Year-wise Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl border p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                Year-wise Detailed Breakdown
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-3 font-semibold">Year</th>
                      <th className="text-right p-3 font-semibold">Start Value</th>
                      {activeTab === 'sip' && <th className="text-right p-3 font-semibold">SIP Investment</th>}
                      <th className="text-right p-3 font-semibold">Additional</th>
                      <th className="text-right p-3 font-semibold">Returns</th>
                      <th className="text-right p-3 font-semibold">End Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="border-b hover:bg-gray-25">
                        <td className="p-3 font-semibold text-emerald-600">{row.year}</td>
                        <td className="p-3 text-right">{formatCurrency(row.startValue)}</td>
                        {activeTab === 'sip' && (
                          <td className="p-3 text-right text-emerald-600 font-medium">
                            {formatCurrency(row.sipInvestment)}
                          </td>
                        )}
                        <td className="p-3 text-right text-purple-600 font-medium">
                          {row.additionalInvestment > 0 ? formatCurrency(row.additionalInvestment) : '-'}
                        </td>
                        <td className="p-3 text-right text-green-600 font-medium">
                          {formatCurrency(row.returns)}
                        </td>
                        <td className="p-3 text-right font-bold">
                          {formatCurrency(row.endValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Growth Visualization */}
            <div className="bg-white rounded-2xl shadow-xl border p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Investment Growth Visualization
              </h3>
              
              <div className="h-80 flex items-end justify-between gap-1">
                {results.yearlyBreakdown.filter((_, index) => 
                  index % Math.ceil(results.yearlyBreakdown.length / 15) === 0 || 
                  index === results.yearlyBreakdown.length - 1
                ).map((data, index) => {
                  const maxValue = Math.max(...results.yearlyBreakdown.map(d => d.endValue));
                  const investmentHeight = (data.cumulativeInvestment / maxValue) * 100;
                  const totalHeight = (data.endValue / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 group relative">
                      <div className="relative w-full h-72 flex flex-col justify-end">
                        {/* Total Value Bar */}
                        <div
                          className="w-full bg-gradient-to-t from-teal-400 to-teal-600 rounded-t-md transition-all duration-300 group-hover:shadow-lg relative"
                          style={{ height: `${totalHeight}%` }}
                        >
                          {/* Investment Portion */}
                          <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-t-md"
                            style={{ height: `${(investmentHeight / totalHeight) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 mt-2 text-center">
                        Y{data.year}
                      </span>
                      
                      {/* Hover Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bg-gray-800 text-white p-3 rounded-lg text-xs z-10 bottom-full mb-2 w-48 transform -translate-x-1/2">
                        <div className="font-semibold mb-2">Year {data.year}</div>
                        <div>Total Value: {formatCurrency(data.endValue)}</div>
                        <div>Investment: {formatCurrency(data.cumulativeInvestment)}</div>
                        <div>Returns: {formatCurrency(data.endValue - data.cumulativeInvestment)}</div>
                        {activeTab === 'sip' && <div>SIP This Year: {formatCurrency(data.sipInvestment)}</div>}
                        {data.additionalInvestment > 0 && <div>Additional: {formatCurrency(data.additionalInvestment)}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded"></div>
                  <span>Total Investment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-teal-400 to-teal-600 rounded"></div>
                  <span>Returns Generated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #14b8a6);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #14b8a6);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default ButterflyEffectPageBody;
