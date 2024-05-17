import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Row, Select} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";


const initialValueForm = {
    name: "",
    houseId: null,
};


const FloorPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    const [slotId, setSlotId] = useState(null)


    // query-slot-get
    const {data: slotData, refetch: slotFetch} = useQuery(
        'get-slot',
        () => apiService.getData('/Slot'),
        {
            enabled: false,
        },
    );

    // query-house-get
    const {data: houseData, refetch: houseFetch} = useQuery(
        'get-house',
        () => apiService.getData(`/House?slotId=${slotId}`),
        {
            enabled: false,
        },
    );



    // query-floor
    const {
        mutate: postFloorMutate,
        data: postFloor,
        isLoading: postFloorLoading,
        isSuccess: postFloorSuccess,
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
        isLoading: editFloorLoading,
        data: editFloorData,
        refetch: editFloorRefetch,
        isSuccess: editFloorSuccess,

    } = useQuery(["edit-floor", editId], () => apiService.getDataByID("/Floor", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putFloor,
        isLoading: putFloorLoading,
        data: putData,
        isSuccess: putFloorSuccess
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

    // refetch house
    useEffect(() => {
        if (slotId){
            houseFetch()
        }
    }, [slotId]);

    // floor success
    useEffect(() => {
        if (putFloorSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postFloorSuccess || putFloorSuccess) {
            navigate('/floor')
        }
    }, [postFloor, putData])

    // if edit floor
    useEffect(() => {
        if (editId !== "") {
            editFloorRefetch();
        }
    }, [editId]);

    // if no edit floor
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
        slotFetch()
    }, []);


    //edit floor
    useEffect(() => {

        if (editFloorSuccess) {

            const edit = {
                name: editFloorData?.name,
                slotId:editFloorData?.house?.slot?.id,
                houseId: editFloorData?.house?.id,
            }

            setSlotId(editFloorData?.house?.slot?.id)
            form.setFieldsValue(edit)
        }

    }, [editFloorData])
    const onFinish = (values) => {



        const data = {
            name: values.name,
            houseId: values.houseId,

        };
        if (editFloorSuccess) {
            putFloor({url: "/Floor", data, id: editId});
        } else {
            postFloorMutate({url: "/Floor/", data});
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




    // option slot
    const optionsSlot = useMemo(() => {
        return slotData?.result?.map((option) => {
            return {
                value: option?.id,
                label: option?.name,
            };
        });
    }, [slotData]);


    const onChangeSlot=(id)=>{
        form.setFieldsValue({houseId:""})
        setSlotId(id)
    }
// option house
    const optionsHouse = useMemo(() => {
        return houseData?.result?.map((option) => {
            return {
                value: option?.id,
                label: option?.name,
            };
        });
    }, [houseData]);
    return (<div>
        {(postFloorLoading || editFloorLoading || putFloorLoading) ? <AppLoader/> :
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


                    <Col span={8}>
                        <Form.Item
                            label={'Выберите слот'}
                            name={'slotId'}
                            rules={[{
                                required: true, message: 'Вы должны выбрать слот'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну слот'
                                optionLabelProp='label'
                                onChange={onChangeSlot}
                                options={optionsSlot}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Выберите дом'}
                            name={'houseId'}
                            rules={[{
                                required: true, message: 'Вы должны выбрать дом'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну дом'
                                optionLabelProp='label'
                                options={optionsHouse}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название этаж'}
                            label={'Название этаж'}
                            name={'name'}
                        />


                    </Col>
                </Row>




                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editFloorSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default FloorPostEdit;