import { IonButton, IonCard, IonCardContent, IonContent, IonFooter, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { APP_NAME } from '../Constants/Constants'

const Register: React.FC = () => {
    const doLogin = (event : any) => {
        event.preventDefault();
        console.log("login");
    }

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
            
            <IonCard>
                <IonCardContent>
                    <form onSubmit={doLogin}>
                        <IonInput fill='outline' labelPlacement="floating" label="email" type="email" placeholder='helloworld@gmail.com'/>
                        <IonInput className='ion-margin-top' fill='outline' labelPlacement="floating" label="password" type="password"/>
                        <IonButton className='ion-margin-top' type='submit' expand='block'>Create Account</IonButton>
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

export default Register;
