import React, {useEffect, useMemo} from 'react';
import {Button, Col, Form, message, Row, Select} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";
import FormInputNumber from "../../../@crema/core/Form/FormInputNumber";


const initialValueForm = {
    name: "",
    discount: null,
    fristPay: null,
    activate: true,
    monthCount: null
};


const PaymentPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()








    // query-payment
    const {
        mutate: postPaymentMutate,
        data: postPayment,
        isLoading: postPaymentLoading,
        isSuccess: postPaymentSuccess,
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
        isLoading: editPaymentLoading,
        data: editPaymentData,
        refetch: editPaymentRefetch,
        isSuccess: editPaymentSuccess,

    } = useQuery(["edit-payment", editId], () => apiService.getDataByID("/PaymentMetod", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putPayment,
        isLoading: putPaymentLoading,
        data: putData,
        isSuccess: putPaymentSuccess
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



    // payment success
    useEffect(() => {
        if (putPaymentSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postPaymentSuccess || putPaymentSuccess) {
            navigate('/payment')
        }
    }, [postPayment, putData])

    // if edit payment
    useEffect(() => {
        if (editId !== "") {
            editPaymentRefetch();
        }
    }, [editId]);

    // if no edit payment
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit payment
    useEffect(() => {

        if (editPaymentSuccess) {

            const edit = {
                name: editPaymentData?.name,
                discount:editPaymentData?.discount,
                fristPay: editPaymentData?.fristPay,
                activate: editPaymentData?.activate,
                monthCount: editPaymentData?.monthCount,
            }

            form.setFieldsValue(edit)
        }

    }, [editPaymentData])
    const onFinish = (values) => {



        // const data = {
        //     name: values.name,
        //     houseId: values.houseId,
        //
        // };
        if (editPaymentSuccess) {
            putPayment({url: `/PaymentMetod`, data:values,id:editId});
        } else {
            postPaymentMutate({url: "/PaymentMetod/", data:values});
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
    return (<div>
        {(postPaymentLoading || editPaymentLoading || putPaymentLoading) ? <AppLoader/> :
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
                            required_text={'Требуется имя способа оплаты'}
                            label={'Название способа оплаты'}
                            name={'name'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Требуется скидка'}
                            label={'Скидка'}
                            name={'discount'}
                        />
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Требуется первоначальный взнос'}
                            label={'Первоначальный взнос'}
                            name={'fristPay'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Требуется количество месяцев'}
                            label={'Количество месяцев'}
                            name={'monthCount'}
                        />
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={'Он активирован?'}
                            name={'activate'}
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



                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editPaymentSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default PaymentPostEdit;