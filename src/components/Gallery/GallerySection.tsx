import { IonCard, IonCardContent, IonImg, IonItem } from "@ionic/react";
import { fetch_img } from "../../utils/FetchImage";
import "./GallerySection.css";
import { Lift } from "../../Constants/Constants";

interface GallerySectionProps {
  date: string;
  category: Lift;
}

const GallerySection: React.FC<GallerySectionProps> = ({ date, category }) => {
  const renderImageDate = (date: string, category: Lift) => {
    const images = fetch_img(date, category);
    const mappedImagesToRender = images.map((image, index) => {
      return (
          <IonImg className="gallery-img" src={image} key={index} />
      );
    });
    return <>{mappedImagesToRender}</>;
  };

  return (
    <IonCard className='card'> 
      <IonCardContent>
        <h2>{date}</h2>
        <div className="gallery-grid">
          {renderImageDate(date, category)}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default GallerySection;
