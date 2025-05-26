
// Investment Types
export enum InvestmentType {
    STOCK = 'STOCK',
    MUTUAL_FUND = 'MUTUAL_FUND',
    BOND = 'BOND',
    PROPERTY = 'PROPERTY',
    BUSINESS = 'BUSINESS',
    FIXED_DEPOSIT = 'FIXED_DEPOSIT',
    EPFO = 'EPFO',
    GOLD = 'GOLD',
    PARKING_FUND = 'PARKING_FUND',
    OTHER  = 'OTHER',
}

// Base Interface 
interface IBaseInvestment {
    name: string;
    icon?: string;
    amount: number;
    currency?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IInvestmentDocument {
    userId: string;
    type: InvestmentType;
}

// Type-Specific Interfaces 
export interface IStock extends IBaseInvestment {
    symbol: string;
    exchange?: string;
    purchaseDate: Date;
    quantity: number;
    purchasePricePerShare: number;
    currentPricePerShare?: number;
    dividendsReceived?: number;
}

export interface IStockDocument extends IInvestmentDocument {
    type: InvestmentType.STOCK;
    details: IStock
}

export interface IMutualFund extends IBaseInvestment {
    fundHouse: string;
    folioNumber: string;
    schemeCode: string;
    units: number;
    purchasedNav: number;
    currentNav?: number;
    currentValue?: number;
}

export interface IMutualFundDocument extends IInvestmentDocument {
    type: InvestmentType.MUTUAL_FUND;
    details: IMutualFund;
}

export interface IBond extends IBaseInvestment {
    issuer: string;
    bondType: string;
    faceValue: number;
    couponRate: number;
    maturityDate: Date;
    purchaseDate: Date;
    currentValue?: number;
}

export interface IBondDocument extends IInvestmentDocument {
    type: InvestmentType.BOND;
    details: IBond;
}

export interface IProperty extends IBaseInvestment {
    address: string;
    propertyType: string;
    purchaseDate: Date;
    purchasePrice: number;
    currentValue?: number;
    rentalIncome?: number;
}

export interface IPropertyDocument extends IInvestmentDocument {
    type: InvestmentType.PROPERTY;
    details: IProperty;
}

export interface IBusiness extends IBaseInvestment {
    businessName: string;
    ownershipPercentage: number;
    investmentDate: Date;
    initialInvestment: number;
    currentValuation?: number;
    annualReturn?: number;
}

export interface IBusinessDocument extends IInvestmentDocument {
    type: InvestmentType.BUSINESS;
    details: IBusiness;
}

export interface IFixedDeposit extends IBaseInvestment {
    bank: string;
    account_number: string;
    maturity_date: Date;
    interest_rate: number;
    maturity_amount?: number;
}

export interface IFixedDepositDocument extends IInvestmentDocument {
    type: InvestmentType.FIXED_DEPOSIT;
    details: IFixedDeposit;
}

export interface IEPFO extends IBaseInvestment {
    account_number: string;
    epf_number: string;
    employer_contribution: number;
    employee_contribution: number;
    interest_rate: number;
    maturity_amount?: number;
}

export interface IEPFODocument extends IInvestmentDocument {
    type: InvestmentType.EPFO;
    details: IEPFO;
}

export interface IGold extends IBaseInvestment {
    goldForm: string;
    goldType: string;
    weight: number;
    purchaseDate: Date;
    purchasePricePerGram: number;
    currentPricePerGram?: number;
}

export interface IGoldDocument extends IInvestmentDocument {
    type: InvestmentType.GOLD;
    details: IGold;
}

export interface IParkingFund extends IBaseInvestment {
    fundType: string;
    linkedAccountId: string;
}

export interface IParkingFundDocument extends IInvestmentDocument {
    type: InvestmentType.PARKING_FUND;
    details: IParkingFund;
}

export interface IOtherInvestmentDocument extends IInvestmentDocument {
    type: InvestmentType.OTHER;
    details: IBaseInvestment & {
        notes?: string;
    }
}

// Union Type for Details
export type InvestmentDetails =
    | IStock
    | IMutualFund
    | IBond
    | IProperty
    | IBusiness
    | IFixedDeposit
    | IEPFO
    | IGold
    | IParkingFund;

export type InvestmentDocument =
    | IStockDocument
    | IMutualFundDocument
    | IBondDocument
    | IPropertyDocument
    | IBusinessDocument
    | IFixedDepositDocument
    | IEPFODocument
    | IGoldDocument
    | IParkingFundDocument
    | IOtherInvestmentDocument;

// Base Investment Document 
export interface IInvestments {
    userId: string;
    type: InvestmentType;
    details: InvestmentDetails;
}

export interface IStock {
    '1. symbol': string;
    '2. name': string;
    '3. type': string;
    '4. region': string;
    '5. marketOpen': string;
    '6. marketClose': string;
    '7. timezone': string;
    '8. currency': string;
    '9. matchScore': string;
}

export interface IStockDetails {
    success: boolean,
    message: string,
    data: { stocks: IStock[] };
}

export interface IMutualFundDTO {
    scheme_code: string;
    scheme_name: string;
    net_asset_value: number;
    date: string;
}

export interface IMutualFundSearchResult {
    success: boolean,
    message: string,
    data: {
        mutualFunds: IMutualFundDTO[];
    }
}
