import {
    CarouselProvider,
    Slider,
    Slide,
    ButtonBack,
    ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import styles from "../styles/carousel.module.css";
import { useEffect, useState } from "react";

const SimpleSlider = () => {
    const [slideWidth, setSlideWidth] = useState(1);

    const handleResize = () => {
        const width = window.innerWidth;
        if (width > 500) {
            setSlideWidth(500);
        } else {
            setSlideWidth(width * 0.9);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <CarouselProvider
            naturalSlideWidth={slideWidth}
            naturalSlideHeight={300}
            totalSlides={4}
            infinite={true}
        >
            <Slider>
                <Slide
                    index={0}
                    className={styles.slider}
                >
                    <p>1ère place - Classement associatif</p>
                    <img
                        src='/src/assets/trophy_pixel_war.png'
                        alt='Trophy Pixel War'
                    />
                    <p>Trophée Pixel War</p>
                </Slide>
                <Slide
                    index={1}
                    className={styles.slider}
                >
                    <p>1ère place - Classement général</p>
                    <img
                        src='/src/assets/billets-disney.png'
                        alt='Billets Disney'
                    />
                    <p>2 billets Disney</p>
                </Slide>
                <Slide
                    index={2}
                    className={styles.slider}
                >
                    <p>2ème place - Classement général</p>
                    <img
                        src='/src/assets/carte-amazon.png'
                        alt='Carte Amazon'
                    />
                    <p>1 carte Amazon de 30€</p>
                </Slide>
                <Slide
                    index={3}
                    className={styles.slider}
                >
                    <p>3ème place - Classement général</p>
                    <img
                        src='/src/assets/carte-ugc.png'
                        alt='Cartes UGC'
                    />
                    <p>2 billets solo UGC</p>
                </Slide>
            </Slider>
            <ButtonBack className={styles.carouselBtnLeft}>
                <img
                    src='/src/assets/angle-left.svg'
                    alt='angle left'
                />
            </ButtonBack>
            <ButtonNext className={styles.carouselBtnRight}>
                <img
                    src='/src/assets/angle-right.svg'
                    alt='angle right'
                />
            </ButtonNext>
        </CarouselProvider>
    );
};

export default SimpleSlider;
