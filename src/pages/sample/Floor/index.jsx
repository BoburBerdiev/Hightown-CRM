import React, {useEffect, useMemo, useState} from 'react';
import FloorTable from './FloorTable';
import {Button, Col, Form, Input, message, Row, Select, Space, Spin} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import apiService from '../../../@crema/services/apis/api';
import {useMutation, useQuery} from 'react-query';
import {EDIT_DATA} from '../../../shared/constants/ActionTypes';
import {useDispatch} from 'react-redux';

const Index = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterId, setFilterId] = useState({
    slotId:null,
    houseId:null,
  })




  // query-slot-get
  const {data: slotData, refetch: slotFetch} = useQuery(
      'get-floor-slot',
      () => apiService.getData('/Slot'),
      {
        enabled: false,
      },
  );
  // query-house-get
  const {data: houseData, refetch: houseFetch} = useQuery(
      'get-floor-house',
      () => apiService.getData(`/House?slotId=${filterId?.slotId}`),
      {
        enabled: false,
      },
  );




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
  const {
    data,
    isLoading: getNewsLoading,
    refetch,
  } = useQuery('floor-get', () => apiService.getData(`Floor?${filterId?.slotId ?`&SlotId=${filterId?.slotId}`:""}${filterId?.houseId ?`&housId=${filterId?.houseId}`:""}`), {
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
    slotFetch()
  }, []);

  // refetch house
  useEffect(() => {
    if (filterId?.slotId){
      houseFetch()

    }
  }, [filterId?.slotId]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    refetch()
  }, [filterId]);

  const addArticle = () => {
    dispatch({type: EDIT_DATA, payload: ''});
    navigate('/floor/add');
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
    form.setFieldsValue({houseId:null})
    setFilterId({
      slotId: id,
      houseId: null,
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
    setFilterId(prevState => ({...prevState,houseId:id}))
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
              <Col span={6}>
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
                      placeholder={'Поиск по слотам'}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
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
                      placeholder={'Поиск по домам'}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Spin
              size='medium'
              spinning={getNewsLoading || deleteNewsLoading}>
            <FloorTable
                data={isSearch ? search : data?.result}
                deleteHandle={deleteHandle}
            />
          </Spin>
        </Space>
      </div>
  );
};

export default Index;
