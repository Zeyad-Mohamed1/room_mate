import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Advanced Property Filters',
    description: 'Filter properties by multiple criteria to find your perfect match',
};

export default function FiltersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-gray-50 py-6">
            {children}
        </main>
    );
} 