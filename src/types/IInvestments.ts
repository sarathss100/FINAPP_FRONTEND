
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
}

// Base Interface 
export interface IBaseInvestment {
    userId: string;
    name: string;
    accountId: string;
    icon: string;
    initialAmount: number;
    currentValue?: number;
    totalProfitOrLoss?: number;
    currency: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IInvestmentDocument {
    userId: string;
    type: InvestmentType;
}

// Type-Specific Interfaces 
export interface IStock extends IBaseInvestment {
    type: InvestmentType.STOCK;
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
    type: InvestmentType.MUTUAL_FUND,
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
    type: InvestmentType.BOND;
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
    type: InvestmentType.PROPERTY;
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
    type: InvestmentType.BUSINESS;
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
    type: InvestmentType.FIXED_DEPOSIT;
    bank: string;
    accountNumber: string;
    maturityDate: Date;
    interestRate: number;
    maturityAmount?: number;
}

export interface IFixedDepositDocument extends IInvestmentDocument {
    type: InvestmentType.FIXED_DEPOSIT;
    details: IFixedDeposit;
}

export interface IEPFO extends IBaseInvestment {
    type: InvestmentType.EPFO;
    accountNumber: string;
    epfNumber: string;
    employerContribution: number;
    employeeContribution: number;
    interestRate: number;
    maturityAmount?: number;
}

export interface IEPFODocument extends IInvestmentDocument {
    type: InvestmentType.EPFO;
    details: IEPFO;
}

export interface IGold extends IBaseInvestment {
    type: InvestmentType.GOLD;
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
    type: InvestmentType.PARKING_FUND;
    fundType: string;
    linkedAccountId: string;
}

export interface IParkingFundDocument extends IInvestmentDocument {
    type: InvestmentType.PARKING_FUND;
    details: IParkingFund;
}

// Union Type for Details
export type Investments =
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
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

export interface IInvestmentDetails {
    success: boolean,
    message: string,
    data: {
        investment: Investments;
    }
}

export interface ITotalInvestedAmount {
    success: boolean,
    message: string,
    data: {
        totalInvestedAmount: number;
    }
}