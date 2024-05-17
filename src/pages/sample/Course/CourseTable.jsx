import {Button, Col, Form, message, Modal, Row,  Space, Table} from "antd";
import {EditOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {AppLoader} from "../../../@crema";
import React, {useEffect,  useState} from "react";
import apiService from "../../../@crema/services/apis/api";
import {useMutation} from "react-query";
import FormInput from "../../../@crema/core/Form/FormInput";
import moment from "moment";

const initialValueForm = {
    title_uz: "",
    title_ru: "",
    sub_category: [],
};

const CourseTable = ({data, refetch}) => {
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

    const Edit = (id) => {
        setIsModalOpen(true)
        setEditId(id)
    };


    const onFinish = (values) => {
        editStatusMutate({url: "/Kurs", data: values, id: editId});
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




    const columns = [
        {
            title: 'Цена',
            dataIndex: 'price',
            id: 'price',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Событие',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record.id)}
                        type='primary'
                        icon={<EditOutlined/>}>
                        Изменить курс
                    </Button>

                </Space>
            ),
        },
        {
            title: 'Последнее изменение',
            dataIndex: 'updateTime',
            id: 'updateTime',
            render: (text) => <p>{moment(text).format("DD.MM.YYYY")}</p>,
        },
    ];

    return (
        <div>
            <Modal title="Изменить курс" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                                <FormInput
                                    required={true}
                                    required_text={'Требуется курс'}
                                    label={'Курс'}
                                    name={'price'}
                                />
                            </Col>
                        </Row>


                    </Form>
                }
            </Modal>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record?.id}
            />
        </div>
    );
};

CourseTable.propTypes = {
    data: PropTypes.array,
    refetch: PropTypes.func
}

export default CourseTable;