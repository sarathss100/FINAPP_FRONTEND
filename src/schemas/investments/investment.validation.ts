import { z } from 'zod';

export const BaseInvestmentDTOSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    icon: z.string().optional(),
    initialAmount: z.number({ invalid_type_error: 'Amount must be a number' }).positive('Amount must be greater than zero'),
    currentValue: z.number({ invalid_type_error: 'Amount must be a number' }).optional(),
    totalProfitOrLoss: z.number({ invalid_type_error: 'Amount must be a number' }).optional(),
    relatedAccount: z.string().optional(), 
    currency: z.string().optional().default('INR'),
    notes: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

export const StockDTOSchema = BaseInvestmentDTOSchema.extend({
    type: z.literal('STOCK'),
    symbol: z.string().min(1, 'Symbol is required'),
    exchange: z.string().optional(),
    purchaseDate: z.coerce.date(),
    quantity: z.number().positive('Quantity must be greater than zero'),
    purchasePricePerShare: z.number().positive('Purchase price per share must be greater than zero'),
    currentPricePerShare: z.number().optional(),
    dividendsReceived: z.number().optional(),
}).passthrough();

export const MutualFundDTOSchema = BaseInvestmentDTOSchema.extend({
    type: z.literal('MUTUAL_FUND'),
    fundHouse: z.string().min(1, 'Fund house is required'),
    folioNumber: z.string().min(1, 'Folio number is required'),
    schemeCode: z.string().min(1, 'Scheme code is required'),
    units: z.number().positive('Units must be greater than zero'),
    purchasedNav: z.number().positive('Purchased NAV must be greater than zero'),
    currentNav: z.number().optional(),
    currentValue: z.number().optional()
}).passthrough();

export const BondDTOSchema = BaseInvestmentDTOSchema.extend({
    type: z.literal('BOND'),
    issuer: z.string().min(1, 'Issuer is required'),
    bondType: z.string().min(1, 'Bond type is required'),
    faceValue: z.number().positive('Face value must be greater than zero'),
    couponRate: z.number().positive('Coupon rate must be greater than zero'),
    maturityDate: z.coerce.date(),
    purchaseDate: z.coerce.date(),
    currentValue: z.number().optional()
}).passthrough();

export const PropertyDTOSchema = BaseInvestmentDTOSchema.extend({
    type: z.literal('PROPERTY'), 
    address: z.string().min(1, 'Address is required'),
    propertyType: z.string().min(1, 'Property type is required'),
    purchaseDate: z.coerce.date(),
    purchasePrice: z.number().positive('Purchase price must be greater than zero'),
    currentValue: z.number().optional(),
    rentalIncome: z.number().optional()
}).passthrough();

export const BusinessDTOSchema = BaseInvestmentDTOSchema.extend({
    type: z.literal('BUSINESS'), 
    businessName: z.string().min(1, 'Business name is required'),
    ownershipPercentage: z.number().positive('Ownership percentage must be greater than zero'),
    investmentDate: z.coerce.date(),
    initialInvestment: z.number().positive('Initial investment must be greater than zero'),
    currentValuation: z.number().optional(),
    annualReturn: z.number().optional()
}).passthrough();

export const FixedDepositDTOSchema = BaseInvestmentDTOSchema.extend({
    type: z.literal('FIXED_DEPOSIT'), 
    maturityDate: z.string(),
    interestRate: z.number().optional(),
    maturityAmount: z.number().optional()
}).passthrough();

export const EPFODTOSchema = BaseInvestmentDTOSchema.extend({
    type: z.literal('EPFO'), 
    accountNumber: z.string().min(1, 'Account number is required'),
    epfNumber: z.string().min(1, 'EPF number is required'),
    employerContribution: z.number().positive('Employer contribution must be greater than zero'),
    employeeContribution: z.number().positive('Employee contribution must be greater than zero'),
    interestRate: z.number().positive('Interest rate must be greater than zero'),
    maturityAmount: z.number().optional()
}).passthrough();

export const GoldDTOSchema = BaseInvestmentDTOSchema.extend({
    type: z.literal('GOLD'), 
    goldForm: z.string().min(1, 'Gold form is required'),
    goldType: z.string().min(1, 'Gold type is required'),
    weight: z.number().positive('Weight must be greater than zero'),
    purchaseDate: z.string(),
    purchasePricePerGram: z.number().positive('Purchase price per gram must be greater than zero'),
    currentPricePerGram: z.number().optional()
}).passthrough();

export const ParkingFundDTOSchema = BaseInvestmentDTOSchema.extend({
    type: z.literal('PARKING_FUND'), 
    fundType: z.string().min(1, 'Fund type is required'),
}).passthrough();

// Use discriminatedUnion for better error messages and type inference
export const InvestmentDTOSchema = z.discriminatedUnion('type', [
    StockDTOSchema,
    MutualFundDTOSchema,
    BondDTOSchema,
    PropertyDTOSchema,
    BusinessDTOSchema,
    FixedDepositDTOSchema,
    EPFODTOSchema,
    GoldDTOSchema,
    ParkingFundDTOSchema
]);

// Export the investment types for reference
export const INVESTMENT_TYPES = [
    'STOCK',
    'MUTUAL_FUND',
    'BOND',
    'PROPERTY',
    'BUSINESS', 
    'FIXED_DEPOSIT',
    'EPFO',
    'GOLD',
    'PARKING_FUND'
] as const;

