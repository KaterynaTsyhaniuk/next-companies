export interface SummaryStats {
    promotions: number;
    categories: number;
    newCompanies: number;
    activeCompanies: number;
}

export interface SummarySales {
    id: string;
    companyId: string;
    companyTitle: string;
    sold: number;
    income: number;
}

export interface Country {
    id: string;
    title: string;
}

export interface Category {
    id: string;
    title: string;
}

export enum CompanyStatus {
    Active = 'active',
    NotActive = 'notActive',
    Pending = 'pending',
    Suspended = 'suspended',
}

export interface Company {
    id: string;
    title: string;
    description: string;
    status: CompanyStatus;
    joinedDate: string;
    hasPromotions: boolean;
    categoryId: string;
    categoryTitle: string;
    countryId: string;
    countryTitle: string;
    avatar?: string;
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    discount: number;
    companyId: string;
    companyTitle: string;
    avatar?: string;
}

const PROJECT_TOKEN = process.env.NEXT_PUBLIC_PROJECT_TOKEN;

const buildUrl = (...paths: string[]) =>
    `https://${PROJECT_TOKEN}.mockapi.io/api/v1/${paths.join('/')}`;

const stringifyQueryParams = (params: Record<string, string>) =>
    new URLSearchParams(params).toString();



async function sendRequest<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init);

    if (!res.ok) {
        const message = await res.text().catch(() => res.statusText); // 👈 безпечніше
        throw new Error(message || `Request failed with status ${res.status}`);
    }

    return res.json() as Promise<T>;
}

export const getSummaryStats = (init?: RequestInit) => {
    return sendRequest<SummaryStats>(buildUrl('summary-stats', '1'), init);
};

export const getSummarySales = (init?: RequestInit) => {
    return sendRequest<SummarySales[]>(buildUrl('summary-sales'), init);
};

export const getCountries = (init?: RequestInit) => {
    return sendRequest<Country[]>(buildUrl('countries'), init);
};

export const getCategories = (init?: RequestInit) => {
    return sendRequest<Category[]>(buildUrl('categories'), init);
};

export const getCompanies = (init?: RequestInit) => {
    return sendRequest<Company[]>(buildUrl('companies'), init);
};

export const getCompany = (id: string, init?: RequestInit) => {
    return sendRequest<Company>(buildUrl('companies', id), init);
};

export const getPromotions = async (
    params: Record<string, string> = {},
    init?: RequestInit,
) => {
    return sendRequest<Promotion[]>(
        `${buildUrl('promotions')}?${stringifyQueryParams(params)}`,
        init,
    );
};

export const createCompany = async (
    data: Omit<Company, 'id' | 'hasPromotions'>
): Promise<Company> => {
    return sendRequest<Company>(buildUrl('companies'), {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
        },
    });
};

export const createPromotion = async (
    data: Omit<Promotion, 'id'>,
): Promise<Promotion> => {
    return sendRequest<Promotion>(buildUrl('promotions'), {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
        },
    });
};


export const deletePromotion = async (id: string): Promise<void> => {
    await sendRequest<void>(buildUrl('promotions', id), {
        method: 'DELETE',
    });
};
