"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/Dialog';
import { 
  TrendingUp, IndianRupee,
  Building, Landmark,  Search, Calendar,
  Briefcase, Coins, Target, Home, Factory,
  Loader2, X
} from "lucide-react";
import { Badge } from '@/components/base/Badge';
import { InvestmentDocument, InvestmentType, IStock, InvestmentDetails, IMutualFund, IBond, IGold, IEPFO, IFixedDeposit, IBusiness, IProperty, IParkingFund } from '@/types/IInvestments';
import { toast } from 'react-toastify';
import { searchMutualFundFromApi, searchStocksFromApi } from '@/service/investmentService';

// Investment Types
const INVESTMENT_TYPES = [
  'STOCK', 'MUTUAL_FUND', 'BOND', 'PROPERTY', 'BUSINESS', 
  'FIXED_DEPOSIT', 'EPFO', 'GOLD', 'PARKING_FUND', 'OTHER'
];

const GOLD_FORMS = ['Jewelry', 'Coins', 'Bars', 'ETF'];
const GOLD_TYPES = ['24K', '22K', '18K', '14K'];
const PROPERTY_TYPES = ['Residential', 'Commercial', 'Agricultural', 'Industrial'];
const BOND_TYPES = ['Government', 'Corporate', 'Municipal', 'Treasury'];

interface SearchResult {
  symbol?: string;
  name: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  schemeCode?: string;
  fundHouse?: string;
  category?: string;
  nav?: number;
  price?: number;
}

interface InvestmentInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSaveInvestment: (investmentData: IInvestmentDocument) => void;
  initialData?: InvestmentDocument | null;
  isEditing?: boolean;
}

export default function InvestmentInputModal({ 
  isOpen, 
  onClose, 
  // onSaveInvestment,
  initialData = null,
  isEditing = false
}: InvestmentInputModalProps) {
  const [formData, setFormData] = useState(() => {
    if (!initialData) {
      return {
        type: InvestmentType.STOCK,
        name: '',
        amount: '',
        currency: 'INR',
        notes: '',
        purchaseDate: new Date().toISOString().split('T')[0],
      };
    }
  
    const base = {
      type: initialData.type,
      name: initialData.details.name || '',
      icon: initialData.details.icon || '',
      amount: initialData.details.amount.toString(),
      currency: initialData.details.currency || 'INR',
      notes: initialData.details.notes || '',
      createdAt: initialData.details.createdAt.toISOString().split('T')[0],
      updatedAt: initialData.details.updatedAt.toISOString().split('T')[0],
    };
  
    // Narrow based on type
    switch (initialData.type) {
      case InvestmentType.STOCK:
        return {
          ...base,
          symbol: initialData.details.symbol || '',
          exchange: initialData.details.exchange || '',
          purchaseDate: initialData.details.purchaseDate
            ? new Date(initialData.details.purchaseDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          quantity: initialData.details.quantity?.toString() || '',
          purchasePricePerShare: initialData.details.purchasePricePerShare?.toString() || '',
          currentPricePerShare: initialData.details.currentPricePerShare?.toString() || '',
          dividendsReceived: initialData.details.dividendsReceived?.toString() || '',
        };
  
      case InvestmentType.MUTUAL_FUND:
        return {
          ...base,
          fundHouse: initialData.details.fundHouse || '',
          folioNumber: initialData.details.folioNumber || '',
          schemeCode: initialData.details.schemeCode || '',
          units: initialData.details.units?.toString() || '',
          purchasedNav: initialData.details.purchasedNav?.toString() || '',
          currentNav: initialData.details.currentNav?.toString() || '',
          currentValue: initialData.details.currentValue?.toString() || '',
        };
  
      case InvestmentType.BOND:
        return {
          ...base,
          issuer: initialData.details.issuer || '',
          bondType: initialData.details.bondType || 'Government',
          faceValue: initialData.details.faceValue?.toString() || '',
          couponRate: initialData.details.couponRate?.toString() || '',
          maturityDate: initialData.details.maturityDate
            ? new Date(initialData.details.maturityDate).toISOString().split('T')[0]
            : '',
          purchaseDate: initialData.details.purchaseDate || '',
          currentValue: initialData.details.currentValue?.toString() || '',
        };
  
      case InvestmentType.PROPERTY:
        return {
          ...base,
          address: initialData.details.address || '',
          propertyType: initialData.details.propertyType || 'Residential',
          purchaseDate: initialData.details.purchaseDate
            ? new Date(initialData.details.purchaseDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          purchasePrice: initialData.details.purchasePrice?.toString() || '',
          currentValue: initialData.details.currentValue?.toString() || '',
          rentalIncome: initialData.details.rentalIncome?.toString() || '',
        };
  
      case InvestmentType.BUSINESS:
        return {
          ...base,
          businessName: initialData.details.businessName || '',
          ownershipPercentage: initialData.details.ownershipPercentage?.toString() || '',
          investmentDate: initialData.details.investmentDate
            ? new Date(initialData.details.investmentDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          initialInvestment: initialData.details.initialInvestment?.toString() || '',
          currentValuation: initialData.details.currentValuation?.toString() || '',
          annualReturn: initialData.details.annualReturn?.toString() || '',
        };
  
      case InvestmentType.FIXED_DEPOSIT:
        return {
          ...base,
          bank: initialData.details.bank || '',
          account_number: initialData.details.account_number || '',
          maturity_date: initialData.details.maturity_date
            ? new Date(initialData.details.maturity_date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          interest_rate: initialData.details.interest_rate?.toString() || '',
          maturity_amount: initialData.details.maturity_amount?.toString() || '',
        };
  
      case InvestmentType.EPFO:
        return {
          ...base,
          account_number: initialData.details.account_number || '',
          epf_number: initialData.details.epf_number || '',
          employer_contribution: initialData.details.employer_contribution?.toString() || '',
          employee_contribution: initialData.details.employee_contribution?.toString() || '',
          interest_rate: initialData.details.interest_rate?.toString() || '',
          maturity_amount: initialData.details.maturity_amount?.toString() || '',
        };
  
      case InvestmentType.GOLD:
        return {
          ...base,
          goldForm: initialData.details.goldForm || 'Coins',
          goldType: initialData.details.goldType || '24K',
          weight: initialData.details.weight?.toString() || '',
          purchaseDate: initialData.details.purchaseDate
            ? new Date(initialData.details.purchaseDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          purchasePricePerGram: initialData.details.purchasePricePerGram?.toString() || '',
          currentPricePerGram: initialData.details.currentPricePerGram?.toString() || '',
        };
  
      case InvestmentType.PARKING_FUND:
        return {
          ...base,
          fundType: initialData.details.fundType || '',
          linkedAccountId: initialData.details.linkedAccountId || '',
        };
  
      case InvestmentType.OTHER:
        return {
          ...base,
          notes: initialData.details.notes || '',
        }
      default:
        return base;
    }
  });

    // Search states
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTypes, setFilteredTypes] = useState([...INVESTMENT_TYPES]);
    const [stockSearchQuery, setStockSearchQuery] = useState('');
    const [mfSearchQuery, setMfSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTerm) {
      setFilteredTypes(
        INVESTMENT_TYPES.filter((type) => 
          type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredTypes([...INVESTMENT_TYPES]);
    }
  }, [searchTerm]);

    const searchStocks = useCallback(async (query: string): Promise<SearchResult[]> => {
        try {
            const stockData = await searchStocksFromApi(query);
            const searchResults: SearchResult[] = stockData.data.stocks.map((stock: IStock) => ({
                symbol: stock['1. symbol'],
                name: stock['2. name'],
                exchange: stock['4. region'],
                category: stock['3. type']
            }));

            return searchResults;
        } catch (error) {
            toast.error((error as Error).message || `Failed To Fetch Stock Details`);
            return [];
        }
    }, []);

  const searchMutualFunds = useCallback(async (query: string): Promise<SearchResult[]> => {
    try {
      const mfData = await searchMutualFundFromApi(query);
      const searchResults: SearchResult[] = mfData.data.mutualFunds.map((mf: { scheme_name: string, scheme_code: string, net_asset_value: number, date: string }) => ({
        name: mf.scheme_name,
        schemeCode: mf.scheme_code,
        fundHouse: mf.scheme_name.split(' ')[0],
        category: mf.scheme_name.split('-').pop() || '',
        nav: mf.net_asset_value,
      }));
      return searchResults;
    } catch (error) {
      toast.error((error as Error).message || `Failed To Fetch Mutual Fund Details`);
      return [];
    }
  }, []);
    
    const debouncedSearch = useCallback((query: string, type: string) => {
        // Clear exisiting timeout 
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // If query is empty, clear results immediately
        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            setIsSearching(false);
            return;
        }

        // Set Loading state
        setIsSearching(true);

        // Set new timeout
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                let results: SearchResult[] = [];

                if (type === 'STOCK') {
                    results = await searchStocks(query);
                } else if (type === 'MUTUAL_FUND') {
                    results = await searchMutualFunds(query);
                }

                setSearchResults(results);
                setShowSearchResults(true);
            } catch (error) {
                console.error(`Search error:`, error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 1000);
    }, [searchStocks, searchMutualFunds]);

  useEffect(() => {
    if (formData.type === InvestmentType.STOCK && stockSearchQuery) {
      debouncedSearch(stockSearchQuery, 'STOCK');
    } else if (formData.type === InvestmentType.MUTUAL_FUND && mfSearchQuery) {
        debouncedSearch(mfSearchQuery, 'MUTUAL_FUND');
    } else {
        // Clear results if no query 
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        setSearchResults([]);
        setShowSearchResults(false);
        setIsSearching(false);
      }
      
      // Cleanup function
      return () => {
          if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
          }
      };
  }, [stockSearchQuery, mfSearchQuery, formData.type, debouncedSearch]);
    
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        }
    }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: string) => {
    setFormData(prev => {
      const baseState = {
        type: type as InvestmentType,
        name: prev.name || '',
        amount: prev.amount || '',
        currency: prev.currency || 'INR',
        notes: prev.notes || '',
        purchaseDate: new Date().toISOString().split('T')[0],
      };

      switch (type as InvestmentType) {
        case InvestmentType.STOCK:
          return {
            ...baseState,
            symbol: '',
            exchange: '',
            purchaseDate: '',
            quantity: '',
            purchasePricePerShare: '',
            currentPricePerShare: '',
            dividendsReceived: '',
          };
        case InvestmentType.MUTUAL_FUND:
          return {
            ...baseState,
            fundHouse: '',
            folioNumber: '',
            schemeCode: '',
            units: '',
            purchasedNav: '',
            currentNav: '',
            currentValue: '',
          };
        case InvestmentType.BOND:
          return {
            ...baseState,
            issuer: '',
            bondType: 'Government',
            faceValue: '',
            couponRate: '',
            maturityDate: '',
            purchaseDate: '',
            currentValue: '',
          };
        case InvestmentType.PROPERTY:
          return {
            ...baseState,
            address: '',
            propertyType: 'Residential',
            purchaseDate: '',
            purchasePrice: '',
            currentValue: '',
            rentalIncome: '',
          };
        case InvestmentType.BUSINESS:
          return {
            ...baseState,
            businessName: '',
            ownershipPercentage: '',
            investmentDate: new Date().toISOString().split('T')[0],
            initialInvestment: '',
            currentValuation: '',
            annualReturn: '',
          };
        case InvestmentType.FIXED_DEPOSIT:
          return {
            ...baseState,
            bank: '',
            account_number: '',
            maturity_date: new Date().toISOString().split('T')[0],
            interest_rate: '',
            maturity_amount: '',
          };
        case InvestmentType.EPFO:
          return {
            ...baseState,
            account_number: '',
            epf_number: '',
            employer_contribution: '',
            employee_contribution: '',
            interest_rate: '',
            maturity_amount: '',
          };
        case InvestmentType.GOLD:
          return {
            ...baseState,
            goldForm: 'Coins',
            goldType: '24K',
            weight: '',
            purchaseDate: '',
            purchasePricePerGram: '',
            currentPricePerGram: '',
          };
        case InvestmentType.PARKING_FUND:
          return {
            ...baseState,
            fundType: '',
            linkedAccountId: '',
          };
        default:
          return baseState;
      }
    });
    setSearchResults([]);
    setShowSearchResults(false);
    setStockSearchQuery('');
    setMfSearchQuery('');
  };

  const handleSearchResultSelect = (result: SearchResult) => {
    if (formData.type === InvestmentType.STOCK) {
      setFormData(prev => ({
        ...prev,
        name: result.name,
        symbol: result.symbol || '',
        exchange: result.exchange || '',
        currentPricePerShare: result.price?.toString() || '',
        sector: result.sector || '',
        industry: result.industry || ''
      }));
        setStockSearchQuery(result.symbol || result.name);
    } else if (formData.type === InvestmentType.MUTUAL_FUND) {
      setFormData(prev => ({
        ...prev,
        name: result.name,
        schemeCode: result.schemeCode || '',
        fundHouse: result.fundHouse || '',
        currentNav: result.nav?.toString() || '',
        category: result.category || ''
      }));
      setMfSearchQuery(result.name);
      }
      clearSearch();
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    if (formData.type === InvestmentType.STOCK) {
      setStockSearchQuery('');
    } else if (formData.type === InvestmentType.MUTUAL_FUND) {
      setMfSearchQuery('');
    }
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }
  
    let investmentDetails: InvestmentDetails;
  
    switch (formData.type) {
      case InvestmentType.STOCK:
        if ('symbol' in formData) {
          investmentDetails = {
            name: formData.name,
            amount: Number(formData.amount),
            currency: formData.currency,
            notes: formData.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            symbol: formData.symbol,
            exchange: formData.exchange,
            purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : new Date(),
            quantity: Number(formData.quantity),
            purchasePricePerShare: Number(formData.purchasePricePerShare),
            currentPricePerShare: formData.currentPricePerShare ? Number(formData.currentPricePerShare) : undefined,
            dividendsReceived: formData.dividendsReceived ? Number(formData.dividendsReceived) : undefined,
            '1. symbol': formData.symbol,
            '2. name': formData.name,
            '3. type': 'stock',
            '4. region': formData.exchange,
            '5. marketOpen': '',
            '6. marketClose': '',
            '7. timezone': '',
            '8. currency': formData.currency,
            '9. matchScore': '1.0000'
          } as IStock;
        } else {
          throw new Error("Invalid form data for stock investment");
        }
        break;
  
      case InvestmentType.MUTUAL_FUND:
        if (formData.type === InvestmentType.MUTUAL_FUND && 'folioNumber' in formData) {
          investmentDetails = {
            name: formData.name,
            amount: Number(formData.amount),
            currency: formData.currency,
            notes: formData.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            fundHouse: formData.fundHouse || '',
            folioNumber: formData.folioNumber,
            schemeCode: formData.schemeCode,
            units: Number(formData.units),
            purchasedNav: Number(formData.purchasedNav),
            currentNav: formData.currentNav ? Number(formData.currentNav) : undefined,
            currentValue: formData.currentValue ? Number(formData.currentValue) : undefined,
          } as IMutualFund;
        } else {
          throw new Error("Invalid form data for mutual fund investment");
        }
        break;
      
      case InvestmentType.BOND:
        if (formData.type === InvestmentType.BOND && 'issuer' in formData) {
          investmentDetails = {
            name: formData.name,
            amount: Number(formData.amount),
            currency: formData.currency,
            notes: formData.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            issuer: formData.issuer,
            bondType: formData.bondType,
            faceValue: Number(formData.faceValue),
            couponRate: Number(formData.couponRate),
            maturityDate: new Date(formData.maturityDate),
            currentValue: formData.currentValue ? Number(formData.currentValue) : undefined,
          } as IBond;
        } else {
          throw new Error("Invalid form data for bond investment");
        }
        break;

      case InvestmentType.PROPERTY:
        if (formData.type === InvestmentType.PROPERTY && 'address' in formData) {
          investmentDetails = {
            name: formData.name,
            amount: Number(formData.amount),
            currency: formData.currency,
            notes: formData.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            address: formData.address,
            propertyType: formData.propertyType,
            purchaseDate: new Date(formData.purchaseDate),
            purchasePrice: Number(formData.purchasePrice),
            currentValue: formData.currentValue ? Number(formData.currentValue) : undefined,
            rentalIncome: formData.rentalIncome ? Number(formData.rentalIncome) : undefined,
          } as IProperty;
        } else {
          throw new Error("Invalid form data for property investment");
        }
        break;

      case InvestmentType.BUSINESS:
        if (formData.type === InvestmentType.BUSINESS && 'businessName' in formData) {
          investmentDetails = {
            name: formData.name,
            amount: Number(formData.amount),
            currency: formData.currency,
            notes: formData.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            businessName: formData.businessName,
            ownershipPercentage: Number(formData.ownershipPercentage),
            investmentDate: new Date(formData.investmentDate),
            initialInvestment: Number(formData.initialInvestment),
            currentValuation: formData.currentValuation ? Number(formData.currentValuation) : undefined,
            annualReturn: formData.annualReturn ? Number(formData.annualReturn) : undefined,
          } as IBusiness;
        } else {
          throw new Error("Invalid form data for business investment");
        }
        break;

      case InvestmentType.FIXED_DEPOSIT:
        if (formData.type === InvestmentType.FIXED_DEPOSIT && 'bank' in formData) {
          investmentDetails = {
            name: formData.name,
            amount: Number(formData.amount),
            currency: formData.currency,
            notes: formData.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            bank: formData.bank,
          } as IFixedDeposit;
        } else {
          throw new Error("Invalid form data for fixed deposit investment");
        }
        break;

      case InvestmentType.EPFO:
        if (formData.type === InvestmentType.EPFO && 'epf_number' in formData) {
          investmentDetails = {
            name: formData.name,
            amount: Number(formData.amount),
            currency: formData.currency,
            notes: formData.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            account_number: formData.account_number,
            epf_number: formData.epf_number,
            employer_contribution: Number(formData.employer_contribution),
            employee_contribution: Number(formData.employee_contribution),
            interest_rate: Number(formData.interest_rate),
            maturity_amount: formData.maturity_amount ? Number(formData.maturity_amount) : undefined,
          } as IEPFO;
        } else {
          throw new Error("Invalid form data for EPFO investment");
        }
        break;

      case InvestmentType.GOLD:
        if (formData.type === InvestmentType.GOLD && 'goldForm' in formData) {
          investmentDetails = {
            name: formData.name,
            amount: Number(formData.amount),
            currency: formData.currency,
            notes: formData.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            goldForm: formData.goldForm,
            goldType: formData.goldType,
            weight: Number(formData.weight),
            purchaseDate: new Date(formData.purchaseDate),
            purchasePricePerGram: Number(formData.purchasePricePerGram),
            currentPricePerGram: formData.currentPricePerGram ? Number(formData.currentPricePerGram) : undefined,
          } as IGold;
        } else {
          throw new Error("Invalid form data for gold investment");
        }
        break;

      case InvestmentType.PARKING_FUND:
        if (formData.type === InvestmentType.PARKING_FUND && 'fundType' in formData) {
          investmentDetails = {
            name: formData.name,
            amount: Number(formData.amount),
            currency: formData.currency,
            notes: formData.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            fundType: formData.fundType,
            linkedAccountId: formData.linkedAccountId,
          } as IParkingFund;
        } else {
          throw new Error("Invalid form data for parking fund investment");
        }
        break;

      case InvestmentType.OTHER:
      default:
        investmentDetails = {
          name: formData.name,
          amount: Number(formData.amount),
          currency: formData.currency,
          notes: formData.notes,
          createdAt: new Date(),
          updatedAt: new Date(),
          bank: '',
          account_number: '',
          deposit_number: '',
          maturity_date: new Date(),
          interest_rate: 0,
        } as IFixedDeposit;
        break;
    }

    // Create the investment document
    const investmentDocument: InvestmentDocument = {
      userId: 'user123', 
      type: formData.type,
      details: investmentDetails,
    } as InvestmentDocument;

    try {
      // Here you would typically call your API to save the investment
      // await saveInvestment(investmentDocument);
      console.log('Investment saved:', investmentDocument);
      
      // Reset form or redirect user
      // resetForm();
      // navigate('/investments');
    } catch (error) {
      console.error('Error saving investment:', error);
      alert('Error saving investment. Please try again.');
    }
};

  const getInvestmentIcon = (type: string) => {
    switch (type) {
      case 'STOCK':
        return <TrendingUp className="h-5 w-5" />;
      case 'MUTUAL_FUND':
        return <Target className="h-5 w-5" />;
      case 'BOND':
        return <Landmark className="h-5 w-5" />;
      case 'PROPERTY':
        return <Home className="h-5 w-5" />;
      case 'BUSINESS':
        return <Factory className="h-5 w-5" />;
      case 'FIXED_DEPOSIT':
        return <Building className="h-5 w-5" />;
      case 'EPFO':
        return <Briefcase className="h-5 w-5" />;
      case 'GOLD':
        return <Coins className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const formatTypeDisplay = (type: string) => {
    return type.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const renderSearchField = () => {
    if (formData.type !== InvestmentType.STOCK && formData.type !== InvestmentType.MUTUAL_FUND) {
      return null;
    }

    const searchQuery = formData.type === InvestmentType.STOCK ? stockSearchQuery : mfSearchQuery;
    const setSearchQuery = formData.type === InvestmentType.STOCK ? setStockSearchQuery : setMfSearchQuery;
    const placeholder = formData.type === InvestmentType.STOCK 
      ? 'Search stocks by symbol or name...' 
      : 'Search mutual funds by name...';

    return (
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search {formData.type === InvestmentType.STOCK ? 'Stock' : 'Mutual Fund'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-10 w-full rounded-md border border-gray-300 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={placeholder}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSearchResultSelect(result)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {formData.type === InvestmentType.STOCK ? result.symbol : result.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.type === InvestmentType.STOCK ? result.name : result.fundHouse}
                    </div>
                    {formData.type === InvestmentType.MUTUAL_FUND && result.category && (
                      <div className="text-xs text-gray-500">
                        {result.category}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showSearchResults && searchResults.length === 0 && !isSearching && searchQuery && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3">
            <div className="text-gray-500 text-sm">
              No {formData.type === InvestmentType.STOCK ? 'stocks' : 'mutual funds'} found for &quot;{searchQuery}&quot;
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'STOCK':
        return (
          <div className="space-y-4">
            {renderSearchField()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Symbol*
                </label>
                <input
                  type="text"
                  name="symbol"
                  value={'symbol' in formData ? formData.symbol : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., RELIANCE"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exchange
                </label>
                <input
                  type="text"
                  name="exchange"
                  value={'exchange' in formData ? formData.exchange : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., NSE, BSE"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity*
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={'quantity' in formData ? formData.quantity : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Number of shares"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price/Share*
                </label>
                <input
                  type="number"
                  name="purchasePricePerShare"
                  value={'purchasePricePerShare' in formData ? formData.purchasePricePerShare : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Price/Share
                </label>
                <input
                  type="number"
                  name="currentPricePerShare"
                  value={'currentPricePerShare' in formData ? formData.currentPricePerShare : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div> */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dividends Received
              </label>
              <input
                type="number"
                name="dividendsReceived"
                value={'dividendsReceived' in formData ? formData.dividendsReceived : ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
        );

      case 'MUTUAL_FUND':
        return (
          <div className="space-y-4">
            {renderSearchField()}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fund House
                </label>
                <input
                  type="text"
                  name="fundHouse"
                  value={'fundHouse' in formData ? formData.fundHouse : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., SBI, HDFC"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Folio Number
                </label>
                <input
                  type="text"
                  name="folioNumber"
                  value={'folioNumber' in formData ? formData.folioNumber : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Folio number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheme Code
                </label>
                <input
                  type="text"
                  name="schemeCode"
                  value={'schemeCode' in formData ? formData.schemeCode : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Scheme code"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Units
                </label>
                <input
                  type="number"
                  name="units"
                  value={'units' in formData ? formData.units : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Number of units"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchased NAV
                </label>
                <input
                  type="number"
                  name="purchasedNav"
                  value={'purchasedNav' in formData ? formData.purchasedNav : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="NAV at purchase"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current NAV
                </label>
                <input
                  type="number"
                  name="currentNav"
                  value={'currentNav' in formData ? formData.currentNav : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Current NAV"
                />
              </div>
            </div>
          </div>
        );

      case 'BOND':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuer
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={'issuer' in formData ? formData.issuer : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Bond issuer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bond Type
                </label>
                <select
                  name="bondType"
                  value={'bondType' in formData ? formData.bondType : 'Government'}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  {BOND_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Face Value
                </label>
                <input
                  type="number"
                  name="faceValue"
                  value={'faceValue' in formData ? formData.faceValue : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Face value"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Rate (%)
                </label>
                <input
                  type="number"
                  name="couponRate"
                  value={'couponRate' in formData ? formData.couponRate : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Interest rate"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maturity Date
              </label>
              <input
                type="date"
                name="maturityDate"
                value={'maturityDate' in formData ? formData.maturityDate : ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        );

      case 'PROPERTY':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={'address' in formData ? formData.address : ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Property address"
                rows={2}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={'propertyType' in formData ? formData.propertyType : 'Residential'}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price
                </label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={'purchasePrice' in formData ? formData.purchasePrice : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Purchase price"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Value
                </label>
                <input
                  type="number"
                  name="currentValue"
                  value={'currentValue' in formData ? formData.currentValue : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Current market value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rental Income
                </label>
                <input
                  type="number"
                  name="rentalIncome"
                  value={'rentalIncome' in formData ? formData.rentalIncome : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Monthly rental"
                />
              </div>
            </div>
          </div>
        );

      case 'GOLD':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gold Form
                </label>
                <select
                  name="goldForm"
                  value={'goldForm' in formData ? formData.goldForm : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  {GOLD_FORMS.map((form) => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gold Type
                </label>
                <select
                  name="goldType"
                  value={'goldType' in formData ? formData.goldType : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  {GOLD_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={'weight' in formData ? formData.weight : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Weight in grams"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price/gram
                </label>
                <input
                  type="number"
                  name="purchasePricePerGram"
                  value={'purchasePricePerGram' in formData ? formData.purchasePricePerGram : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Price per gram"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Price/gram
                </label>
                <input
                  type="number"
                  name="currentPricePerGram"
                  value={'currentPricePerGram' in formData ? formData.currentPricePerGram : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Current price/gram"
                />
              </div>
            </div>
          </div>
        );

      case 'FIXED_DEPOSIT':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank
                </label>
                <input
                  type="text"
                  name="bank"
                  value={'bank' in formData ? formData.bank : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Bank name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="account_number"
                  value={'account_number' in formData ? formData.account_number : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Account number"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  name="interest_rate"
                  value={'interest_rate' in formData ? formData.interest_rate : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Interest rate"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maturity Date
                </label>
                <input
                  type="date"
                  name="maturityDate"
                  value={'maturityDate' in formData ? formData.maturityDate : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maturity Amount
                </label>
                <input
                  type="number"
                  name="maturity_amount"
                  value={'maturity_amount' in formData ? formData.maturity_amount : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Expected maturity amount"
                />
              </div>
            </div>
          </div>
        );

      case 'EPFO':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number*
                </label>
                <input
                  type="text"
                  name="account_number"
                  value={'account_number' in formData ? formData.account_number : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="EPFO account number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EPF Number*
                </label>
                <input
                  type="text"
                  name="epf_number"
                  value={'epf_number' in formData ? formData.epf_number : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="EPF number"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employer Contribution*
                </label>
                <input
                  type="number"
                  name="employer_contribution"
                  value={'employer_contribution' in formData ? formData.employer_contribution : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Employer contribution"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Contribution*
                </label>
                <input
                  type="number"
                  name="employee_contribution"
                  value={'employee_contribution' in formData ? formData.employee_contribution : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Employee contribution"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  name="interest_rate"
                  value={'interest_rate' in formData ? formData.interest_rate : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Interest rate"
                />
              </div>
            </div>
          </div>
        );

      case 'BUSINESS':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name*
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={'businessName' in formData ? formData.businessName : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Business name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ownership Percentage*
                </label>
                <input
                  type="number"
                  name="ownershipPercentage"
                  value={'ownershipPercentage' in formData ? formData.ownershipPercentage : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ownership %"
                  max="100"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Investment*
                </label>
                <input
                  type="number"
                  name="initialInvestment"
                  value={'initialInvestment' in formData ? formData.initialInvestment : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Initial investment amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Valuation
                </label>
                <input
                  type="number"
                  name="currentValuation"
                  value={'currentValuation' in formData ? formData.currentValuation : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Current business valuation"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Return (%)
              </label>
              <input
                type="number"
                name="annualReturn"
                value={'annualReturn' in formData ? formData.annualReturn : ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Annual return percentage"
              />
            </div>
          </div>
        );

      case 'PARKING_FUND':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fund Type
                </label>
                <input
                  type="text"
                  name="fundType"
                  value={'fundType' in formData ? formData.fundType : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Liquid Fund, Savings"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Linked Account ID
                </label>
                <input
                  type="text"
                  name="linkedAccountId"
                  value={'linkedAccountId' in formData ? formData.linkedAccountId : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Linked account ID"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investment Details
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Additional details about your investment"
                rows={4}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div>
              <Badge 
                className="rounded-full mb-3 bg-green-100 text-green-800 flex items-center w-fit px-2 py-1"
                variant="outline"
              >
                {getInvestmentIcon(formData.type)}
                <span className="ml-1">{formatTypeDisplay(formData.type)}</span>
              </Badge>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Investment' : 'New Investment'}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-4">
          {/* Investment Type Selection */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Investment Type
              </h3>
              
              {/* Search Types */}
              <div className="mb-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full rounded-md border border-gray-300 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Search investment types..."
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filteredTypes.map((type) => (
                  <Badge
                    key={type}
                    className={`cursor-pointer transition-colors ${
                      formData.type === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleTypeSelect(type)}
                  >
                    <span className="flex items-center">
                      {getInvestmentIcon(type)}
                      <span className="ml-1">{formatTypeDisplay(type)}</span>
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Form Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Basic Details Section */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <IndianRupee className="h-5 w-5 mr-2 text-blue-600" />
                Basic Details
              </h3>
              
              <div className="space-y-4">
                {/* Investment Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Name your investment"
                    required
                  />
                </div>
                
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Amount*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="pl-9 w-full rounded-md border border-gray-300 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                {/* Purchase/Investment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === InvestmentType.BUSINESS ? 'Investment Date*' : 'Purchase Date*'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="date"
                      name={formData.type === InvestmentType.BUSINESS ? 'investmentDate' : 'purchaseDate'}
                      value={formData.type === InvestmentType.BUSINESS ? ('investmentDate' in formData ? formData.investmentDate?.toString() : '') : ('purchaseDate' in formData ? formData.purchaseDate?.toString() : '')}
                      onChange={handleInputChange}
                      className="pl-9 w-full rounded-md border border-gray-300 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Additional notes about your investment"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            {/* Type-Specific Details Section */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                {getInvestmentIcon(formData.type)}
                <span className="ml-2">{formatTypeDisplay(formData.type)} Details</span>
              </h3>
              
              {renderTypeSpecificFields()}
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              {isEditing ? 'Update Investment' : 'Save Investment'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
