import { Dimensions, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SetStateAction, useEffect, useState } from "react";
import DatePicker from "react-native-date-picker";
import { useContext } from "react";
import { context } from "../context/context";
export default function EditViewAddTodo({route}:{route: any}){
    const {todos, setTodos} = useContext(context)
    const {height, width} = Dimensions.get('window')
    const [purpose, setPurpose] = useState(route.params.purpose)//getting the purpose of viewing this screen, checks if the navigation if from the element, add, or edit
    //default values for adding todo 
    const [date, setDate] = useState(new Date(new Date()))
    const [title, setTitle] = useState('')
    const [details, setDetails] = useState('')
    const [priority, setPriority] = useState<string|null>(null)
    const [editable, setEditable] =useState(true)
    const [completed, setCompleted] = useState(false)
    const [inputBlur1, setInputBlur1] = useState(false)
    const [inputBlur2, setInputBlur2] = useState(false)
    const [canNowEdit, setCanNowEdit] = useState(false) //used to edit immediately on screen, works while true
    useEffect(()=>{
        // when a todo component is being viewed
        if (purpose=='view'){
            setDate(new Date(route.params.date)); setTitle(route.params.title); setDetails(route.params.details);setPriority(route.params.priority);setEditable(false);setCompleted(route.params.completed)
        }
    },[])
          
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState<'date' | 'time' | 'datetime' | undefined>(undefined)
    const [day, month, year] = [date.getDate(), date.getMonth()+1, date.getFullYear()]
    const [hr, min] = [date.getHours(), date.getMinutes()]
    const priorityHandler =(priority: string)=>{
        if (priority){
            setPriority(priority)
        }
        
    }
    const textInputHandler =(value: SetStateAction<string>, type: string)=>{
        type=='title'?setTitle(value):setDetails(value)
    }
    const statusHandler=(value: boolean | ((prevState: boolean) => boolean))=>{
        setCompleted(value)
    }
    const handleSave=(purpose: string)=>{
        if (!(title.length==0 ||  priority==null)){
            if (purpose=='addTodo' && !canNowEdit){
                setCanNowEdit(true)
                setTodos([{todo: title, details, completed, priority, key: todos.length!=0?todos[0].key+1:1 ,date:date.toISOString()},...todos])
            }
            
            else if (purpose=='view' && !canNowEdit){
                setCanNowEdit(true)
                setTodos([{todo: title, details, completed, priority, key: todos.length!=0?todos[0].key+1:1 ,date:date.toISOString()}, ...todos.filter((element: { key: any; })=>{
                    return (element.key!=route.params.key)
                })])
            }
            else if(canNowEdit){
                setTodos([{todo: title, details, completed, priority, key: todos.length!=0?todos[0].key+1:1 ,date:date.toISOString()}, ...todos.slice(1,todos.length)])
            }
            setEditable(false)
        }
        else{
            alert('Please fill in all the fields')
        }
    }
    return (
        <ScrollView style={{height,}}>
            <View style={{ paddingHorizontal:10, paddingTop:10, paddingBottom:10}}>
                <View style={{backgroundColor:'white', borderRadius:5,paddingHorizontal:5, paddingVertical:5}}>
                    <Text style={{fontSize:20, paddingLeft:10}}>Title</Text>
                    <TextInput  value={title} onBlur={()=>{setInputBlur1(true)}}  onChangeText={(value)=>textInputHandler(value, 'title')} editable={editable} returnKeyType="next" maxLength={40} numberOfLines={1} multiline={false} style={{borderRadius:10,borderColor:'green',borderWidth: editable?1:0, color:'black', paddingLeft:10,width: '90%', paddingVertical:7, marginLeft:10, marginTop:5}} />
                    {inputBlur1 && title.length==0 &&  <Text style={{color:'red'}}>Please enter your todo title</Text>}
                </View>
                <View style={{backgroundColor:'white', borderRadius:5,paddingVertical:5,paddingHorizontal:5, marginTop:15}}>
                    <Text style={{fontSize:20, paddingLeft:10}}>Details (Optional)</Text>
                    <TextInput value={details} onBlur={()=>{setInputBlur2(true)}} editable={editable} onChangeText={(value)=>textInputHandler(value, 'details')} multiline={true} style={{borderRadius:10, color:'black', textAlignVertical:'top',marginLeft:10,borderColor:'green', width: '90%', height:200,borderWidth: editable?1:0,  paddingVertical:3, marginVertical:5}} />
                    {inputBlur2 && title.length==0 && <Text style={{color:'red'}}>Please enter your todo details</Text>}
                </View>
                <View style={{marginTop:15, backgroundColor:'white',paddingVertical:5,paddingHorizontal:5, borderRadius:5}}>
                    <Text style={{fontSize:20, paddingLeft:10}}>Priority</Text>
                    <View style={{flexDirection:'row', paddingLeft:10, marginTop:5}}>
                        <TouchableOpacity disabled={!editable} onPress={()=>{priorityHandler('high')}} style={{flexDirection:'row'}}>
                            {priority=='high' && <Ionicons name="radio-button-on" size={18} color="green" />}
                            {priority!='high' && <Ionicons name="radio-button-off-sharp" size={18} color="green" />}
                            <Text>High</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={!editable} onPress={()=>{priorityHandler('medium')}} style={{flexDirection:'row', marginLeft:(15/100)*width}}>
                            {priority=='medium' && <Ionicons name="radio-button-on" size={18} color="green" />}
                            {priority!='medium' && <Ionicons name="radio-button-off-sharp" size={18} color="green" />}
                            <Text>Medium</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={!editable} onPress={()=>{priorityHandler('low')}} style={{flexDirection:'row', marginLeft:(15/100)*width}}>
                            {priority=='low' && <Ionicons name="radio-button-on" size={18} color="green" />}
                            {priority!='low' && <Ionicons name="radio-button-off-sharp" size={18} color="green" />}
                            <Text>Low</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginTop:15, backgroundColor:'white',paddingVertical:5,paddingHorizontal:5, borderRadius:5}}>
                    <Text style={{fontSize:20, paddingLeft:10}}>Due Date</Text>
                    <View style={{flexDirection:'row', alignItems:'center', }}>
                        <TouchableOpacity disabled={!editable} onPress={()=>{setMode('date'); setOpen(true)}} style={{flexDirection:'row', alignItems:'center', marginRight:(20/100)*width, paddingLeft:10}}>
                            <FontAwesome5 name="calendar-alt" size={20} color="green" />
                            <Text style={{marginLeft:10}}>{day.toString().length>1?day.toString():'0'+day.toString()}-{month.toString().length>1?month.toString():'0'+month.toString()}-{year.toString().length>1?year.toString():'0'+year.toString()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={!editable} onPress={()=>{setMode('time'); setOpen(true)}} style={{flexDirection:'row', alignItems:'center', marginTop:5}}>
                            <FontAwesome5 name="clock" size={20} color="green" />
                            <Text style={{marginLeft:10}}>{(()=>{
                                if (hr==12){
                                    return (hr)
                                }
                                else{
                                    return ((hr%12).toString().length>1?(hr%12).toString():'0'+(hr%12).toString())
                                }
                            })()}:{min.toString().length>1?min.toString():'0'+min.toString()} {date.getHours()>=12?'PM':'AM'}</Text>
                        </TouchableOpacity>
                    </View>
                    <DatePicker
                        modal
                        mode={mode}
                        onConfirm={(date)=>{setOpen(false); setDate(date)}}
                        onCancel={()=>{setOpen(false)}}
                        minimumDate={new Date()}
                        theme="dark"
                        open={open}
                        date={date}
                    />
                </View>
                <View style={{backgroundColor:'white', borderRadius:5,paddingHorizontal:5,paddingVertical:10, marginTop:15}}>
                        {!editable && <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:20, paddingLeft:10}}>Todo Status: </Text>
                            <Text style={{fontSize:15,backgroundColor:'#00000022', padding:5, borderRadius:5}}>{completed?'Completed':'Pending'} </Text>
                        </View>}
                        {editable &&route.params.purpose=='view' &&  <View >
                        <Text style={{fontSize:20, paddingLeft:10}}>Todo Status: </Text>
                        <View style={{flexDirection:'row', paddingLeft:10, marginTop:5}}>
                            <TouchableOpacity onPress={()=>{statusHandler(true)}} style={{flexDirection:'row'}}>
                                {completed && <Ionicons name="radio-button-on" size={18} color="green" />}
                                {!completed && <Ionicons name="radio-button-off-sharp" size={18} color="green" />}
                                <Text style={{fontSize:15,marginRight:(15/100)*width}}>Completed</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{statusHandler(false)}} style={{flexDirection:'row'}}>
                                {!completed && <Ionicons name="radio-button-on" size={18} color="green" />}
                                {completed && <Ionicons name="radio-button-off-sharp" size={18} color="green" />}
                                <Text style={{fontSize:15, }}>Pending</Text>
                            </TouchableOpacity>
                            </View>
                        </View>}
                    </View>
                {editable && <TouchableOpacity onPress={()=>handleSave(route.params.purpose)}  style={{alignSelf:'flex-end', marginTop:15, backgroundColor:'green', width:100, paddingVertical:10,paddingHorizontal:10,marginRight:10, borderRadius:5}}>
                    <Text style={{textAlign:'center'}}>Save</Text>
                </TouchableOpacity>}
                {!editable && 
                <View style={{marginTop:15, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <TouchableOpacity onPress={()=>{setEditable(true)}} style={{backgroundColor:'green', width:100, paddingVertical:10,paddingHorizontal:10,borderRadius:5}}>
                        <Text style={{textAlign:'center'}}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!editable  } style={{ opacity:0.5, backgroundColor:'green', width:100, paddingVertical:10,paddingHorizontal:10,marginRight:10, borderRadius:5}}>
                        <Text style={{textAlign:'center'}}>Saved</Text>
                    </TouchableOpacity>
                </View>
                }
            </View>
        </ScrollView>
    )
}