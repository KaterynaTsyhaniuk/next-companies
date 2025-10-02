'use client';

import React from 'react';
import Image from 'next/image';
import type { Promotion } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePromotion } from '@/lib/api';

export interface PromotionProps {
    promotion: Promotion;
}

export default function Promotion({ promotion }: PromotionProps) {
    const queryClient = useQueryClient();

    const { mutate: removePromotion, isPending } = useMutation({
        mutationFn: (id: string) => deletePromotion(id),
        onMutate: async (id: string) => {
            // Скасовуємо активні запити
            await queryClient.cancelQueries({ queryKey: ['promotions', promotion.companyId] });

            // Зберігаємо попередні дані
            const previousData = queryClient.getQueryData<Promotion[]>(['promotions', promotion.companyId]);

            // Оновлюємо кеш одразу (видаляємо потрібну акцію)
            queryClient.setQueryData<Promotion[]>(['promotions', promotion.companyId], (old) =>
                old ? old.filter((p) => p.id !== id) : []
            );

            return { previousData };
        },
        onError: (_err, _id, context) => {
            // Якщо помилка — відновлюємо кеш
            if (context?.previousData) {
                queryClient.setQueryData(['promotions', promotion.companyId], context.previousData);
            }
        },
        onSettled: () => {
            // Після завершення все одно оновлюємо з сервера
            queryClient.invalidateQueries({ queryKey: ['promotions', promotion.companyId] });
        },
    });

    const handleDelete = () => {
        removePromotion(promotion.id); // ✅ вже string
    };

    return (
        <div className="rounded overflow-hidden bg-gray-100">
            <div className="relative w-full h-40 bg-gray-300">
                {promotion.avatar && (
                    <Image fill src={promotion.avatar} alt="promotion avatar" />
                )}
                <div className="w-14 h-14 absolute top-0 left-px rounded-br-full bg-lime-200" />
                <div className="w-14 h-14 absolute inset-0 py-3 pr-3 pl-0.5 rounded-br-full bg-gray-900">
                    <p className="text-center text-xs font-bold text-lime-200">
                        -{promotion.discount}%
                    </p>
                </div>
            </div>
            <div className="flex flex-col p-5 gap-3">
                <p className="text-base font-semibold text-gray-900">
                    {promotion.title}
                </p>
                <p className="text-sm text-gray-900">{promotion.description}</p>

                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                >
                    {isPending ? 'Delete...' : 'Delete'}
                </button>
            </div>
        </div>
    );
}





