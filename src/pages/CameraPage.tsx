import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import { useEffect, useRef, useState } from "react";
import "./CameraPage.css";
import VideoCapture from "../components/VideoCapture/VideoCapture";

const CameraPage: React.FC = () => {
  const [tracking, setTracking] = useState(false);


  const toggleTracking = () => {
    setTracking(!tracking);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>Camera</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <VideoCapture/>
        <IonButton
          color={!tracking ? "success" : "danger"}
          onClick={() => {
            toggleTracking();
          }}
        >
          {tracking ? "Stop Tracking" : "Start Tracking"}
        </IonButton>
      </IonContent>
      <Footer current='camera' />
    </IonPage>
  );
};

export default CameraPage;
