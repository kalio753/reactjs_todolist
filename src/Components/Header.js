import { useContext } from "react"
import Context from "../Context"
import { Button, Form, Input, Select } from "antd"
import { PlusOutlined, SearchOutlined, CloseOutlined } from "@ant-design/icons"

function Header() {
    const { Option } = Select
    const [form] = Form.useForm()
    const context = useContext(Context)

    return (
        <>
            <h1 className="App-title">Tasks board</h1>
            <p className="App-description">
                A list of errands and other tasks – often written on a piece of
                paper as a memory aid
            </p>
            <div className="search-container">
                <button className="search-btn" onClick={context.handleSearch}>
                    <SearchOutlined />
                </button>
                {context.isSearched && (
                    <>
                        <Input
                            type="text"
                            autoFocus={true}
                            value={context.searchText}
                            onChange={(e) => context.handleSearchChange(e)}
                            allowClear
                        />

                        <button
                            className="search-close"
                            onClick={context.handleSearch}
                        >
                            <CloseOutlined />
                        </button>
                    </>
                )}
            </div>
            {!context.isSearched && (
                <Form
                    className="form-container"
                    onFinish={(e) => {
                        context.onFormFinish(e)
                        form.resetFields()
                    }}
                    form={form}
                >
                    <Form.Item name="task" className="form-input">
                        <Input
                            placeholder="Task here..."
                            onChange={(e) => context.setValue(e.target.value)}
                            value={context.value}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item>
                        <Select
                            value={context.priority}
                            style={{
                                width: 120,
                            }}
                            onChange={(e) => context.setPriority(e)}
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
        </>
    )
}

export default Header
