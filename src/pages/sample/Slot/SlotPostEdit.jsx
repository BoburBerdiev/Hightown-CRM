import React, {useEffect} from 'react';
import {Button, Col, DatePicker, Form, message, Row} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";
import moment from "moment";


const initialValueForm = {
    name: "",
    finishedDate: "",

};


const SlotPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()





    // query-slot
    const {
        mutate: postSlotMutate,
        data: postSlot,
        isLoading: postSlotLoading,
        isSuccess: postSlotSuccess,
    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj]}`)
            }
        }
    });

    // query-edit
    const {
        isLoading: editSlotLoading,
        data: editSlotData,
        refetch: editSlotRefetch,
        isSuccess: editSlotSuccess,

    } = useQuery(["edit-slot", editId], () => apiService.getDataByID("/Slot", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putSlot,
        isLoading: putSlotLoading,
        data: putData,
        isSuccess: putSlotSuccess
    } = useMutation(({
                         url, data, id
                     }) => apiService.editData(url, data, id), {
        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj]}`)
            }
        }
    });


    //                                              =====useEffect====

    // slot success
    useEffect(() => {
        if (putSlotSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postSlotSuccess || putSlotSuccess) {
            navigate('/slot')
        }
    }, [postSlot, putData])

    // if edit slot
    useEffect(() => {
        if (editId !== "") {
            editSlotRefetch();
        }
    }, [editId]);

    // if no edit slot
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }

    }, []);


    //edit slot
    useEffect(() => {


        if (editSlotSuccess) {

            const edit = {
                name: editSlotData?.name,
                finishedDate: moment(editSlotData?.finishedDate),
            }

            form.setFieldsValue(edit)
        }

    }, [editSlotData])
    const onFinish = (values) => {


        const data = {
            name: values.name,
            finishedDate: values.finishedDate,

        };
        if (editSlotSuccess) {
            putSlot({url: "/Slot", data, id: editId});
        } else {
            postSlotMutate({url: "/Slot/", data});
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    // refresh page again get data

    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            storedValues.images = []
            form.setFieldsValue(storedValues);
        }

        const handleBeforeUnload = () => {

            localStorage.setItem('myFormValues', JSON.stringify(form.getFieldsValue()),);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);





    return (<div>
        {(postSlotLoading || editSlotLoading || putSlotLoading) ? <AppLoader/> :
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
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >


                <Row gutter={20}>

                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название лота'}
                            label={'Название лота'}
                            name={'name'}
                        />


                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Время окончания"
                            name={'finishedDate'}
                            rules={[{
                                required: true, message: 'Укажите время окончания.'
                            }]}
                        >
                            <DatePicker />
                        </Form.Item>

                    </Col>
                </Row>



                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editSlotSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default SlotPostEdit;