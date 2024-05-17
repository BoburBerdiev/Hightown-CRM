import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Row, Select, Upload} from "antd";
import {useMutation, useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {AppLoader} from "../../../@crema";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {EDIT_DATA} from "../../../shared/constants/ActionTypes";
import FormInput from "../../../@crema/core/Form/FormInput";
import ImgCrop from "antd-img-crop";


const initialValueForm = {
    name: "",
    slotId: null,
    imageId:[]
};


const HousePostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()




    const [fileListProps, setFileListProps] = useState([]);
    const [editImageId, setEditImageId] = useState(null)




    // query-slot-get
    const {data: slotData, refetch: slotFetch} = useQuery(
        'get-slot',
        () => apiService.getData('/Slot'),
        {
            enabled: false,
        },
    );


    // query-image
    const {
        mutate: imagesUploadMutate,
        data: imagesUpload,
        isLoading: imagesUploadLoading,
        isSuccess: imagesUploadSuccess,
    } = useMutation(({url, formData}) => apiService.postData(url, formData), {

        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response?.data?.errors) {
                message.error(`${obj}: ${error.response?.data?.errors[obj]}`)
            }
        }
    });

    // query-house
    const {
        mutate: postHouseMutate,
        data: postHouse,
        isLoading: postHouseLoading,
        isSuccess: postHouseSuccess,
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
        isLoading: editHouseLoading,
        data: editHouseData,
        refetch: editHouseRefetch,
        isSuccess: editHouseSuccess,

    } = useQuery(["edit-house", editId], () => apiService.getDataByID("/House", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putHouse,
        isLoading: putHouseLoading,
        data: putData,
        isSuccess: putHouseSuccess
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

    const {
        mutate: putImage,
        isLoading: putImageLoading,
        data: putImageData,
        isSuccess: putImageSuccess
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

    // house success
    useEffect(() => {
        if (putHouseSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postHouseSuccess || putHouseSuccess) {
            navigate('/house')
        }
    }, [postHouse, putData])

    // if edit house
    useEffect(() => {
        if (editId !== "") {
            editHouseRefetch();
        }
    }, [editId]);

    // if no edit house
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
        slotFetch()
    }, []);


    //edit house
    useEffect(() => {

        let imageId = null;
        if (editHouseData !== undefined) {
                 imageId = [{
                    uid: editHouseData?.image?.id,
                    name: editHouseData?.image?.id,
                    status: "done",
                    url: `${process.env.REACT_APP_IMAGE_URL}/${editHouseData?.image.path}`
                }]

        }


        if (editHouseSuccess) {

            const edit = {
                name: editHouseData?.name,
                slotId: editHouseData?.slot?.id,
                imageId
            }

            setFileListProps(imageId)
            form.setFieldsValue(edit)
        }

    }, [editHouseData])
    const onFinish = (values) => {



        const data = {
            name: values.name,
            slotId: values.slotId,
            imageId:fileListProps[0]?.uid
        };
        if (editHouseSuccess) {
            putHouse({url: `/House`, data,id:editId});
        } else {
            postHouseMutate({url: "/House/", data});
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

    // image
    useEffect(() => {
        let imageData=putImageSuccess? putImageData:imagesUpload
        if (imagesUploadSuccess||putImageSuccess) {
            const uploadImg = [{
                uid: imageData?.id,
                name: imageData?.id,
                status: "done",
                url: `${process.env.REACT_APP_IMAGE_URL}/${imageData?.path}`
            }]
            form.setFieldsValue({imageId: uploadImg});
            setFileListProps(uploadImg);
        }
    }, [imagesUpload,putImageData]);

    const onChangeImage = ({fileList: newFileList}) => {

        const formData = new FormData();
        if (newFileList.length !== 0) {
            formData.append("fromFile", newFileList[0].originFileObj);
            if (editHouseSuccess && editImageId) {
                putImage({url: `/Image`, data: formData,id:editImageId})
            } else {
                imagesUploadMutate({url: "/Image/", formData});
            }
        }

    };

    const handleRemoveImage = (file) => {
        const ids = file?.uid
        setEditImageId(ids)
        form.setFieldsValue({imageId: []});
        setFileListProps([])

    }


    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };


    // option slot
    const optionsSlot = useMemo(() => {
        return slotData?.result?.map((option) => {
            return {
                value: option?.id,
                label: option?.name,
            };
        });
    }, [slotData]);


    return (<div>
        {(postHouseLoading || editHouseLoading || putHouseLoading || imagesUploadLoading || putImageLoading) ?
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
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >


                <Row gutter={20}>

                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название дом'}
                            label={'Название дом'}
                            name={'name'}
                        />


                    </Col>
                    <Col span={12}>
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
                                options={optionsSlot}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item
                            label='Изображение дома'
                            name={'imageId'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            <ImgCrop>
                                <Upload
                                    maxCount={1}
                                    fileList={fileListProps}
                                    listType='picture-card'
                                    onChange={onChangeImage}
                                    onPreview={onPreview}
                                    onRemove={handleRemoveImage}
                                    beforeUpload={() => false}
                                >
                                    {fileListProps.length > 0 ? "" : "Upload"}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>
                    </Col>
                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editHouseSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default HousePostEdit;