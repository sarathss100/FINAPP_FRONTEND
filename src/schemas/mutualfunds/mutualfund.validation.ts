import { z } from 'zod';

export const mutualfundDTOSchema = z.object({
    scheme_code: z.string().min(1, { message: `Scheme code is required` }),
    scheme_name: z.string().min(1, { message: `Scheme name is required `}),
    net_asset_value: z.number({ invalid_type_error: `Net Asset Value must be a number` }),
    date: z.date().refine(date => !isNaN(date.getTime()), {
        message: `Invalid date format`,
    }),
});
