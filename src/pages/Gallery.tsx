import {
  IonBackButton, IonButtons, IonContent, IonHeader, IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import GallerySection from "../components/Gallery/GallerySection";
import { useEffect } from "react";
import { stringToLiftCategory, liftCategoryToLiftDirectoryPathType } from "../Constants/Constants";
import { getVideoFilenames, getYearMonthDayFromFileNames } from "../utils/FetchImage";

const Gallery: React.FC = () => {
  const params = useParams<{ category: string }>();
  const category = stringToLiftCategory(params.category); 

  useEffect(() => {
    console.log("Gallery Loaded", params.category);
    getVideoFilenames(liftCategoryToLiftDirectoryPathType(category))
    .then((videoNames) => {
      console.log(videoNames);
      const dates = getYearMonthDayFromFileNames(videoNames);
      dates.forEach((key, value) => console.log(`"${key}" => "${value}"`));

    });


    
     
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
        {/* <GallerySection date="2025-03-27" category={category} /> */}
      </IonContent>

      <Footer current="none"/>
    </IonPage>
  );
};

export default Gallery;
