"use client"

import { useState } from "react"
import { MdAdd, MdEdit, MdDelete, MdCheck, MdUndo, MdInfo } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react";
import {useRouter} from 'next/navigation';
import axios from 'axios'
import config from './config.js'
interface Task {
  title: string
  description: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: "", description: "" })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [user,setUser] = useState({})
  const[id,setId] = useState("")
  const [editindex,setEditindex] = useState(0)

  const[name,setName] = useState("")
  const[email,setEmail] = useState("")
  const[image,setImage] = useState("")
  const router = useRouter();

  useEffect(() => {
    // Code to run on mount or when dependencies change
    checksession()
    
  }, []);
  const checksession = async() =>{
    const value = localStorage.getItem("id");
    if(value === null){
       router.push("/login");
    }else{
      setId(localStorage.getItem("id"))
      setName(localStorage.getItem("name"))
      setEmail(localStorage.getItem("email"))
      setImage(localStorage.getItem("image"))      
      const response = await axios.get(`${config.url}/tasks`, {
      params: { id: localStorage.getItem("id") }, // Sending user ID as query parameter
    });
    setTasks(response.data)
  }  }

  const handleAddTask = async() => {
    if (newTask.title.trim() !== "") {
      const now = new Date()
      setTasks([
        ...tasks,
        {
          ...newTask,
          completed: false,
          createdAt: now,
          updatedAt: now,
        },
      ])
      setNewTask({ title: "", description: "" })
      setIsAddDialogOpen(false)
      console.log(newTask)
      await axios.post(`${config.url}/tasks`,{
        id:id,
        task:{
          title:newTask.title,
          description:newTask.description,
          completed: false,
          createdAt: now,
          updatedAt: now
        }
      })
    }
  }

  const handleEditTask = async(tindex: number) => {
    console.log(tindex)
    console.log(editingTask)
    if (editingTask) {
      setTasks(tasks.map((task,index) => (index === tindex ? { ...editingTask, updatedAt: new Date() } : task)))
      setEditingTask(null)
      setIsEditDialogOpen(false)
      editingTask.updatedAt=new Date()
      const response = await axios.put(`${config.url}/tasks/${id}/${tindex}`,{
      task:{
        title:editingTask.title,
        description:editingTask.description,
        completed:editingTask.completed,
        createdAt:editingTask.createdAt,
        updatedAt:editingTask.updatedAt
      } 
      })

    }
  }

  const handleDeleteTask = async(tindex: number) => {
    console.log(tindex)
   
    setTasks(tasks.filter((_, index) => index !== tindex));
    await axios.delete(`${config.url}/tasks/${id}/${tindex}`)
  }

  const handleCompleteTask = (id: number) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task)),
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Task Management System</h1>
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={image} alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-gray-800">{name}</p>
                <p className="text-sm text-gray-600">{email}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-600 transition duration-300 transform hover:scale-105">
                  <MdAdd className="mr-2" /> Add New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-lg p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 transition duration-300"
                  />
                  <Input
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 transition duration-300"
                  />
                  <Button
                    onClick={handleAddTask}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-600 transition duration-300 transform hover:scale-105"
                  >
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="completed">Completed Tasks</SelectItem>
                <SelectItem value="pending">Pending Tasks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ul className="space-y-4">
            {filteredTasks.map((task,index) => (
              <li
                key={task.id}
                className={`bg-gray-100 p-6 rounded-lg shadow-md transition duration-300 hover:shadow-lg ${
                  task.completed ? "bg-green-100" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-gray-600 mt-2">{task.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600 transition duration-300">
                          <MdInfo />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <p>
                            <strong>Created:</strong> {task.createdAt.toLocaleString()}
                          </p>
                          <p>
                            <strong>Last Updated:</strong> {task.updatedAt.toLocaleString()}
                          </p>
                          <p>
                            <strong>Status:</strong> {task.completed ? "Completed" : "Pending"}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      onClick={() => {
                        setEditingTask(task)
                        setEditindex(index)
                        setIsEditDialogOpen(true)
                      }}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                    >
                      <MdEdit />
                    </Button>
                    <Button
                      onClick={() => handleCompleteTask(task.id)}
                      className={`${
                        task.completed ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                      } text-white p-2 rounded-full transition duration-300`}
                    >
                      {task.completed ? <MdUndo /> : <MdCheck />}
                    </Button>
                    <Button
                      onClick={() => handleDeleteTask(index)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                    >
                      <MdDelete />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Task Title"
              value={editingTask?.title || ""}
              onChange={(e) => setEditingTask(editingTask ? { ...editingTask, title: e.target.value } : null)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 transition duration-300"
            />
            <Input
              placeholder="Task Description"
              value={editingTask?.description || ""}
              onChange={(e) => setEditingTask(editingTask ? { ...editingTask, description: e.target.value } : null)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 transition duration-300"
            />
            <Button
              onClick={()=>handleEditTask(editindex)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-600 transition duration-300 transform hover:scale-105"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

