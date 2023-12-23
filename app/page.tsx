import dynamic from 'next/dynamic';

const CompoundInterestCalculator = dynamic(
  () => import('@/components/CompoundInterestCalculator'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 pt-12 ">
      <div className='  max-w-full'>
        <h1 className="text-4xl font-bold mt-4">Investment Calculator</h1>
        <CompoundInterestCalculator />
      </div>
    </main>
  )
}
