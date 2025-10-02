import PromotionFormModalWrapper from "@/app/components/promotion-form-modal-wrapper";
import React from 'react';
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return <PromotionFormModalWrapper companyId={id} />;
}