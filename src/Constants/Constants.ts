export const APP_NAME: string = "PowerLifters AI";

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
