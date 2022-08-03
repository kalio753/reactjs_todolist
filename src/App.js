import "./App.css"
import { Button, Form, Input, message, Select, Progress } from "antd"
import {
    PlusOutlined,
    CheckCircleFilled,
    DeleteFilled,
    BackwardFilled,
    SearchOutlined,
    CloseOutlined,
} from "@ant-design/icons"
import { useRef, useState, useEffect } from "react"

function App() {
    const tasksApi = "https://62e397463c89b95396cb9f4f.mockapi.io/tasks"
    const { Option } = Select
    const inputRef = useRef()
    const [form] = Form.useForm()
    const [value, setValue] = useState("")
    const [isEditing, setIsEditing] = useState({ status: false, id: -1 })
    const [tasks, setTasks] = useState(
        JSON.parse(localStorage.getItem("tasks")) || []
    )
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

    // useEffect(() => {
    //     localStorage.setItem("tasks", JSON.stringify(tasks) || [])
    // }, [tasks])

    // console.log(tasks)

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
            form.resetFields()
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

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">Tasks board</h1>
                <p className="App-description">
                    A list of errands and other tasks – often written on a piece
                    of paper as a memory aid
                </p>
                <div className="search-container">
                    <button className="search-btn" onClick={handleSearch}>
                        <SearchOutlined />
                    </button>
                    {isSearched && (
                        <>
                            <Input
                                type="text"
                                autoFocus={true}
                                value={searchText}
                                onChange={(e) => handleSearchChange(e)}
                                allowClear
                            />

                            <button
                                className="search-close"
                                onClick={handleSearch}
                            >
                                <CloseOutlined />
                            </button>
                        </>
                    )}
                </div>
                {!isSearched && (
                    <Form
                        className="form-container"
                        onFinish={onFormFinish}
                        form={form}
                    >
                        <Form.Item name="task" className="form-input">
                            <Input
                                placeholder="Task here..."
                                onChange={(e) => setValue(e.target.value)}
                                value={value}
                                allowClear
                                ref={inputRef}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Select
                                value={priority}
                                style={{
                                    width: 120,
                                }}
                                onChange={(e) => setPriority(e)}
                            >
                                <Option value="1">Most Important</Option>
                                <Option value="2">Important</Option>
                                <Option value="3">Less Important</Option>
                            </Select>
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                            shape="circle"
                            className="form-btn"
                        ></Button>
                    </Form>
                )}
                <ul className="task-list">
                    {!isSearched &&
                        tasks?.map((task, index) => (
                            <li
                                className={`task-item ${
                                    task.isDone ? "task-item-done" : ""
                                }`}
                                key={index}
                            >
                                <Button
                                    className="task-item-option "
                                    shape="circle"
                                    type="text"
                                    onClick={() => handleToggleTask(task.id)}
                                >
                                    {!task.isDone ? (
                                        <CheckCircleFilled />
                                    ) : (
                                        <BackwardFilled />
                                    )}
                                </Button>

                                <div className=" task-item-section ">
                                    {isEditing.id !== task.id && (
                                        <h4
                                            className=" noselect task-item-title"
                                            onClick={(e) =>
                                                handleDoubleClick(e, task)
                                            }
                                        >
                                            <span>Task {index}:</span> &nbsp;
                                            {task.name}
                                        </h4>
                                    )}

                                    {isEditing.status &&
                                        isEditing.id === task.id && (
                                            <input
                                                type="text"
                                                autoFocus={isEditing.status}
                                                className="task-item-input"
                                                value={editTask}
                                                onChange={(e) =>
                                                    setEditTask(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.which === 13) {
                                                        handleEnterInput(
                                                            task.id
                                                        )
                                                    }
                                                }}
                                                onBlur={() =>
                                                    handleEnterInput(task.id)
                                                }
                                            />
                                        )}
                                </div>

                                <Button
                                    className="task-item-delete"
                                    shape="circle"
                                    type="text"
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    <DeleteFilled />
                                </Button>
                            </li>
                        ))}
                    {isSearched &&
                        searchTasks.map((task, index) => (
                            <li
                                className={`task-item ${
                                    task.isDone ? "task-item-done" : ""
                                }`}
                                key={index}
                            >
                                <Button
                                    className="task-item-option "
                                    shape="circle"
                                    type="text"
                                    onClick={() => handleToggleTask(task.id)}
                                >
                                    {!task.isDone ? (
                                        <CheckCircleFilled />
                                    ) : (
                                        <BackwardFilled />
                                    )}
                                </Button>

                                <div className=" task-item-section ">
                                    {isEditing.id !== task.id && (
                                        <h4
                                            className=" noselect task-item-title"
                                            onClick={(e) =>
                                                handleDoubleClick(e, task)
                                            }
                                        >
                                            <span>Task {index}:</span> &nbsp;
                                            {task.name}
                                        </h4>
                                    )}

                                    {isEditing.status &&
                                        isEditing.id === task.id && (
                                            <input
                                                type="text"
                                                autoFocus={isEditing.status}
                                                className="task-item-input"
                                                value={editTask}
                                                onChange={(e) =>
                                                    setEditTask(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.which === 13) {
                                                        handleEnterInput(
                                                            task.id
                                                        )
                                                    }
                                                }}
                                                onBlur={() =>
                                                    handleEnterInput(task.id)
                                                }
                                            />
                                        )}
                                </div>

                                <Button
                                    className="task-item-delete"
                                    shape="circle"
                                    type="text"
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    <DeleteFilled />
                                </Button>
                            </li>
                        ))}
                    <div className="task-btn">
                        {tasks?.length > 1 && !isSearched && (
                            <Button
                                onClick={handleCheckAll}
                                className="task-clear-btn"
                            >
                                Check all
                            </Button>
                        )}
                        {tasks?.length > 1 &&
                            !isSearched &&
                            tasks.some((task) => task.isDone) && (
                                <Button
                                    onClick={handleDeleteCheck}
                                    className="task-delete-btn"
                                >
                                    Delete all done tasks
                                </Button>
                            )}
                    </div>
                </ul>

                {tasks?.length > 1 && !isSearched && (
                    <div className="footer">
                        <Progress
                            percent={Math.floor(
                                (tasks.reduce(
                                    (acc, task) =>
                                        task.isDone ? acc + 1 : acc,
                                    0
                                ) *
                                    100) /
                                    tasks.length
                            )}
                            steps={tasks.length}
                        />
                        <div>
                            Sort by: &nbsp;
                            <Select
                                value={sortType}
                                style={{
                                    width: 120,
                                }}
                                onChange={(e) => handleSortChange(e)}
                            >
                                <Option value="default">Default</Option>
                                <Option value="priority">Priority</Option>
                                <Option value="progess">Done</Option>
                            </Select>
                        </div>
                    </div>
                )}
            </header>
        </div>
    )
}

export default App
