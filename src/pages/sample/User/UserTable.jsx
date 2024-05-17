import {Button, Popconfirm, Space, Table, Image, Tag} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";

const UserTable = ({data,deleteHandle}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const Delete = async (id) => {
        deleteHandle('/User',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/user/add')
    };
    const columns = [
        {
            title: 'Изображение',
            dataIndex: 'image',
            id: 'image',
            render: (image) => {
                return (
                    <Image
                        width={50}

                        src={`${process.env.REACT_APP_IMAGE_URL}/${image?.path}`}
                    />
                )},
        },
        {
            title: 'Полное имя',
            dataIndex: 'fulName',
            id: 'fulName',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Номер телефона',
            dataIndex: 'phoneNumber',
            id: 'phoneNumber',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Login',
            dataIndex: 'userName',
            id: 'userName',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Роль',
            dataIndex: 'role',
            id: 'role',
            render: (text) => <Tag>{text===1?"Админ":"Продавец"}</Tag>,
        },
        {
            title: 'Событие',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record.id)}
                        type='primary'
                        icon={<EditOutlined />}>
                        Изменить
                    </Button>
                    {
                        record?.role!==1&&
                    <Popconfirm
                        title={'Are you sure to delete this task?'}
                        description={'Delete the task '}
                        onConfirm={() => Delete(record.id)}>
                        <Button type='danger' icon={<DeleteOutlined />}>
                            Удалить
                        </Button>
                    </Popconfirm>

                    }

                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
            />
        </div>
    );
};



UserTable.propTypes={
    data:PropTypes.array,
    deleteHandle:PropTypes.func
}

export default UserTable;