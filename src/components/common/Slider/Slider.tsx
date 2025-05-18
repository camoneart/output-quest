"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";
import * as Posts from "@/features/posts/components/index";
import styles from "./Slider.module.css";

// Swiperのスタイルをインポート
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Slider = () => {
  return (
    <div className={styles["slider-container"]}>
      <Swiper
        modules={[Navigation, Pagination, Mousewheel]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          prevEl: `.${styles["swiper-button-prev"]}`,
          nextEl: `.${styles["swiper-button-next"]}`,
        }}
        pagination={{
          clickable: true,
          el: `.${styles["swiper-pagination"]}`,
        }}
        mousewheel={false}
        speed={400}
        className={styles["swiper"]}
      >
        <SwiperSlide>
          <div className={styles["slider-content"]}>
            <Posts.ZennPosts />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Slider;
