import { useContext } from "react"
import Context from "../Context"
import { Button } from "antd"

import {
    CheckCircleFilled,
    DeleteFilled,
    BackwardFilled,
} from "@ant-design/icons"

function Body() {
    const context = useContext(Context)

    return (
        <>
            <ul className="task-list">
                {!context.isSearched &&
                    context.tasks?.map((task, index) => (
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
                                onClick={() =>
                                    context.handleToggleTask(task.id)
                                }
                            >
                                {!task.isDone ? (
                                    <CheckCircleFilled />
                                ) : (
                                    <BackwardFilled />
                                )}
                            </Button>

                            <div className=" task-item-section ">
                                {context.isEditing.id !== task.id && (
                                    <h4
                                        className=" noselect task-item-title"
                                        onClick={(e) =>
                                            context.handleDoubleClick(e, task)
                                        }
                                    >
                                        <span>Task {index}:</span> &nbsp;
                                        {task.name}
                                    </h4>
                                )}

                                {context.isEditing.status &&
                                    context.isEditing.id === task.id && (
                                        <input
                                            type="text"
                                            autoFocus={context.isEditing.status}
                                            className="task-item-input"
                                            value={context.editTask}
                                            onChange={(e) =>
                                                context.setEditTask(
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.which === 13) {
                                                    context.handleEnterInput(
                                                        task.id
                                                    )
                                                }
                                            }}
                                            onBlur={() =>
                                                context.handleEnterInput(
                                                    task.id
                                                )
                                            }
                                        />
                                    )}
                            </div>

                            <Button
                                className="task-item-delete"
                                shape="circle"
                                type="text"
                                onClick={() =>
                                    context.handleDeleteTask(task.id)
                                }
                            >
                                <DeleteFilled />
                            </Button>
                        </li>
                    ))}
                {context.isSearched &&
                    context.searchTasks.map((task, index) => (
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
                                onClick={() =>
                                    context.handleToggleTask(task.id)
                                }
                            >
                                {!task.isDone ? (
                                    <CheckCircleFilled />
                                ) : (
                                    <BackwardFilled />
                                )}
                            </Button>

                            <div className=" task-item-section ">
                                {context.isEditing.id !== task.id && (
                                    <h4
                                        className=" noselect task-item-title"
                                        onClick={(e) =>
                                            context.handleDoubleClick(e, task)
                                        }
                                    >
                                        <span>Task {index}:</span> &nbsp;
                                        {task.name}
                                    </h4>
                                )}

                                {context.isEditing.status &&
                                    context.isEditing.id === task.id && (
                                        <input
                                            type="text"
                                            autoFocus={context.isEditing.status}
                                            className="task-item-input"
                                            value={context.editTask}
                                            onChange={(e) =>
                                                context.setEditTask(
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.which === 13) {
                                                    context.handleEnterInput(
                                                        task.id
                                                    )
                                                }
                                            }}
                                            onBlur={() =>
                                                context.handleEnterInput(
                                                    task.id
                                                )
                                            }
                                        />
                                    )}
                            </div>

                            <Button
                                className="task-item-delete"
                                shape="circle"
                                type="text"
                                onClick={() =>
                                    context.handleDeleteTask(task.id)
                                }
                            >
                                <DeleteFilled />
                            </Button>
                        </li>
                    ))}
                <div className="task-btn">
                    {context.tasks?.length > 1 && !context.isSearched && (
                        <Button
                            onClick={context.handleCheckAll}
                            className="task-clear-btn"
                        >
                            Check all
                        </Button>
                    )}
                    {context.tasks?.length > 1 &&
                        !context.isSearched &&
                        context.tasks.some((task) => task.isDone) && (
                            <Button
                                onClick={context.handleDeleteCheck}
                                className="task-delete-btn"
                            >
                                Delete all done tasks
                            </Button>
                        )}
                </div>
            </ul>
        </>
    )
}

export default Body
