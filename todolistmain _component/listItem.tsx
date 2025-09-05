import React, { memo, useCallback } from "react"
import Animated from "react-native-reanimated"
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { Text, View,Pressable, TouchableOpacity } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const ListItem:React.FC<any>  =memo(({animatedTodoStyle, item,del, selectMultiple,longPressed, navigation, mark, optionsHandler})=>{
    const navigate = useCallback(()=>{
        navigation.navigate("editviewaddtodo", {key:item.key, purpose:'view', title:item.todo, details:item.details, priority:item.priority, completed:item.completed, date: item.date})}
        ,[])
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable)
    return (
        <AnimatedTouchableOpacity  disabled={selectMultiple}  onLongPress={()=>{longPressed(item.key, 'markFirst')}} onPress={navigate} 
        style={del?[{ paddingHorizontal:8, paddingVertical:20, flexDirection:'row',alignItems:'center', justifyContent:'space-between'}, animatedTodoStyle]:
        [{paddingHorizontal:8, paddingVertical:20, flexDirection:'row',alignItems:'ce nter', justifyContent:'space-between'}]}>
            <View style={{flex:9/10}} >
                <Text style={{fontSize:16, fontWeight:'bold'}}>{item.todo}</Text>
                <Text style={{fontSize:15}} numberOfLines={1} ellipsizeMode="tail" >{item.details}</Text>
            </View>
            {!selectMultiple && <TouchableOpacity onPress={()=>{optionsHandler(item.key, item.purpose, item.todo, item.details, item.priority, item.completed, item.date)}} style={{flex:1/10}}>
                <SimpleLineIcons name="options-vertical" size={24} color="green" />
            </TouchableOpacity>}
            {selectMultiple && mark && <TouchableOpacity onPress={()=>{longPressed(item.key, 'unmark')}} style={{flex:1/10}}>
            <MaterialIcons name="check-box" size={24} color="green" />
        </TouchableOpacity>}
        {selectMultiple && !mark && <TouchableOpacity onPress={()=>{longPressed(item.key, 'mark')}} style={{flex:1/10}}>
            <MaterialIcons name="check-box-outline-blank" size={24} color="green" />
        </TouchableOpacity>}
            <View style={{position:'absolute', paddingHorizontal:8, bottom:0, flexDirection:'row',alignItems:'center'}}>
                <View>
                    <Octicons name="dot-fill" size={14} color="green" />
                </View>
                <View style={{marginLeft:5}}> 
                    <Text style={{fontSize:12, }}>Priority: {item.priority}</Text>
                </View>
                <View style={{marginLeft:20}}>
                    <Octicons name="dot-fill" size={14} color="green" />
                </View>
                <View style={{marginLeft:5}}>
                    <Text style={{fontSize:12}}>Due date: {new Date(item.date).getDate().toString().length>1?new Date(item.date).getDate().toString():'0'+new Date(item.date).getDate().toString()}-{new Date(item.date).getMonth().toString().length>1?new Date(item.date).getMonth().toString():'0'+new Date(item.date).getMonth().toString()}-{new Date(item.date).getFullYear().toString().length>1?new Date(item.date).getFullYear().toString():'0'+new Date(item.date).getFullYear().toString()} at {(()=>{
                if (new Date(item.date).getHours()==12){
                    return (new Date(item.date).getHours())
                }
                else{
                    return ((new Date(item.date).getHours()%12).toString().length>1?(new Date(item.date).getHours()%12).toString():'0'+(new Date(item.date).getHours()%12).toString())
                }
            })()}:{new Date(item.date).getMinutes().toString().length>1?new Date(item.date).getMinutes().toString():'0'+new Date(item.date).getMinutes().toString()} {new Date(item.date).getHours()>=12?'PM':'AM'}</Text>
                </View>
            </View>
        </AnimatedTouchableOpacity>
    )
})
export default ListItem