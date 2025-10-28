import axios from 'axios'
export const useConvertToText = async(audioPath: string)=>{
  try {
    const formData = new FormData()
    console.log(audioPath.split('.')[audioPath.split('.').length-1])
    formData.append('audio',{
      uri: audioPath,
      type: `audio/${audioPath.split('.')[audioPath.split('.').length-1]}`,
      name: audioPath.split('/')[audioPath.split('/').length-1]
    } as any)
    formData.append('prompt', `Give a json object strictly in this format {todo, details, completed, priority, key: todos.length!=0?todos[0].key+1:1 ,date:date.toISOString()} where todo is a short title for the todo, details is a detailed description of the todo, completed is a boolean indicating whether the todo is completed or not and should be set to false in this case since the user just added it, priority can be high, low or medium in string format, leave the key like that, the system will calculate it itself ,just leave it like this key: todos.length!=0?todos[0].key+1:1, date (deadline for the todo) if the user didn't include the date strictly, use 'date:date.toISOString()' as the default should be extracted from the voice , note: the current date is ${(new Date).getMonth() }-${(new Date).getDate()}-${(new Date).getFullYear()} and all the information should be based on the content of the audio only,the key value should be a random number between 30.0000000000000 and 100000.0000000000`)
    const response = await axios.post('https://todo-ai-5ow3.onrender.com/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return ((response.data.output as string).split('```json')[1].split('```')[0].trim());
  } catch (error) {
    alert(error);
  }
  
}
