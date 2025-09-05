import MainListComponent from "../todolistmain _component/list";
export default function Completed({parentNavigation, navigation}: { parentNavigation: any; navigation: any }){
    return (
        <MainListComponent parentNavigation={parentNavigation} done={true} navigation={navigation} />
    )
}