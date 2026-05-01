import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { reviews, cars, getCarById } from '@/lib/data';
import { ReviewsFilter } from './ReviewsFilter';

export default function ReviewsPage() {
  const items = reviews.map(review => ({
    review,
    car: getCarById(review.carId)!,
  }));

  const segments = [...new Set(cars.map(c => c.segment))].sort();

  return (
    <>
      <Nav />
      <main className="flex-1" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1100px] mx-auto px-6 py-10">

          <div className="mb-8">
            <h1 className="font-display font-extrabold text-3xl mb-1" style={{ color: 'var(--text)' }}>
              Reviews
            </h1>
            <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
              {reviews.length} expert reviews
            </p>
          </div>

          <ReviewsFilter items={items} segments={segments} />

        </div>
      </main>
      <Footer />
    </>
  );
}
