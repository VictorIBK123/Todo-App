import { memo } from "react";
import MainListComponent from "../todolistmain _component/list";
const NotCompleted=({parentNavigation, navigation}: { parentNavigation: any; navigation: any })=>{
    return (
        <MainListComponent parentNavigation={parentNavigation} done={false} navigation={navigation} />
    )
}
export default NotCompleted