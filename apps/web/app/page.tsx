import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { SectionHeader } from '@/components/SectionHeader';
import { FeaturedReviewCard } from '@/components/FeaturedReviewCard';
import { ReviewCard } from '@/components/ReviewCard';
import { ForumThreadRow } from '@/components/ForumThreadRow';
import { reviews, threads, getCarById } from '@/lib/data';

export default function HomePage() {
  const featuredReview = reviews[0];
  const featuredCar = getCarById(featuredReview.carId)!;
  const latestReviews = reviews.slice(1, 5);

  return (
    <>
      <Nav />
      <main className="flex-1" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col gap-14">

          <section>
            <SectionHeader title="Escolha do editor" />
            <FeaturedReviewCard review={featuredReview} car={featuredCar} />
          </section>

          <section>
            <SectionHeader title="Avaliações recentes" action="Ver todas" />
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {latestReviews.map(review => {
                const car = getCarById(review.carId)!;
                return <ReviewCard key={review.id} review={review} car={car} />;
              })}
            </div>
          </section>

          <section>
            <SectionHeader title="Destaques do fórum" action="Ir para o fórum" />
            <div className="flex flex-col">
              {threads.map(thread => (
                <ForumThreadRow key={thread.id} thread={thread} />
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
