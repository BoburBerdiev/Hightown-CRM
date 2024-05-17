import {Button, Popconfirm, Space, Table, Image, Tag} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";

const ApartmentTable = ({data,deleteHandle}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const Delete = async (id) => {
        deleteHandle('/Apartment',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/apartment/add')
    };
    const columns = [
        {
            title: 'Квартира',
            dataIndex: 'name',
            id: 'name',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Площадь',
            dataIndex: 'size',
            id: 'size',
            render: (text) => <p>{text}м²</p>,
        },
        {
            title: 'Количество ',
            dataIndex: 'roomCount',
            id: 'roomCount',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Стоимость',
            dataIndex: 'price',
            id: 'price',
            render: (text) => <p>{text}$</p>,
        },
        {
            title: 'Состояние',
            dataIndex: 'status',
            id: 'status',
            render: (text) => <Tag color={text===1?"#008000":text===2 ?"#f5c306" :"#ff0000"}>{text===1?"Доступно":text===2 ?"Занято" :"Продано"}</Tag>,
        },
        {
            title: 'Изображение',
            dataIndex: 'homeImage',
            id: 'homeImage',
            render: (image) => {
                return (
                    <Image
                        width={50}

                        src={`${process.env.REACT_APP_IMAGE_URL}/${image?.path}`}
                    />
                )},
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
                    <Popconfirm
                        title={'Are you sure to delete this task?'}
                        description={'Delete the task '}
                        onConfirm={() => Delete(record.id)}>
                        <Button type='danger' icon={<DeleteOutlined />}>
                            Удалить
                        </Button>
                    </Popconfirm>
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



ApartmentTable.propTypes={
    data:PropTypes.array,
    deleteHandle:PropTypes.func
}

export default ApartmentTable;