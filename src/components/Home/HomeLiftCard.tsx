import { IonCard, IonCardContent, IonImg, IonTitle } from "@ionic/react";
import Squat from "../../assets/Squat.png";
import Bench from "../../assets/Bench.png";
import Deadlift from "../../assets/Deadlift.png";
import "./HomeLiftCard.css";
import { Lift } from "../../Constants/Constants";

interface ContainerProps {
  lift: Lift;
}

const HomeLiftCard: React.FC<ContainerProps> = ({ lift }) => {
  const liftImage = (lift: Lift) => {
    switch (lift) {
      case Lift.BENCH_PRESS:
      return Bench;
      case Lift.SQUAT:
      return Squat;
      case Lift.DEADLIFT:
      return Deadlift;
      default:
        return Deadlift;
    }
  };

  return (
    <IonCard routerLink={`/gallery/${lift}`}>
      <IonCardContent>
        <IonImg src={liftImage(lift)} alt-text={lift}></IonImg>
        <IonTitle className='title'> {lift} </IonTitle>
      </IonCardContent>
    </IonCard>
  );
};

export default HomeLiftCard;
