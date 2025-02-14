import { Easing, FlatList, Image, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import React ,{ useCallback, useContext, useEffect, useState } from "react";
import { context } from "../context/context.js"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {runOnJS, useAnimatedProps, useSharedValue, withTiming} from "react-native-reanimated";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFocusEffect} from "@react-navigation/native";
export default function MainListComponent({parentNavigation, navigation, done}){
    const {todos, setTodos} = useContext(context)
    // storing items marked
    const [keysMarked, setKeysMarked] = useState([])
    const [selectMultiple, setSelectMultiple] =useState(false)
    const [key,setKey] = useState(null)
    const [purpose, setPurpose] = useState(null)
    const [title, setTitle] = useState(null)
    const [details, setDetails] = useState(null)
    const [priority, setPriority] = useState(null)
    const [completed, setCompleted] = useState(null)
    const [date, setDate] = useState(null)
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable)
    const {height, width} = useWindowDimensions()
    const leftDistance = useSharedValue(0)
    const top = useSharedValue(height)
    const translateX = useSharedValue(0)//used to translate the component to right when swipe is detected
    
    // if todo is changed , the left position of each component will be readjested to the default (0), 
    // this is done because when the delete button is pressed in the options, the animation will that will shift the component to be deleted will
    // be shifted to the right, but we have to set it backto 0 when the component is deleted
    const clickOut=()=>{
        top.value = withTiming(height, {duration:500})
    }
    const optionsHandler=(key,purpose, title, details,priority, completed, date )=>{
        setKey(key); setPurpose('view'); setTitle(title); setDetails(details); setPriority(priority); setCompleted(completed); setDate(date)
        top.value = withTiming(0, {duration:500})
    }
    const optionClicked =(type)=>{
        if (type=='details'){
            navigation.navigate("editviewaddtodo", {key, purpose, title, details, priority, completed, date})
        }
        else if(type=='mark'){
            setTodos(todos.map((element)=>{
                if (key==element.key){
                    return ({...element, completed:true})
                }
                else{
                    return (element)
                }
            }))
        }
        else if(type=='mark as pend'){
            setTodos(todos.map((element)=>{
                if (key==element.key){
                    return ({...element, completed:false})
                }
                else{
                    return (element)
                }
            }))
        }
        else if (type=='delete'){
            leftDistance.value= withTiming(width, {duration:500}, (finished)=>{
                if (finished){
                    runOnJS(setTodos)(todos.filter((element)=>element.key!=key))
                }
            })
        }
        top.value = withTiming(height, {duration:500})
    }
    // declared data to be used in the flatlist
    var data
 if (done){
    data = todos.filter((element)=>{
        return (element.completed)
      })
 }
 else {
    data = todos.filter((element)=>{
        return (!element.completed)
      })
 }

//  done this so that when the screen is focused, the selectMultiple will be set to false and the keysMarked will be set to an empty array
 useFocusEffect(
    useCallback(()=>{
        setKeysMarked([])
        setSelectMultiple(false)
        parentNavigation.setOptions({
            headerLeft:()=>null
        })
    },[])
 )
  
  const longPressed=(key, type)=>{
    if (type=='markFirst'){
        setKeysMarked([key, ...keysMarked])
        setSelectMultiple(true)
        parentNavigation.setOptions({
            headerLeft: ()=>(
                <TouchableOpacity onPress={()=>{setSelectMultiple(false); setKeysMarked([]); parentNavigation.setOptions({
                    headerLeft:()=>null
                })}} style={{paddingHorizontal:8, paddingVertical:5,backgroundColor:'green', marginLeft:8, borderRadius:5}}>
                    <Text style={{color:'white'}}>Cancel</Text>
                </TouchableOpacity>
            )
        })
    }
    else if (type=='mark'){
        setKeysMarked([key, ...keysMarked])
    }
    else if (type=='unmark'){
        setKeysMarked(keysMarked.filter((element)=>(element!=key)))
    }
    
  }
  const selectMultipleFunc=(type)=>{
    if (type=='markall'){
        setKeysMarked(data.map((element)=>element.key))
    }
    else if(type=='unmarkall'){
        setKeysMarked([])
    }
    else if (type=='mark'){
        setTodos(todos.map((element)=>{
            if (keysMarked.includes(element.key)){
                return ({...element, completed:true})
            }
            else{
                return (element)
            }
        }))
        parentNavigation.setOptions({
            headerLeft:()=>null
        })
        setSelectMultiple(false)
        setKeysMarked([])
    }
    else if(type=='mark as pend'){
        setTodos(todos.map((element)=>{
            if (keysMarked.includes(element.key)){
                return ({...element, completed:false})
            }
            else{
                return (element)
            }
        }))
        parentNavigation.setOptions({
            headerLeft:()=>null
        })
        setSelectMultiple(false)
        setKeysMarked([])
    }
    else if (type=='delete'){
        setTodos(todos.filter((element)=>!keysMarked.includes(element.key)))
        parentNavigation.setOptions({
            headerLeft:()=>null
        })
        setSelectMultiple(false)
        setKeysMarked([])
    }
  }

  const animatedStyle = useAnimatedProps(()=>({top:top.value})) //animated style for the options
  const animatedTodoStyle = useAnimatedProps(()=>({transform:[{translateX:leftDistance.value}]}))
  const animatedSwipeStyle = useAnimatedProps(()=>({transform:[{translateX:translateX.value}]}))
  useEffect(()=>{
    leftDistance.value=0
},[todos])
    return (
        <ImageBackground imageStyle={{opacity:0.2, resizeMode:'contain'}} source={require('../assets/todo1.png')} style={{height:'100%'}}>
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
                      <AnimatedTouchableOpacity disabled={selectMultiple} onLongPress={()=>{longPressed(item.key, 'markFirst')}} onPress={()=>{navigation.navigate("editviewaddtodo", {key:item.key, purpose:'view', title:item.todo, details:item.details, priority:item.priority, completed:item.completed, date: item.date})}} 
                      style={item.key==key?[{ paddingHorizontal:8, paddingVertical:20, flexDirection:'row',alignItems:'center', justifyContent:'space-between'}, animatedTodoStyle]:
                      [{paddingHorizontal:8, paddingVertical:20, flexDirection:'row',alignItems:'center', justifyContent:'space-between'}, animatedSwipeStyle]}>
                          <View style={{flex:9/10}} >
                              <Text style={{fontSize:16, fontWeight:'bold'}}>{item.todo}</Text>
                              <Text style={{fontSize:15}} numberOfLines={1} ellipsizeMode="tail" >{item.details}</Text>
                          </View>
                          {!selectMultiple && <TouchableOpacity onPress={()=>{optionsHandler(item.key, item.purpose, item.todo, item.details, item.priority, item.completed, item.date)}} style={{flex:1/10}}>
                              <SimpleLineIcons name="options-vertical" size={24} color="green" />
                          </TouchableOpacity>}
                          {selectMultiple && keysMarked.includes(item.key) && <TouchableOpacity onPress={()=>{longPressed(item.key, 'unmark')}} style={{flex:1/10}}>
                          <MaterialIcons name="check-box" size={24} color="green" />
                        </TouchableOpacity>}
                        {selectMultiple && !keysMarked.includes(item.key) && <TouchableOpacity onPress={()=>{longPressed(item.key, 'mark')}} style={{flex:1/10}}>
                            <MaterialIcons name="check-box-outline-blank" size={24} color="green" />
                        </TouchableOpacity>}
                          <View style={{position:'absolute', fontSize:12,paddingHorizontal:8, bottom:0, flexDirection:'row',alignItems:'center'}}>
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
                }}
            />
            {!selectMultiple && <TouchableOpacity  onPress={()=>{navigation.navigate("editviewaddtodo", {purpose:'addTodo'})}} style={{position:'absolute', bottom:50, right:50}}>
                <Ionicons name="add-circle" size={60} color="#0b874f" />
            </TouchableOpacity>}
            <AnimatedTouchableOpacity onPress={clickOut} style={[{position:'absolute', justifyContent:'center', alignItems:'center', height,width, backgroundColor:'#ffffff00'}, animatedStyle]}>
                <View style={{width:'80%', height:'40%',borderRadius:5, backgroundColor:'white' , elevation:50 , paddingHorizontal:20}}>
                    <TouchableOpacity onPress={()=>{optionClicked('details')}} style={style.options}>
                        <Octicons name="dot-fill" size={14} color="green" />
                        <Text style={style.text}>Details/Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{optionClicked('delete')}} style={style.options}>
                        <Octicons name="dot-fill" size={14} color="green" />
                        <Text style={style.text}>Delete</Text>
                    </TouchableOpacity>
                    {!done && <TouchableOpacity onPress={()=>{optionClicked('mark')}} style={style.options}>
                        <Octicons name="dot-fill" size={14} color="green" />
                        <Text style={style.text}>Mark as Completed</Text>
                    </TouchableOpacity>}
                    {done && <TouchableOpacity onPress={()=>{optionClicked('mark as pend')}} style={style.options}>
                        <Octicons name="dot-fill" size={14} color="green" />
                        <Text style={style.text}>Mark as Pending</Text>
                    </TouchableOpacity>}
                </View>

            </AnimatedTouchableOpacity>
            {selectMultiple && <View style={{position:'absolute', bottom:0, height:50, backgroundColor:'green', flexDirection:'row', width, justifyContent:'space-around', alignItems:'center'}}>
                {!done && <TouchableOpacity onPress={()=>selectMultipleFunc('mark')} disabled={keysMarked.length==0} style={[style.selectMultiple, {opacity:keysMarked.length==0 && 0.7} ]}>
                    <Ionicons name="checkmark-done-sharp" size={24} color="white" />
                    <Text style={{color:'white'}}>Mark as Complete</Text>
                </TouchableOpacity>}
                {done && <TouchableOpacity onPress={()=>selectMultipleFunc('mark as pend')} disabled={keysMarked.length==0} style={[style.selectMultiple, {opacity:keysMarked.length==0 && 0.7} ]}>
                    <Ionicons name="checkmark-done-sharp" size={24} color="white" />
                    <Text style={{color:'white'}}>Mark as Pending</Text>
                </TouchableOpacity>}
                <TouchableOpacity onPress={()=>selectMultipleFunc('delete')} disabled={keysMarked.length==0} style={[style.selectMultiple, {opacity:keysMarked.length==0 && 0.7}]}>
                    <MaterialIcons name="delete" size={24} color="white" />
                    <Text style={{color:'white'}}>Delete</Text>
                </TouchableOpacity>
                {data.length==keysMarked.length && <TouchableOpacity style={style.selectMultiple} onPress={()=>selectMultipleFunc('unmarkall')}>
                    <FontAwesome5 name="check-circle" size={24} color="black" />
                    <Text style={{color:'white'}}>Unmark All</Text>
                </TouchableOpacity>}
                {data.length!=keysMarked.length && <TouchableOpacity style={style.selectMultiple} onPress={()=>selectMultipleFunc('markall')}>
                    <FontAwesome5 name="check-circle" size={24} color="white" />
                    <Text style={{color:'white'}}>Mark All</Text>
                </TouchableOpacity>}
            </View>}
        </ImageBackground>
    )
}const style = StyleSheet.create({
    options:{
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#498a7f88',
        flex:1/3
    },
    text:{
        paddingLeft:7
    },
    selectMultiple:{
        alignItems:'center'
    }
})