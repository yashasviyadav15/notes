import React, { useState } from 'react'
import { useEffect } from 'react'
// import './TodoApp.css';

const Todo=({})=>{
const [todo,settodo]=useState([])
const [inputvalue,setinputvalue]=useState("")
const handleadd=(e)=>{
console.log(e.target.value,"handleadd")
if(inputvalue?.trim()){
    settodo([...todo, { text: inputvalue, completed: false }]);
    setinputvalue("")
}
}
const handleDelete=(index)=>{
    console.log(index,"handledelete")
    const newtodo = todo?.filter((_,filterindex)=>filterindex !== index)
    settodo(newtodo)
}
useEffect(()=>{
const localdata= JSON.parse(localStorage.getItem("todo"))
if(localdata){
settodo(localdata)
}
},[])

useEffect(()=>{
localStorage.setItem("todo",JSON.stringify(todo))
},[todo])
const toggleTodo = (toggleIndex) => {
const toggledtodo=todo?.map((item,index)=>(
    toggleIndex==index?{...item, completed:!item.completed}:item
))
settodo(toggledtodo);
}
return (
    <>
    <h1>Todo List</h1>
    <input
    type="text"
    value={inputvalue}
    onChange={(e)=>setinputvalue(e.target.value)}
    placeholder='please enter a text'
    />
    <button
    onClick={handleadd}
    >
    Add
    </button>

    <hr></hr>
    <h1>List of todos</h1>
    <ul>
        {todo?.map((item,index)=>(
            <>
            <li>
                <input
                type="checkbox"
                checked={item.completed}
                onChange={()=>toggleTodo(index)}
                />
                <span>{item.text}</span>
             
            <button
            onClick={()=> handleDelete(index)}
            >
            Delete
            </button>
            </li>
            </>
           
                           )
                   )
        }
    </ul>
    </>
)
}
export default Todo;