
import Squat from '../assets/Squat.png';
import Bench from '../assets/Bench.png';
import DeadLift from '../assets/Deadlift.png';
import { Lift, liftDirectoryPaths, LiftDirectoryPathType } from '../Constants/Constants';
import { Directory, File, Filesystem } from '@capacitor/filesystem';


export const fetch_img = (date: string, category: Lift):string[] => {
    let _retImage;
    switch(category) {
        case Lift.SQUAT:
          _retImage = Squat;
          break;
        case Lift.BENCH_PRESS:
          _retImage = Bench;
          break;
        default:
          fetch_videos("Deadlift");
          _retImage = DeadLift;
      }

    const _list: string[] = [];
    for( let i = 0; i < 5; i++){
        _list.push(_retImage)
    }
    return _list;
}

const fetch_videos = async (lift: LiftDirectoryPathType) => {
  console.log('path', liftDirectoryPaths[lift]);
  await Filesystem.readdir({
      path: liftDirectoryPaths.Deadlift,
      directory: Directory.Documents
  }).then((e)=>{
      console.log('files: ', e.files.map(e=>{return e.name}));
  }).catch((e)=>{
      console.log("error", e);
  })
}




