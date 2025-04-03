import {
  IonButton,
  IonCol,
  IonFooter,
  IonGrid,
  IonIcon,
  IonRow,
  IonToolbar,
} from "@ionic/react";
import {
  personOutline,
  cameraOutline,
  camera,
  homeOutline,
  home,
} from "ionicons/icons";
import { useHistory } from "react-router";
import "./Footer.css";

interface FooterProps {
  current: "camera" | "home" | "profile" | "none";
}

const Footer: React.FC<FooterProps> = ({ current }) => {
  const history = useHistory();
  const onClickHome = (event: React.MouseEvent<HTMLIonIconElement>) => {
    event.preventDefault();
    history.replace("/home");
  };

  function onClickCamera(event: React.MouseEvent<HTMLIonIconElement>): void {
    event.preventDefault();
    history.replace("/camera");
  }
  

  
  return (
    <IonFooter>
      <IonToolbar>
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center ion-justify-content-evenly">
            <IonCol size="auto">
              <IonIcon
                icon={current === "home" ? home : homeOutline}
                size="large"
                onClick={onClickHome}
              />
            </IonCol>
            <IonCol size="auto">
              <IonIcon
                icon={current == "camera" ? camera : cameraOutline}
                size="large"
                onClick={onClickCamera}
              />
            </IonCol>
            <IonCol size="auto">
              <IonIcon icon={personOutline} size="large" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonFooter>
  );
};

export default Footer;
