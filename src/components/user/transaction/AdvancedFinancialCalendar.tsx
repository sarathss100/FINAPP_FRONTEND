import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Search
} from "lucide-react";

interface Transaction {
  id: number;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
}

// Mock transaction data
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, date: "2025-05-01", type: "income", amount: 2500, category: "Salary", description: "Monthly salary" },
  { id: 2, date: "2025-05-03", type: "expense", amount: 800, category: "Rent", description: "Monthly rent" },
  { id: 3, date: "2025-05-05", type: "expense", amount: 120, category: "Utilities", description: "Electricity bill" },
  { id: 4, date: "2025-05-07", type: "expense", amount: 65, category: "Groceries", description: "Weekly groceries" },
  { id: 5, date: "2025-05-12", type: "income", amount: 400, category: "Freelance", description: "Design project" },
  { id: 6, date: "2025-05-15", type: "expense", amount: 200, category: "Insurance", description: "Car insurance" },
  { id: 7, date: "2025-05-18", type: "expense", amount: 35, category: "Entertainment", description: "Movie tickets" },
  { id: 8, date: "2025-05-20", type: "income", amount: 100, category: "Interest", description: "Savings interest" },
  { id: 9, date: "2025-05-22", type: "expense", amount: 80, category: "Dining", description: "Dinner with friends" },
  { id: 10, date: "2025-05-28", type: "expense", amount: 150, category: "Shopping", description: "New clothes" },
  { id: 11, date: "2025-06-01", type: "income", amount: 2500, category: "Salary", description: "Monthly salary" },
  { id: 14, date: "2025-04-03", type: "expense", amount: 800, category: "Rent", description: "Monthly rent" },
] as const;

export default function AdvancedFinancialCalendar() {
  // State for date management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month"); // "day", "month", "year"
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Extract unique categories from transactions
  const categories = ["all", ...new Set(transactions.map(t => t.category))];
  
  // Summary calculations
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  // Helper functions
  interface DateParam {
    toLocaleString: (locale: string, options: Intl.DateTimeFormatOptions) => string;
  }

  const getMonthName = (date: DateParam): string => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigation functions
  const prevPeriod = () => {
    if (currentView === "day") {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    } else if (currentView === "month") {
      setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    } else if (currentView === "year") {
      setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)));
    }
  };

  const nextPeriod = () => {
    if (currentView === "day") {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    } else if (currentView === "month") {
      setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    } else if (currentView === "year") {
      setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filter transactions based on current view and filters
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by date range based on view
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    
    if (currentView === "day") {
      const dayStart = new Date(year, month, day);
      const dayEnd = new Date(year, month, day + 1);
      filtered = filtered.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= dayStart && txDate < dayEnd;
      });
    } else if (currentView === "month") {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      filtered = filtered.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= monthStart && txDate <= monthEnd;
      });
    } else if (currentView === "year") {
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31);
      filtered = filtered.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= yearStart && txDate <= yearEnd;
      });
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTransactions(filtered);
    
    // Calculate summary
    const income = filtered.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expenses = filtered.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    
    setSummaryData({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    });

    setTransactions(MOCK_TRANSACTIONS);
    
  }, [currentDate, currentView, transactions, searchTerm, categoryFilter, typeFilter]);

  // Generate calendar data for month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];
    
    // Add previous month's days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      const dayNumber = daysInPrevMonth - firstDayOfMonth + i + 1;
      days.push({
        date: new Date(prevYear, prevMonth, dayNumber),
        current: false,
        label: dayNumber
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dayTransactions = filteredTransactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate.getDate() === i && txDate.getMonth() === month && txDate.getFullYear() === year;
      });
      
      let indicator = null;
      if (dayTransactions.length > 0) {
        const hasIncome = dayTransactions.some(t => t.type === "income");
        const hasExpense = dayTransactions.some(t => t.type === "expense");
        
        if (hasIncome && hasExpense) {
          indicator = "bg-amber-500";
        } else if (hasIncome) {
          indicator = "bg-emerald-500";
        } else if (hasExpense) {
          indicator = "bg-red-500";
        }
      }
      
      days.push({
        date: dayDate,
        current: true,
        label: i,
        indicator,
        transactions: dayTransactions.map(t => ({
          ...t,
          color: t.type === "income" ? "text-emerald-500" : "text-red-500",
        }))
      });
    }
    
    // Add next month's days to complete the grid (6 rows x 7 days = 42 cells)
    const remainingDays = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextYear, nextMonth, i),
        current: false,
        label: i
      });
    }
    
    return days;
  };

  // Generate monthly data for year view
  const generateMonthlyData = () => {
    const year = currentDate.getFullYear();
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      
      const monthTransactions = transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= monthStart && txDate <= monthEnd;
      });
      
      const income = monthTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        name: new Date(year, month, 1).toLocaleString('default', { month: 'long' }),
        income,
        expenses,
        balance: income - expenses,
        transactions: monthTransactions.length
      });
    }
    
    return months;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  interface CalendarDay {
    date: Date;
    current: boolean;
    label: number;
    indicator?: string | null;
    transactions?: Array<Transaction & { color: string }>;
  }

  // Handle day click - switch to day view
  const handleDayClick = (day: CalendarDay) => {
    setCurrentDate(day.date);
    setCurrentView("day");
  };

  // Handle month click - switch to month view
  const handleMonthClick = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
    setCurrentView("month");
  };

  // Day View Component
  const DayView = () => {
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <div className="space-y-4">
        <div className="text-xl font-semibold text-center text-gray-800">{formattedDate}</div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Income</div>
            <div className="text-xl font-bold text-emerald-600">{formatCurrency(summaryData.totalIncome)}</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Expenses</div>
            <div className="text-xl font-bold text-red-600">{formatCurrency(summaryData.totalExpenses)}</div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Balance</div>
            <div className={`text-xl font-bold ${summaryData.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(summaryData.balance)}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="font-medium text-gray-700 mb-4">Transactions</div>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No transactions for this day</div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      <DollarSign className={`h-4 w-4 ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-xs text-gray-500">{transaction.category}</div>
                    </div>
                  </div>
                  <div className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Month View Component
  const MonthView = () => {
    const calendarDays = generateCalendarDays();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Month Income</div>
            <div className="text-xl font-bold text-emerald-600">{formatCurrency(summaryData.totalIncome)}</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Month Expenses</div>
            <div className="text-xl font-bold text-red-600">{formatCurrency(summaryData.totalExpenses)}</div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Month Balance</div>
            <div className={`text-xl font-bold ${summaryData.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(summaryData.balance)}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day) => (
                  <div key={day} className="text-center">
                    <span className="font-medium text-[#004a7c]">{day}</span>
                  </div>
                ),
              )}
            </div>

            <div className="grid grid-cols-7 gap-4">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-2 h-28 relative transition-all duration-200 ${
                    day.current 
                      ? 'border-gray-200 hover:border-[#004a7c] hover:shadow-sm cursor-pointer' 
                      : 'border-gray-100 bg-gray-50'
                  }`}
                  onClick={() => day.current && handleDayClick(day)}
                >
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        new Date().toDateString() === day.date.toDateString()
                          ? "bg-[#004a7c] text-white rounded-full w-6 h-6 flex items-center justify-center"
                          : day.current ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {day.label}
                    </span>
                    {day.indicator && (
                      <div
                        className={`w-2 h-2 rounded-full ${day.indicator}`}
                      ></div>
                    )}
                  </div>

                  {day.transactions && (
                    <div className="mt-1 space-y-1 overflow-auto max-h-20">
                      {day.transactions.slice(0, 3).map((transaction, idx) => (
                        <div
                          key={idx}
                          className={`text-xs font-medium py-1 px-2 rounded-md ${
                            transaction.color === 'text-emerald-500' 
                              ? 'bg-emerald-50' 
                              : transaction.color === 'text-red-500'
                                ? 'bg-red-50'
                                : ''
                          } ${transaction.color}`}
                        >
                          {formatCurrency(transaction.amount)}
                        </div>
                      ))}
                      {day.transactions.length > 3 && (
                        <div className="text-xs text-center text-gray-500">
                          +{day.transactions.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Year View Component
  const YearView = () => {
    const monthlyData = generateMonthlyData();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Year Income</div>
            <div className="text-xl font-bold text-emerald-600">{formatCurrency(summaryData.totalIncome)}</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Year Expenses</div>
            <div className="text-xl font-bold text-red-600">{formatCurrency(summaryData.totalExpenses)}</div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Year Balance</div>
            <div className={`text-xl font-bold ${summaryData.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(summaryData.balance)}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyData.map((month, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleMonthClick(index)}
              >
                <div className="font-medium text-lg mb-2">{month.name}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Income:</span>
                    <span className="text-emerald-600 font-medium">{formatCurrency(month.income)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expenses:</span>
                    <span className="text-red-600 font-medium">{formatCurrency(month.expenses)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Balance:</span>
                    <span className={`font-medium ${month.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(month.balance)}
                    </span>
                  </div>
                  <div className="pt-2 text-xs text-gray-500 text-right">
                    {month.transactions} transactions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#004a7c]">
          Financial Calendar
        </h2>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md text-sm"
            onClick={goToToday}
          >
            Today
          </button>
          
          <div className="bg-white shadow-sm rounded-md flex">
            <button 
              className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-l-md"
              onClick={prevPeriod}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="h-10 px-4 flex items-center font-medium text-gray-700">
              {currentView === "day" && currentDate.getDate()}
              {currentView === "month" && getMonthName(currentDate)}
              {currentView === "year" && getYear(currentDate)}
            </div>
            
            <button 
              className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-r-md"
              onClick={nextPeriod}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="bg-white shadow-sm rounded-md flex">
            <button 
              className={`px-4 py-2 text-sm font-medium ${currentView === "day" ? "bg-[#004a7c] text-white" : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => setCurrentView("day")}
            >
              Day
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${currentView === "month" ? "bg-[#004a7c] text-white" : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => setCurrentView("month")}
            >
              Month
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${currentView === "year" ? "bg-[#004a7c] text-white" : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => setCurrentView("year")}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004a7c]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004a7c]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
            
            <select
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004a7c]"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-600">Expense</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-sm text-gray-600">Both</span>
          </div>
          
          <div className="ml-auto">
          </div>
        </div>
      </div>

      {currentView === "day" && <DayView />}
      {currentView === "month" && <MonthView />}
      {currentView === "year" && <YearView />}
    </div>
  );
}
