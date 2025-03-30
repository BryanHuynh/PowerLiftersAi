export const APP_NAME: string = "PowerLifters AI";

export type LiftDirectoryPathType = 'Squat' | 'BenchPress' | 'Deadlift';

export const VIDEO_DIRECTORY_PATH: string = "/powerLiftersAI/data/videos";

export const liftDirectoryPaths: { [key in LiftDirectoryPathType]: string } = {
  Squat: `${VIDEO_DIRECTORY_PATH}/Squat/`,
  BenchPress: `${VIDEO_DIRECTORY_PATH}/BenchPress/`,
  Deadlift: `/powerLiftersAI/data/videos/Deadlift`
};

export const stringToLiftCategory = (string: string): Lift => {
    switch(string) {
        case "Squat":
            return Lift.SQUAT;
        case "Bench Press":
            return Lift.BENCH_PRESS;
        case "Deadlift":
            return Lift.DEADLIFT
        default:
            throw new Error(`Invalid lift category: ${string}`);
    }
};


export enum Lift {
    SQUAT = 'Squat',
    BENCH_PRESS = 'Bench Press',
    DEADLIFT = 'Deadlift'
}
