import { useContext } from "react"
import Context from "../Context"
import { Select, Progress } from "antd"

function Footer() {
    const context = useContext(Context)
    const { Option } = Select

    return (
        <>
            <div className="footer">
                <Progress
                    percent={Math.floor(
                        (context.tasks.reduce(
                            (acc, task) => (task.isDone ? acc + 1 : acc),
                            0
                        ) *
                            100) /
                            context.tasks.length
                    )}
                    steps={context.tasks.length}
                />
                <div>
                    Sort by: &nbsp;
                    <Select
                        value={context.sortType}
                        style={{
                            width: 120,
                        }}
                        onChange={(e) => context.handleSortChange(e)}
                    >
                        <Option value="default">Default</Option>
                        <Option value="priority">Priority</Option>
                        <Option value="progess">Done</Option>
                    </Select>
                </div>
            </div>
        </>
    )
}

export default Footer
