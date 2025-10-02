'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getCompany, deleteCompany } from '@/lib/api';
import StatusLabel from '@/app/components/status-label';

export interface CompanyInfoProps {
    companyId: string;
}

export default function CompanyInfo({ companyId }: CompanyInfoProps) {
    const queryClient = useQueryClient();
    const router = useRouter();

    // Отримуємо компанію
    const { data: company } = useQuery({
        queryKey: ['companies', companyId],
        queryFn: () => getCompany(companyId),
        staleTime: 10 * 1000,
    });

    // Мутація для видалення
    const deleteMutation = useMutation({
        mutationFn: () => deleteCompany(companyId),
        onSuccess: () => {
            // оновлюємо кеш
            queryClient.invalidateQueries({ queryKey: ['companies'] });

            // редіректимо на список компаній
            router.push('/companies');
        },
    });

    if (!company) return null;

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center p-7 gap-5 bg-gray-900 rounded">
                <div className="w-20 h-20 rounded-full bg-blue-500 relative overflow-hidden">
                    {company.avatar && (
                        <Image fill src={company.avatar} alt="company avatar" />
                    )}
                </div>
                <p className="pb text-base font-semibold text-white">{company.title}</p>
                <StatusLabel status={company.status} />

                {/* Кнопка видалення */}
                <button
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete company'}
                </button>
            </div>

            <div className="p-7 text-base text-gray-900 bg-gray-100 rounded">
                <p className="pb-5 text-xl font-semibold">About company</p>
                <p className="pb-3">{`Category: ${company.categoryTitle}`}</p>
                <p className="pb-3">{`Country: ${company.countryTitle}`}</p>
                <p className="pb-3">{`Joined date: ${new Date(
                    company.joinedDate,
                ).toLocaleDateString('uk')}`}</p>
                <div className="w-full h-px my-8 bg-gray-300" />
                <p>{company.description}</p>
            </div>
        </div>
    );
}


