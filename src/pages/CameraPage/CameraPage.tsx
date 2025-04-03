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
import Footer from "../../components/Footer/Footer";
import { useEffect, useRef, useState } from "react";
import "./CameraPage.css";
import VideoCapture from "../../components/VideoCapture/VideoCapture";
import { fetchCameraDeviceIds } from "./util";

const CameraPage: React.FC = () => {
  const [tracking, setTracking] = useState(false);
  const [cameraDevices, setCameraDevices] = useState<string []>([]);
  const [cameraFacing, setCameraFacing]  = useState(1);
  const [cameraLoaded, setCameraLoaded] = useState(false);


  useEffect(() => {
    console.log('starting camera');

    const assignCameraDevices = async () => {
      fetchCameraDeviceIds().then((devices: string[]) => {
        if(devices.length == 0) {
          console.error('not devices found');
          return;
        }
        setCameraDevices(devices);
        setCameraLoaded(true);
      });
    }

    assignCameraDevices();
  }, []);

  useEffect(()=> {
    console.log('camera facing', cameraFacing);
  },[cameraFacing]);

  const swapCamera = () => {
    setCameraFacing(cameraFacing == 0 ? 1 : 0); 
  }

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
          <IonTitle>Camera!</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {cameraDevices.length > 0 && cameraLoaded? (
          <VideoCapture deviceId={cameraDevices[cameraFacing]} />
        ) : (
          <></>
        )}

        <IonButton
          color={!tracking ? "success" : "danger"}
          onClick={() => {
            toggleTracking();
          }}
        >
          {tracking ? "Stop Tracking" : "Start Tracking"}
        </IonButton>
        <IonButton
          onClick={() => {
            swapCamera();
          }}
        >
          flip camera
        </IonButton>
      </IonContent>
      <Footer current="camera" />
    </IonPage>
  );
};

export default CameraPage;
