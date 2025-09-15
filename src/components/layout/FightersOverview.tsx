"use client";

import FighterCard from "@/components/molecules/FighterCard";
import { content, db } from "@/db";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

/**
 * FightersOverview
 */
export default function FightersOverview() {
  const middleIndex = Math.floor(db.fighters.length / 2);

  return (
    <section className={"layout-block"}>
      <div className={"container flex flex-col gap-8 items-center"}>
        <div className={"text-center max-w-3xl mx-auto"}>
          <h2
            className={"[&>span]:text-accent-purple mb-3 max-md:text-balance"}
            dangerouslySetInnerHTML={{
              __html: content.homePage.fightersOverview.title,
            }}
          ></h2>
          <p className={"md:text-lg max-w-xl mx-auto text-neutral-800"}>
            {content.homePage.fightersOverview.description}
          </p>
        </div>

        <Swiper
          spaceBetween={24}
          centeredSlides={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          loop={true}
          allowTouchMove={false}
          speed={6000}
          modules={[Autoplay]}
          breakpoints={{
            320: {
              slidesPerView: 1.5,
              spaceBetween: 16,
            },
            680: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1440: {
              slidesPerView: 4,
            },
          }}
          direction={"horizontal"}
          className={
            "max-w-full overflow-visible! [&>.swiper-wrapper]:[transition-timing-function:linear]!"
          }
        >
          {db.fighters.map((fighter, index) => (
            <SwiperSlide key={index}>
              <FighterCard
                className={"mx-auto"}
                title={fighter.title}
                firstName={fighter.firstName}
                lastName={fighter.lastName}
                weight={fighter.weight}
                imageSrc={fighter.imageSrc}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <div className={"flex gap-3 font-heading font-bold"}>
          <Button
            type="outline-black"
            href={content.homePage.fightersOverview.actions.primary.href}
          >
            {content.homePage.fightersOverview.actions.primary.label}
          </Button>
          <Button
            type="black"
            href={content.homePage.fightersOverview.actions.secondary.href}
          >
            {content.homePage.fightersOverview.actions.secondary.label}
          </Button>
        </div> */}
      </div>
    </section>
  );
}
