import CourseTable from './CourseTable';
import {message,  Space, Spin} from 'antd';
import apiService from '../../../@crema/services/apis/api';
import { useQuery} from 'react-query';

const Index = () => {

  const {
    data,
    isLoading: getLoading,
    refetch,
  } = useQuery('course-get', () => apiService.getDataByID('/Kurs',1), {
    // enabled:false,
    onError: (error) => {
      message.error(error.message);
      // Handle the error
    },
  });









  return (
      <div className={'site-space-compact-wrapper'}>
        <Space direction={'vertical'} style={{width: '100%'}}>
          <Spin
              size='medium'
              spinning={getLoading }>
            <CourseTable
                data={ [data]}
                refetch={refetch}
            />
          </Spin>
        </Space>
      </div>
  );
};

export default Index;
