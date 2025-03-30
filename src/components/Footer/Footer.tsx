import { IonCol, IonFooter, IonGrid, IonIcon, IonRow, IonToolbar } from '@ionic/react';
import { personOutline, cameraOutline, homeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import "./Footer.css";

const Footer: React.FC = () => {

	const history = useHistory();
	const onClickHome = (event: React.MouseEvent<HTMLIonIconElement>) => {
    event.preventDefault();
		history.push('/home')
	}


  function onClickCamera(event: React.MouseEvent<HTMLIonIconElement>): void {
    event.preventDefault();
    history.push('/camera');
  }

  return (
    <IonFooter>
      <IonToolbar>
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center ion-justify-content-evenly">
            <IonCol size="auto">
              <IonIcon icon={homeOutline} size="large" onClick={onClickHome}/>
            </IonCol>
            <IonCol size="auto">
              <IonIcon icon={cameraOutline} size="large" onClick={onClickCamera}/>
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
