import MainListComponent from "../todolistmain _component/list";
export default function NotCompleted({parentNavigation, navigation}){
    return (
        <MainListComponent parentNavigation={parentNavigation} done={false} navigation={navigation} />
    )
}