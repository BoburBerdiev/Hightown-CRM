import React, {useEffect, useMemo, useState} from 'react';
import ApartmentTable from './ApartmentTable';
import {Button, Col, Form, Input, message, Row, Select, Space, Spin} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import apiService from '../../../@crema/services/apis/api';
import {useMutation, useQuery} from 'react-query';
import {EDIT_DATA} from '../../../shared/constants/ActionTypes';
import {useDispatch} from 'react-redux';
import {PiBroomFill} from "react-icons/pi";

const Index = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterId, setFilterId] = useState({
    slotId:null,
    houseId:null,
    floorId:null
  })

  // query-slot-get
  const {data: slotData, refetch: slotFetch} = useQuery(
      'get-apartment-slot',
      () => apiService.getData('/Slot'),
      {
        enabled: false,
      },
  );
  // query-house-get
  const {data: houseData, refetch: houseFetch,remove:removeHouse} = useQuery(
      'get-apartment-house',
      () => apiService.getData(`/House?slotId=${filterId?.slotId}`),
      {
        enabled: false,
      },
  );

  // query-floor-get
  const {data: floorData, refetch: floorFetch,remove:removeFloor} = useQuery(
      'get-apartment-floor',
      () => apiService.getData(`/Floor?housId=${filterId?.houseId}`),
      {
        enabled: false,
      },
  );

  // delete apartment
  const {
    mutate,
    isSuccess,
    isLoading: deleteNewsLoading,
  } = useMutation(({url, id}) => apiService.deleteData(url, id),{
    onSuccess: () => {

      message.success('Success')
    },
    onError: (error) => {

      message.error(error.message);
      // Handle the error
    },
  });
  // get apartment
  const {
    data,
    isLoading: getNewsLoading,
    refetch,
  } = useQuery('apartment-get', () => apiService.getData(`/Apartment?${filterId?.slotId ?`&SlotId=${filterId?.slotId}`:""}${filterId?.houseId ?`&HouseId=${filterId?.houseId}`:""}${filterId?.floorId ?`&FlorId=${filterId?.floorId}`:""}`), {
    // enabled:false,
    onError: (error) => {

      message.error(error.message);
      // Handle the error
    },
  });
  const [search, setSearch] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const deleteHandle = (url, id) => {
    mutate({url, id});
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    refetch()
  }, [filterId]);

  // slot fetch
  useEffect(() => {
    slotFetch()
  }, []);
  // refetch house
  useEffect(() => {
    if (filterId?.slotId){
      houseFetch()

    }
  }, [filterId?.slotId]);

  // refetch floor
  useEffect(() => {
    if (filterId?.houseId){
      floorFetch()

    }
  }, [filterId?.houseId]);

  const addArticle = () => {
    dispatch({type: EDIT_DATA, payload: ''});
    navigate('/apartment/add');
  };
  const serachFunc = (value) => {
    if (value === '') {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }

    const filterData = data?.result?.filter(
        (data) =>
            data.name.toLowerCase().includes(value.toLowerCase()));
    setSearch(filterData);
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
    setFilterId({
      slotId: id,
      houseId: null,
      floorId: null
    })
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
    setFilterId(prevState => ({...prevState,houseId:id,floorId: null}))
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
  const onChangeFloor=(id)=>{
    setFilterId(prevState => ({...prevState,floorId:id}))
  }

  // clear filter
  const clearFiler=()=>{
    form.setFieldsValue({slotId:null,houseId:null,floorId:null,status:""})
    setFilterId({
      slotId: null,
      houseId: null,
      floorId: null
    })
    removeHouse()
    removeFloor()
  }

  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} style={{width: '100%'}}>
          <Row gutter={20}>
            <Col span={16}>
              <Input onChange={(e) => serachFunc(e.target.value)} />
            </Col>
            <Col span={8}>
              <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  style={{width: '100%'}}
                  onClick={addArticle}>
                Добавить
              </Button>
            </Col>
          </Row>
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
                autoComplete="off"
            >
              <Row gutter={20}>
                <Col span={8}>
                  <Form.Item
                      label={'Выберите слот'}
                      name={'slotId'}

                      wrapperCol={{
                        span: 24,
                      }}
                  >
                    <Select
                        style={{
                          width: '100%',
                        }}
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
                      wrapperCol={{
                        span: 24,
                      }}
                  >
                    <Select
                        style={{
                          width: '100%',
                        }}
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

                      wrapperCol={{
                        span: 24,
                      }}
                  >
                    <Select
                        style={{
                          width: '100%',
                        }}
                        optionLabelProp='label'
                        options={optionsFloor}
                        onChange={onChangeFloor}
                    />
                  </Form.Item>
                </Col>

              </Row>

            </Form>
          <Row>
            <Col offset={18} span={6}>
              <Button
                  type='dashed'
                  icon={<PiBroomFill />}
                  style={{width: '100%'}}
                  onClick={clearFiler}>
                Очистка фильтра
              </Button>
            </Col>
          </Row>
          <Spin
              size='medium'
              spinning={getNewsLoading || deleteNewsLoading}>
            <ApartmentTable
                data={isSearch ? search : data?.result}
                deleteHandle={deleteHandle}
            />
          </Spin>
        </Space>
      </div>
  );
};

export default Index;
