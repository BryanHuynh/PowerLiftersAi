import {
  IonContent, IonHeader, IonPage, IonTitle,
  IonToolbar
} from "@ionic/react";
import HomeLiftCard from "../components/Home/HomeLiftCard";
import Footer from "../components/Footer/Footer";
import { Lift } from "../Constants/Constants";
import { useEffect } from "react";
import { check_and_create_directories } from "../utils/Startup";

const Home: React.FC = () => {
  useEffect(() => {
    check_and_create_directories(); 
  },[]) 
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <HomeLiftCard lift={Lift.SQUAT}></HomeLiftCard>
        <HomeLiftCard lift={Lift.BENCH_PRESS}></HomeLiftCard>
        <HomeLiftCard lift={Lift.DEADLIFT}></HomeLiftCard>
      </IonContent>

      <Footer current="home"/>
    </IonPage>
  );
};

export default Home;
