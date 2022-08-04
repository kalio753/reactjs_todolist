import { message } from "antd"
import { useState, useEffect } from "react"
import Context from "./Context.js"

function Provider({ children }) {
    const tasksApi = "https://62e397463c89b95396cb9f4f.mockapi.io/tasks"
    const [value, setValue] = useState("")
    const [isEditing, setIsEditing] = useState({ status: false, id: -1 })
    const [tasks, setTasks] = useState([])
    const [editTask, setEditTask] = useState()
    const [priority, setPriority] = useState("2")
    const [sortType, setSortType] = useState("default")
    const [isSearched, setIsSearched] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [searchTasks, setSearchTasks] = useState()

    useEffect(() => {
        getTask()
    }, [])

    function getTask() {
        fetch(tasksApi)
            .then((response) => response.json())
            .then((tasksList) => setTasks(tasksList))
    }

    const onFormFinish = (e) => {
        if (e.task) {
            const data = {
                name: e.task,
                isDone: false,
                priority: priority,
                index: tasks.length,
            }
            fetch(tasksApi, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }).then(() => getTask())
            setTasks((prev) => [...prev, data])
            //
            setValue("")
            message.success("Add success")
        } else {
            message.error("The filed cannot be blank! ")
        }
    }

    const handleDeleteTask = (id) => {
        setIsSearched(false)
        setTasks(tasks.filter((task) => task.id !== id))
        fetch(tasksApi + "/" + id, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
    }

    const handleToggleTask = (id) => {
        setIsEditing({ status: false, id: -1 })
        setIsSearched(false)

        const updateTask = tasks.map((task) =>
            task.id === id ? { ...task, isDone: !task.isDone } : task
        )
        setTasks(updateTask)

        const data = updateTask.filter((task) => task.id === id)

        fetch(tasksApi + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data[0]),
        })
    }

    const handleDoubleClick = (e, task) => {
        if (!task.isDone && e.detail === 2) {
            setIsEditing({ status: true, id: task.id })
            setEditTask(task.name)
        }
    }

    const handleEnterInput = (id) => {
        const updateTask = tasks.map((task) =>
            isEditing.id === task.id ? { ...task, name: editTask } : task
        )
        setTasks(updateTask)

        const data = updateTask.filter((task) => task.id === id)
        fetch(tasksApi + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data[0]),
        })
        setIsEditing({ status: false, id: -1 })
        setIsSearched(false)
    }

    const handleCheckAll = async () => {
        const tasksAllDone = tasks.map((task) => ({ ...task, isDone: true }))
        const allPromises = tasksAllDone.forEach(async (task) => {
            return await fetch(tasksApi + "/" + task.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(task),
            })
        })
        setTasks(tasksAllDone)

        // These codes to uncheck all tasks
        const allDone = tasks.every((task) => task.isDone === true)
        if (allDone) {
            const updateTask = tasks.map((task) => ({ ...task, isDone: false }))
            updateTask.forEach((task) => {
                fetch(tasksApi + "/" + task.id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(task),
                })
            })
            setTasks(updateTask)
        }
    }

    const handleDeleteCheck = () => {
        setTasks(tasks.filter((task) => task.isDone === false))
        const idsToDelete = tasks.reduce(
            (acc, task) => (task.isDone === true ? [...acc, task.id] : acc),
            []
        )
        for (let i in idsToDelete) {
            console.log(idsToDelete, i)
            fetch(tasksApi + "/" + idsToDelete[i], {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            })
        }
    }

    const handleSearch = () => {
        setIsSearched(!isSearched)
        setSearchText("")
        setSearchTasks([])
    }

    const handleSearchChange = (e) => {
        setSearchText(e.target.value)
        setSearchTasks(
            tasks.filter((task) => task.name.includes(e.target.value))
        )
    }

    const handleSortChange = (e) => {
        setSortType(e)
        if (e === "priority") {
            tasks.sort(
                (a, b) => parseFloat(a.priority) - parseFloat(b.priority)
            )
        } else if (e === "default") {
            tasks.sort((a, b) => parseFloat(a.index) - parseFloat(b.index))
        } else if (e === "progess") {
            tasks.sort((a, b) => Number(a.isDone) - Number(b.isDone))
        }
    }

    const data = {
        value,
        isEditing,
        tasks,
        editTask,
        priority,
        sortType,
        isSearched,
        searchText,
        searchTasks,
        onFormFinish,
        handleDeleteTask,
        handleToggleTask,
        handleDoubleClick,
        handleEnterInput,
        handleCheckAll,
        handleDeleteCheck,
        handleSearch,
        handleSearchChange,
        handleSortChange,
        setValue,
        setIsEditing,
        setTasks,
        setEditTask,
        setPriority,
        setSortType,
        setIsSearched,
        setSearchText,
        setSearchTasks,
    }

    return <Context.Provider value={data}>{children}</Context.Provider>
}

export default Provider
