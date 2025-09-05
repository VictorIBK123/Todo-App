import React, { memo } from "react"
import { View, Text, Image,  FlatList  } from "react-native"
import ListItem from "./listItem"
const FlatListComp:React.FC<any> =({height, width, animatedTodoStyle, selectMultiple, data, longPressed, navigation,keysMarked,key: theKey , optionsHandler, AnimatedTouchableOpacity})=>(
    <FlatList
        keyExtractor={(item)=>item.key.toString()}
            ListEmptyComponent={()=>{
                const image = require("../assets/todo1.png")
                return(<View style={{backgroundColor:'white', justifyContent:'center',height, width, alignItems:'center'}}>
                    <Image source={image} style={{resizeMode:'contain', height:'50%', width:'70%'}}/>
                    <Text>Nothing here yet</Text>
                    </View>)
            }}
            // I did this so as to give space for the component shown when a todo is long pressed
            ListFooterComponent={()=>{return(
                <View style={{marginBottom:55}}>

                </View>
            )}}
            data={data}
            ItemSeparatorComponent={()=>(
                <View style={{borderWidth: 0.5, borderColor:'#498a7f88'}}></View>
            )}
            renderItem={({item})=>{
                return (
                <ListItem animatedTodoStyle={animatedTodoStyle} item={item} selectMultiple={selectMultiple} longPressed={longPressed} navigation={navigation} mark={keysMarked.includes(item.key)} del={theKey==item.key} optionsHandler={optionsHandler} AnimatedTouchableOpacity={AnimatedTouchableOpacity}/>
            )
            }}
        />
)
export default FlatListComp