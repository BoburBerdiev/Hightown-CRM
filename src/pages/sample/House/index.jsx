import React, {useEffect, useMemo, useState} from 'react';
import HouseTable from './HouseTable';
import {Button, Col,  Input, message, Row, Select, Space, Spin} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import apiService from '../../../@crema/services/apis/api';
import {useMutation, useQuery} from 'react-query';
import {EDIT_DATA} from '../../../shared/constants/ActionTypes';
import {useDispatch} from 'react-redux';

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [slotId, setSlotId] = useState(null)

  // query-slot-get
  const {data: slotData, refetch: slotFetch} = useQuery(
      'get-slot',
      () => apiService.getData('/Slot'),
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
  } = useQuery('house-get', () => apiService.getData(`/House${slotId ? `?slotId=${slotId}`:""}`), {
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

  // slot fetch
  useEffect(() => {
    slotFetch()
  }, []);


  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (slotId){
      refetch();
    }
  }, [slotId]);

  const addArticle = () => {
    dispatch({type: EDIT_DATA, payload: ''});
    navigate('/house/add');
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
    setSlotId(id)
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
            <Col span={10}>

              <Select
                  style={{
                    width: '100%',
                  }}
                  optionLabelProp='label'
                  onChange={onChangeSlot}
                  options={optionsSlot}
                  placeholder={"Поиск по слотам"}
              />
            </Col>
          </Row>
          <Spin
              size='medium'
              spinning={getNewsLoading || deleteNewsLoading}>
            <HouseTable
                data={isSearch ? search : data?.result}
                deleteHandle={deleteHandle}
            />
          </Spin>
        </Space>
      </div>
  );
};

export default Index;
