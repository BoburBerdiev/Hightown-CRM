    import React, {useEffect,  useState} from 'react';
import {Button, Col, Form, message, Row,  Upload} from "antd";
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
    fulName: "",
    phoneNumber: "",
    userName: "",
    password: "",
    imageId:[]
};


const UserPostEdit = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()




    const [fileListProps, setFileListProps] = useState([]);
    const [editImageId, setEditImageId] = useState(null)



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

    // query-user
    const {
        mutate: postUserMutate,
        data: postUser,
        isLoading: postUserLoading,
        isSuccess: postUserSuccess,
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
        isLoading: editUserLoading,
        data: editUserData,
        refetch: editUserRefetch,
        isSuccess: editUserSuccess,

    } = useQuery(["edit-user", editId], () => apiService.getDataByID("/User", editId), {
        enabled: false
    });
    // put-query
    const {
        mutate: putUser,
        isLoading: putUserLoading,
        data: putData,
        isSuccess: putUserSuccess
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

    // user success
    useEffect(() => {
        if (putUserSuccess) {
            dispatch({type: EDIT_DATA, payload: ""})
        }
        if (postUserSuccess || putUserSuccess) {
            navigate('/user')
        }
    }, [postUser, putData])

    // if edit user
    useEffect(() => {
        if (editId !== "") {
            editUserRefetch();
        }
    }, [editId]);

    // if no edit user
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit user
    useEffect(() => {

        let imageId = null;
        if (editUserData !== undefined) {
                 imageId = [{
                    uid: editUserData?.image?.id,
                    name: editUserData?.image?.id,
                    status: "done",
                    url: `${process.env.REACT_APP_IMAGE_URL}/${editUserData?.image.path}`
                }]

        }


        if (editUserSuccess) {

            const edit = {
                name: editUserData?.name,
                userName: editUserData?.userName,
                password: editUserData?.password,
                phoneNumber: editUserData?.phoneNumber,
                fulName: editUserData?.fulName,
                imageId
            }

            setFileListProps(imageId)
            form.setFieldsValue(edit)
        }

    }, [editUserData])
    const onFinish = (values) => {



        const data = {
            userName: values.userName,
            password: values.password,
            phoneNumber: values.phoneNumber,
            fulName: values.fulName,
            imageId:fileListProps[0] ? fileListProps[0]?.uid :1
        };
        if (editUserSuccess) {
            putUser({url: `/User`, data,id:editId});
        } else {
            postUserMutate({url: "/User/", data});
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
            if (editUserSuccess&& editImageId!==1){
                putImage({url: `/Image`, data: formData,id:editImageId})

            }else{
            imagesUploadMutate({url: "/Image/", formData});

            }
        }

    };

    const handleRemoveImage = (file) => {
        const ids =  file?.uid
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





    return (<div>
        {(postUserLoading || editUserLoading || putUserLoading||imagesUploadLoading||putImageLoading) ? <AppLoader/> :
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
                            required_text={'Требуется полное ФИО'}
                            label={'Полное ФИО'}
                            name={'fulName'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Требуется номер телефона'}
                            label={'Номер телефона'}
                            name={'phoneNumber'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется login'}
                            label={'Login'}
                            name={'userName'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется пароль'}
                            label={'Пароль'}
                            name={'password'}
                        />
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item
                            label='Изображение пользователя'
                            name={'imageId'}>
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
                    {editUserSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default UserPostEdit;