import {Button, Col, Form, message, Modal, Popconfirm, Row, Select, Space, Table} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import {useNavigate} from "react-router-dom";
import {AppLoader} from "../../../@crema";
import React, {useEffect, useMemo, useState} from "react";
import {useMutation} from "react-query";
import apiService from "../../../@crema/services/apis/api";

const initialValueForm = {
    activate: null,
};


const PaymentTable = ({data,deleteHandle,refetch}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null)


    const {
        mutate: editStatusMutate,
        data: editStatus,
        isLoading: editStatusLoading,
        isSuccess: editStatusSuccess,
    } = useMutation(({url, data, id}) => apiService.editData(url, data, id), {
        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });
    const Delete = async (id) => {
        deleteHandle('/PaymentMetod',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch({type:EDIT_DATA,payload:id})
        navigate('/payment/add')
    };


    const EditStatus = (id) => {
        setIsModalOpen(true)
        setEditId(id)
    };


    const onFinish = (values) => {
        editStatusMutate({url: "/PaymentMetod/status", data: values, id: editId});
    }
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onFinish(values);
            })
            .catch((errorInfo) => {
                console.log('Failed:', errorInfo);
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (editStatusSuccess) {
            setIsModalOpen(false)
            form.setFieldsValue(initialValueForm)
            refetch()
        }
    }, [editStatus]);


    // option status
    const optionsStatus = useMemo(() => {
        return [{
            value: true,
            label: 'Активный',
        },
            {
                value: false,
                label: 'Нет активного',
            }
        ];
    }, []);


    // table columns
    const columns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            id: 'name',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Скидка',
            dataIndex: 'discount',
            id: 'discount',
            render: (text) => <p>{text}%</p>,
        },
        {
            title: 'Первый взнос',
            dataIndex: 'fristPay',
            id: 'fristPay',
            render: (text) => <p>{text}%</p>,
        },
        {
            title: 'Количество месяцев',
            dataIndex: 'monthCount',
            id: 'monthCount',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Количество месяцев',
            dataIndex: 'activate',
            id: 'activate',
            render: (text,record) =>(
                    <Button
                        onClick={() => EditStatus(record.id)}
                        type={text ? "primary": 'danger'}
                        icon={<EditOutlined />
                    }
                    >
                {text ? 'Active' : 'No active'}
                    </Button>
                )

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
            <Modal title="Изменить активный" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {(editStatusLoading) ?
                    <AppLoader/> :
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{
                            span: 24
                        }}
                        wrapperCol={{
                            span: 24
                        }}
                        style={{
                            maxWidth: "100%"
                        }}
                        initialValues={initialValueForm}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={20}>
                            <Col span={24}>
                                <Form.Item
                                    label={'Он активирован?'}
                                    name={'status'}
                                    rules={[{
                                        required: true, message: 'Вы должны выбрать состояние'
                                    }]}
                                    wrapperCol={{
                                        span: 24,
                                    }}
                                >
                                    <Select
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder='Выберите одну состояние'
                                        optionLabelProp='label'
                                        options={optionsStatus}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>


                    </Form>
                }
            </Modal>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
            />
        </div>
    );
};



PaymentTable.propTypes={
    data:PropTypes.array,
    deleteHandle:PropTypes.func,
    refetch:PropTypes.func
}

export default PaymentTable;