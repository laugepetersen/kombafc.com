import FighterCard from "@/components/molecules/FighterCard";
import { db } from "@/db";

/**
 * All fighters block
 */
export default async function AllFighters() {
  return (
    <section className={"layout-block"}>
      <div
        className={
          "container grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-items-center gap-4 md:gap-8"
        }
      >
        {db.fighters.map((fighter, index) => (
          <FighterCard
            key={index}
            title={fighter.title}
            firstName={fighter.firstName}
            lastName={fighter.lastName}
            weight={fighter.weight}
            imageSrc={fighter.imageSrc}
          />
        ))}
      </div>
    </section>
  );
}
