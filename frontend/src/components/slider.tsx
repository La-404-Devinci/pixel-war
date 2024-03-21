import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import styles from "../styles/slider.module.css";
import { useEffect, useState } from "react";

import illustrationTrophy from "../assets/trophy_pixel_war.png";
import illustrationDisney from "../assets/billets-disney.png";
import illustrationAmazon from "../assets/carte-amazon.png";
import illustrationUgc from "../assets/carte-ugc.png";
import iconAngleLeft from "../assets/angle-left.svg";
import iconAngleRight from "../assets/angle-right.svg";

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
        <CarouselProvider naturalSlideWidth={slideWidth} naturalSlideHeight={300} totalSlides={4} infinite={true}>
            <Slider>
                <Slide index={0} className={styles.slider}>
                    <p>1ère place - Classement associatif</p>
                    <img src={illustrationTrophy} alt="Trophy Pixel War" />
                    <p>Trophée Pixel War</p>
                </Slide>
                <Slide index={1} className={styles.slider}>
                    <p>1ère place - Classement général</p>
                    <img src={illustrationDisney} alt="Billets Disney" />
                    <p>2 places pour Disneyland Paris</p>
                </Slide>
                <Slide index={2} className={styles.slider}>
                    <p>2ème place - Classement général</p>
                    <img src={illustrationAmazon} alt="Carte Amazon" />
                    <p>1 carte Amazon de 30€</p>
                </Slide>
                <Slide index={3} className={styles.slider}>
                    <p>3ème place - Classement général</p>
                    <img src={illustrationUgc} alt="Cartes UGC" />
                    <p>2 billets solo UGC</p>
                </Slide>
            </Slider>
            <ButtonBack className={styles.carouselBtnLeft}>
                <img src={iconAngleLeft} alt="angle left" />
            </ButtonBack>
            <ButtonNext className={styles.carouselBtnRight}>
                <img src={iconAngleRight} alt="angle right" />
            </ButtonNext>
        </CarouselProvider>
    );
};

export default SimpleSlider;
