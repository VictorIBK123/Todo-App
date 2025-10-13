import { Easing, FlatList, Image, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import React ,{ memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { context } from "../context/context.js"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {runOnJS, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFocusEffect} from "@react-navigation/native";
import ListItem from './listItem';
import FlatListComp from "./listflatlist";
import { SafeAreaView } from "react-native-safe-area-context";
const  MainListComponent =({parentNavigation, navigation, done}: {parentNavigation: any, navigation: any, done: boolean})=>{
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable)
    const {todos, setTodos} = useContext(context)
    
      
    // storing items marked
    const [keysMarked, setKeysMarked] = useState<any[]>([])
    const [selectMultiple, setSelectMultiple] =useState(false)
    const [key,setKey] = useState(null)
    const [purpose, setPurpose] = useState<string | null>(null)
    const [title, setTitle] = useState(null)
    const [details, setDetails] = useState(null)
    const [priority, setPriority] = useState(null)
    const [completed, setCompleted] = useState(null)
    const [date, setDate] = useState(null)
    const {height, width} =  useWindowDimensions()
    const leftDistance = useSharedValue(0)
    const top = useSharedValue(height)
    const translateX = useSharedValue(0)//used to translate the component to right when swipe is detected
    
    // if todo is changed , the left position of each component will be readjested to the default (0), 
    // this is done because when the delete button is pressed in the options, the animation will that will shift the component to be deleted will
    // be shifted to the right, but we have to set it backto 0 when the component is deleted
    const clickOut=()=>{
        top.value = withTiming(height, {duration:500})
    }
    const optionsHandler=useCallback((key: React.SetStateAction<null>,purpose: any, title: React.SetStateAction<null>, details: React.SetStateAction<null>,priority: React.SetStateAction<null>, completed: React.SetStateAction<null>, date: React.SetStateAction<null> )=>{
        setKey(key); setPurpose('view'); setTitle(title); setDetails(details); setPriority(priority); setCompleted(completed); setDate(date)
        top.value = withTiming(0, {duration:500})
    },[])
    const optionClicked =(type: string)=>{
        if (type=='details'){
            navigation.navigate("editviewaddtodo", {key, purpose, title, details, priority, completed, date})
        }
        else if(type=='mark'){
            setTodos(todos.map((element: { key: null; })=>{
                if (key==element.key){
                    return ({...element, completed:true})
                }
                else{
                    return (element)
                }
            }))
        }
        else if(type=='mark as pend'){
            setTodos(todos.map((element: { key: null; })=>{
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
                    runOnJS(setTodos)(todos.filter((element: { key: null; })=>element.key!=key))
                }
            })
        }
        top.value = withTiming(height, {duration:500})
    }
    // declared data to be used in the flatlist
    var data: { key: any; completed: boolean }[]
    data = useMemo(()=>{
        if (done){
            return (todos.filter((element: { completed: any; })=>{
                return (element.completed)
              }))
        }
        else{
            return (todos.filter((element: { completed: any; })=>{
                return (!element.completed)
              }))
        }
    },[done, todos])

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
  
  const longPressed=useCallback((key: any, type: string)=>{
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
    
  },[keysMarked])
  const selectMultipleFunc=(type: string)=>{
    if (type=='markall'){
        setKeysMarked(data.map((element) => element.key))
    }
    else if(type=='unmarkall'){
        setKeysMarked([])
    }
    else if (type=='mark'){
        setTodos(todos.map((element: { key: any; })=>{
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
        setTodos(todos.map((element: { key: any; })=>{
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
        setTodos(todos.filter((element: { key: any; })=>!keysMarked.includes(element.key)))
        parentNavigation.setOptions({
            headerLeft:()=>null
        })
        setSelectMultiple(false)
        setKeysMarked([])
    }
  }

  const animatedStyle = useAnimatedStyle(()=>({top:top.value})) //animated style for the options
  const animatedTodoStyle = useAnimatedStyle(()=>({transform:[{translateX:leftDistance.value}]}))
  useEffect(()=>{
    leftDistance.value=0
},[todos])
    return (
        <ImageBackground imageStyle={{opacity:0.2, resizeMode:'contain', }} source={require('../assets/todo1.png')} style={{height:'100%'}}>
            <FlatListComp height={height}  widt={width} animatedTodoStyle={animatedTodoStyle} selectMultiple={selectMultiple} data={data} longPressed={longPressed} navigation={navigation} keysMarked={keysMarked} key={key} optionsHandler={optionsHandler} AnimatedTouchableOpacity={AnimatedTouchableOpacity} />
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
            {selectMultiple && <View style={{position:'absolute', bottom:0,width,}}>
            <View style={{ height:50, backgroundColor:'green', flexDirection:'row', width, justifyContent:'space-around', alignItems:'center'}}>
                {!done && <TouchableOpacity onPress={()=>selectMultipleFunc('mark')} disabled={keysMarked.length==0} style={[style.selectMultiple, {opacity: keysMarked.length == 0 ? 0.7 : 1} ]}>
                    <Ionicons name="checkmark-done-sharp" size={24} color="white" />
                    <Text style={{color:'white'}}>Mark as Complete</Text>
                </TouchableOpacity>}
                {done && <TouchableOpacity onPress={()=>selectMultipleFunc('mark as pend')} disabled={keysMarked.length==0} style={[style.selectMultiple, {opacity: keysMarked.length == 0 ? 0.7 : 1} ]}>
                    <Ionicons name="checkmark-done-sharp" size={24} color="white" />
                    <Text style={{color:'white'}}>Mark as Pending</Text>
                </TouchableOpacity>}
                <TouchableOpacity onPress={()=>selectMultipleFunc('delete')} disabled={keysMarked.length==0} style={[style.selectMultiple, {opacity: keysMarked.length == 0 ? 0.7 : 1}]}>
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
                
            </View>
            <SafeAreaView edges={['bottom']} style={{backgroundColor:'green'}} />
            </View>}
            
        </ImageBackground>
    )
}
const style = StyleSheet.create({
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

export default MainListComponent