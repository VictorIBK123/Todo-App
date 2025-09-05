import { NavigationContainer } from "@react-navigation/native"
import Tabs from "./screens/tabs"
import EditViewAddTodo from "./screens/editviewaddtodo"
import { createStackNavigator } from "@react-navigation/stack"
import { context } from "./context/context"
import { useEffect, useMemo, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { GestureHandlerRootView } from "react-native-gesture-handler"
export default function(){
  const stack = createStackNavigator()
  const [todos, setTodos] =useState([])
  useEffect(()=>{
    (async()=>{
      try {
        const appData= await AsyncStorage.getItem('todoapp')
        setTodos(appData ? JSON.parse(appData).todos : [])
      } catch (error) {
        await AsyncStorage.setItem('todoapp', JSON.stringify({todos: []}))
      }
    }
    )()
  },[])
  useEffect(()=>{
    (async()=>{
      await AsyncStorage.setItem('todoapp', JSON.stringify({todos}))
    })()
  },[todos])
  return(
    <context.Provider value={useMemo(()=>({todos, setTodos}),[todos,setTodos])}>
      <NavigationContainer>
        <stack.Navigator screenOptions={{headerTitleAlign:'center', headerStyle:{height:60}}}>
            <stack.Screen name="notcompletedlist" options={{title:'Todos'}} component={Tabs} />
            <stack.Screen name="editviewaddtodo" options={{title:'Add Todo'}} component={EditViewAddTodo} />
        </stack.Navigator>
      </NavigationContainer>
    </context.Provider>
  )
}