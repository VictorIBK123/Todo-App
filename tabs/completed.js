import MainListComponent from "../todolistmain _component/list";
export default function Completed({parentNavigation, navigation}){
    return (
        <MainListComponent parentNavigation={parentNavigation} done={true} navigation={navigation} />
    )
}