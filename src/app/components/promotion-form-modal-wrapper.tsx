'use client';

import { useRouter } from 'next/navigation';
import PromotionFormModal from '@/app/components/promotion-form-modal';

export default function PromotionFormModalWrapper({ companyId }: { companyId: string }) {
    const router = useRouter();

    return (
        <PromotionFormModal
            companyId={companyId}
            show={true}
            onClose={() => router.back()}
        />
    );
}
