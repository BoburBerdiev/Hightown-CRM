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
import FormInputNumber from "../../../@crema/core/Form/FormInputNumber";


const initialValueForm = {
    name: "",
    size: null,
    roomCount: null,
    price: null,
    floorId: null,
    florImageId:[],
    homeImageId:[],
    slotId:null,
    houseId:null
};


const ApartmentPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()




    const [fileListPropsFloor, setFileListPropsFloor] = useState([]);
    const [fileListPropsApartment, setFileListPropsApartment] = useState([]);
    const [isUpload, setIsUpload] = useState('');
    const [slotId, setSlotId] = useState(null)
    const [houseId, setHouseId] = useState(null)
    const [editFloorId, setEditImageFloorId] = useState(null)
    const [editImageAparmentId, setEditImageApartmentId] = useState(null)


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
// query-floor-get
    const {data: floorData, refetch: floorFetch} = useQuery(
        'get-floor',
        () => apiService.getData(`/Floor?housId=${houseId}`),
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

    // query-apartment
    const {
        mutate: postApartmentMutate,
        data: postApartment,
        isLoading: postApartmentLoading,
        isSuccess: postApartmentSuccess,
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
        isLoading: editApartmentLoading,
        data: editApartmentData,
        refetch: editApartmentRefetch,
        isSuccess: editApartmentSuccess,

    } = useQuery(["edit-apartment", editId], () => apiService.getDataByID("/Apartment", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putApartment,
        isLoading: putApartmentLoading,
        data: putData,
        isSuccess: putApartmentSuccess
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


    // refetch house
    useEffect(() => {
        if (slotId){
            houseFetch()
        }
    }, [slotId]);

    // refetch floor
    useEffect(() => {
        if (houseId){
            floorFetch()
        }
    }, [houseId]);
    // apartment success
    useEffect(() => {
        if (putApartmentSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postApartmentSuccess || putApartmentSuccess) {
            navigate('/apartment')
        }
    }, [postApartment, putData])

    // if edit apartment
    useEffect(() => {
        if (editId !== "") {
            editApartmentRefetch();
        }
    }, [editId]);

    // if no edit apartment
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
        slotFetch()
    }, []);


    //edit apartment
    useEffect(() => {

        let florImageId = null;
        let homeImageId = null;
        if (editApartmentData !== undefined) {
            florImageId = [{
                    uid: editApartmentData?.floorImage?.id,
                    name: editApartmentData?.floorImage ?.id,
                    status: "done",
                    url: `${process.env.REACT_APP_IMAGE_URL}/${editApartmentData?.floorImage.path}`
                }]
            homeImageId = [{
                uid: editApartmentData?.homeImage?.id,
                name: editApartmentData?.homeImage?.id,
                status: "done",
                url: `${process.env.REACT_APP_IMAGE_URL}/${editApartmentData?.homeImage.path}`
            }]
        }


        if (editApartmentSuccess) {

            const edit = {
                name: editApartmentData?.name,
                size: editApartmentData?.size,
                roomCount: editApartmentData?.roomCount,
                price: editApartmentData?.price,
                floorId: editApartmentData?.floor?.id,
                florImageId,
                homeImageId,
                houseId:editApartmentData?.floor?.house?.id,
                slotId:editApartmentData?.floor?.house?.slot?.id

            }

            setHouseId(editApartmentData?.floor?.house?.id)
            setSlotId(editApartmentData?.floor?.house?.slot?.id)
            setFileListPropsFloor(florImageId)
            setFileListPropsApartment(homeImageId)
            form.setFieldsValue(edit)
        }

    }, [editApartmentData])
    const onFinish = (values) => {



        const data = {
            name: values.name,
            size: values.size,
            roomCount: values.roomCount,
            price: values.price,
            floorId: values.floorId,
            florImageId:fileListPropsFloor[0]?.uid,
            homeImageId:fileListPropsApartment[0]?.uid
        };
        if (editApartmentSuccess) {
            data.status=editApartmentData?.status
            putApartment({url: `/Apartment`, data,id:editId});
        } else {
            postApartmentMutate({url: "/Apartment/", data});
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

        // floor
        if ((putImageSuccess||imagesUploadSuccess) && isUpload==='floor') {
            const uploadImg = [{
                uid: imageData?.id,
                name: imageData?.id,
                status: "done",
                url: `${process.env.REACT_APP_IMAGE_URL}/${imageData?.path}`
            }]
            form.setFieldsValue({florImageId: uploadImg});
            setFileListPropsFloor(uploadImg);
            setIsUpload("")

        }
        // apartment
        if ((putImageSuccess||imagesUploadSuccess) && isUpload==='apartment') {
            const uploadImg = [{
                uid: imageData?.id,
                name: imageData?.id,
                status: "done",
                url: `${process.env.REACT_APP_IMAGE_URL}/${imageData?.path}`
            }]
            form.setFieldsValue({homeImageId: uploadImg});
            setFileListPropsApartment(uploadImg);
            setIsUpload("")


        }
    }, [imagesUpload,putImageData]);

    // floor
    const onChangeImageFloor = ({fileList: newFileList}) => {

        const formData = new FormData();
        if (newFileList.length !== 0) {
            formData.append("fromFile", newFileList[0].originFileObj);
            if (editApartmentSuccess && editFloorId){
                putImage({url: `/Image`, data: formData,id:editFloorId})
            }else{
            imagesUploadMutate({url: "/Image/", formData});
            }
            setIsUpload("floor")

        }

    };

    const handleRemoveImageFloor = (file) => {
        const ids =  file?.uid
        setEditImageFloorId(ids)
        form.setFieldsValue({florImageId: []});
        setFileListPropsFloor([])

    }


    // apartment
    const onChangeImageApartment = ({fileList: newFileList}) => {

        const formData = new FormData();
        if (newFileList.length !== 0) {
            formData.append("fromFile", newFileList[0].originFileObj);
            if (editApartmentSuccess&&editImageAparmentId){
                putImage({url: `/Image`, data: formData,id:editImageAparmentId})
            }else{
            imagesUploadMutate({url: "/Image/", formData});
            }
            setIsUpload("apartment")
        }

    };

    const handleRemoveImageApartment = (file) => {
        const ids =  file?.uid
        setEditImageApartmentId(ids)
        form.setFieldsValue({homeImageId: []});
        setFileListPropsApartment([])

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


    const onChangeSlot=(id)=>{
        form.setFieldsValue({houseId:null,floorId:null})
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
    const onChangeHouse=(id)=>{
        form.setFieldsValue({floorId:null})
        setHouseId(id)
    }

    //option floor
    const optionsFloor = useMemo(() => {
        return floorData?.result?.map((option) => {
            return {
                value: option?.id,
                label: option?.name,
            };
        });
    }, [floorData]);

    return (<div>
        {(postApartmentLoading || editApartmentLoading || putApartmentLoading||imagesUploadLoading||putImageLoading) ? <AppLoader/> :
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
                                onChange={onChangeHouse}
                                options={optionsHouse}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'Выберите этаж'}
                            name={'floorId'}
                            rules={[{
                                required: true, message: 'Вы должны выбрать этаж'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну этаж'
                                optionLabelProp='label'
                                options={optionsFloor}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется квартира'}
                            label={'Название квартира'}
                            name={'name'}
                        />


                    </Col>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Требуется площадь'}
                            label={'Площадь (м²)'}
                            name={'size'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Требуется количество комната'}
                            label={'Количество комната'}
                            name={'roomCount'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Требуется стоимость квартира'}
                            label={'Стоимость квартира ($)'}
                            name={'price'}
                        />
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item
                            label='Фотография с этажа комнаты'
                            name={'florImageId'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            <ImgCrop>
                                <Upload
                                    maxCount={1}
                                    fileList={fileListPropsFloor}
                                    listType='picture-card'
                                    onChange={onChangeImageFloor}
                                    onPreview={onPreview}
                                    onRemove={handleRemoveImageFloor}
                                    beforeUpload={() => false}
                                >
                                    {fileListPropsFloor.length > 0 ? "" : "Upload"}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Изображение комнаты'
                            name={'homeImageId'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            <ImgCrop>
                                <Upload
                                    maxCount={1}
                                    fileList={fileListPropsApartment}
                                    listType='picture-card'
                                    onChange={onChangeImageApartment}
                                    onPreview={onPreview}
                                    onRemove={handleRemoveImageApartment}
                                    beforeUpload={() => false}
                                >
                                    {fileListPropsApartment.length > 0 ? "" : "Upload"}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>
                    </Col>
                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editApartmentSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default ApartmentPostEdit;