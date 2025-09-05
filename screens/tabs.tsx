import Completed from "../tabs/completed";
import NotCompleted from "../tabs/notcompleted";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationProp } from "@react-navigation/native";

export default function Tabs({navigation}: {navigation: NavigationProp<any>}) {
    const tab = createMaterialTopTabNavigator()
    return (
        <tab.Navigator screenOptions={{tabBarLabelStyle:{fontWeight:'bold', fontSize:15}, tabBarActiveTintColor:'white', tabBarInactiveTintColor:'black', tabBarIndicatorStyle:{backgroundColor:'green',width:'40%', left:'5%',right:'5%', height:'80%',top:'10%', bottom:'10%',alignSelf:'center', borderRadius:10}}}>
            <tab.Screen name="notcompleted" options={{title: 'Pending'}}>
                {(props)=><NotCompleted {...props} parentNavigation={navigation}/>}
            </tab.Screen>
            <tab.Screen name="completed" options={{title: 'Completed'}} >
                {(props)=><Completed {...props} parentNavigation={navigation}/>}
            </tab.Screen>
        </tab.Navigator>
    )
}