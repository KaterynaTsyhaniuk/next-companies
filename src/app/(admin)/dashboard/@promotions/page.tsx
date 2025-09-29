import React from 'react';
import { getPromotions } from '@/lib/api';
import SummaryTable from '@/app/components/summary-table';
import SummaryTableHeader from '@/app/components/summary-table-header';
import SummaryTableCell from '@/app/components/summary-table-cell';
import DashboardCard from '@/app/components/dashboard-card';

interface Promotion {
    id: string;
    title: string;
    companyTitle: string;
    discount: number;
}

export default async function Page() {
    const data = await getPromotions();

    return (
        <DashboardCard label="Promotions">
            <SummaryTable
                headers={
                    <>
                        <SummaryTableHeader>Company</SummaryTableHeader>
                        <SummaryTableHeader>Name</SummaryTableHeader>
                        <SummaryTableHeader align="center">%</SummaryTableHeader>
                    </>
                }
            >
                {data.map(({ id, title, companyTitle, discount }: Promotion) => (
                    <tr key={id}>
                        <SummaryTableCell>{companyTitle}</SummaryTableCell>
                        <SummaryTableCell>{title}</SummaryTableCell>
                        <SummaryTableCell align="center">{`-${discount}%`}</SummaryTableCell>
                    </tr>
                ))}
            </SummaryTable>
        </DashboardCard>
    );
}