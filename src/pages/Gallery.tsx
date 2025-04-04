import {
  IonBackButton, IonButtons, IonContent, IonHeader, IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import GallerySection from "../components/Gallery/GallerySection";
import { useEffect } from "react";
import { stringToLiftCategory } from "../Constants/Constants";

const Gallery: React.FC = () => {
  const params = useParams<{ category: string }>();
  const category = stringToLiftCategory(params.category); 
  useEffect(() => {
    console.log("Gallery Loaded", params.category);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>{category} Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <GallerySection date="2025-03-27" category={category} />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Gallery;
