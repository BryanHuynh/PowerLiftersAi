
import Squat from '../assets/Squat.png';
import Bench from '../assets/Bench.png';
import DeadLift from '../assets/Deadlift.png';
import { Lift } from '../Constants/Constants';
import { File, Filesystem } from '@capacitor/filesystem';

export const fetch_img = (date: string, cateogry: Lift):string[] => {

    let _retImage;
    switch(cateogry) {
        case Lift.SQUAT:
          _retImage = Squat;
          break;
        case Lift.BENCH_PRESS:
          _retImage = Bench;
          break;
        default:
          _retImage = DeadLift;
      }

    const _list: string[] = [];
    for( let i = 0; i < 5; i++){
        _list.push(_retImage)
    }
    return _list;
}





