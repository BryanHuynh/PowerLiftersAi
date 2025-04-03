import { Filesystem, Directory} from "@capacitor/filesystem"
import { liftDirectoryPaths} from "../Constants/Constants";



const check_directory_exists = async (_path: string, _directory: Directory) => {
    try{
        await Filesystem.stat({
            path: _path,
            directory: _directory
        });
        return true;
    } catch (e) {
        return false;
    }
}

const check_category_directories_exists = async () => {
    const squat_exists = await check_directory_exists(liftDirectoryPaths.Squat, Directory.Documents);
    const bench_exists = await check_directory_exists(liftDirectoryPaths.BenchPress, Directory.Documents);
    const deadlift_exists = await check_directory_exists(liftDirectoryPaths.Deadlift, Directory.Documents);
    const list = [squat_exists, bench_exists, deadlift_exists];
    return list.every((e) => e === true);
}

const create_directories = () => {
    Filesystem.mkdir({
        path: liftDirectoryPaths.Squat,
        directory: Directory.Documents,
        recursive: true
    });

    Filesystem.mkdir({
        path: liftDirectoryPaths.BenchPress,
        directory: Directory.Documents,
        recursive: true
    });
    
    Filesystem.mkdir({
        path: liftDirectoryPaths.Deadlift,
        directory: Directory.Documents,
        recursive: true
    })
}

export const check_and_create_directories = async () => {
    check_category_directories_exists().then((exist) => {
        if(exist){
            console.log("Directories already exist");
        }else{
            create_directories();
            console.log('Directories created')
        }
        return exist;
    });
}



