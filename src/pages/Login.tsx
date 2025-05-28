import { IonButton, IonCard, IonCardContent, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { APP_NAME } from '../Constants/Constants'
import { logInOutline} from "ionicons/icons"

const Login: React.FC = () => {
    const doLogin = (event : any) => {
        event.preventDefault();
        console.log("login");
    }

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
            <IonCard>
                <IonCardContent>
                    <form onSubmit={doLogin}>
                        <IonInput fill='outline' labelPlacement="floating" label="email" type="email" placeholder='helloworld@gmail.com'/>
                        <IonInput className='ion-margin-top' fill='outline' labelPlacement="floating" label="password" type="password"/>
                        <IonButton className='ion-margin-top' type='submit' expand='block'>
                            Login
                            <IonIcon icon={logInOutline} slot="end"></IonIcon>
                        </IonButton>
                        <IonButton className='ion-margin-top' routerLink="/register" type='submit' expand='block' color="secondary">Create Account</IonButton>
                    </form>
                </IonCardContent>
            </IonCard>
      </IonContent>

      <IonFooter>
        <IonToolbar>
            ToolBar
        </IonToolbar>
      </IonFooter>

    </IonPage>
  );
};

export default Login;
