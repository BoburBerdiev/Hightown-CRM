import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend ,ResponsiveContainer} from 'recharts';
import { useQuery} from "react-query";
import apiService from "../../../@crema/services/apis/api";
import {message,Typography } from 'antd';
import { useMemo } from 'react';
import {useAuthUser} from "../../../@crema/utility/AuthHooks";
const { Title } = Typography;



const DealersChart = () => {
    const {user}=useAuthUser()
  const {data,isError,isLoading} = useQuery(
      'order-get',
      () => apiService.getData('Apartment/Statistics'),
      {
        onError: (error) => {

          message.error(error);
        },
      },
  );
  const dataOrder = useMemo(() => {
    if (isLoading || isError) {
      return [];
    }



    data.map((item) => {

      item.dateTime=new Date(item.dateTime).toLocaleDateString();
    })

    return data
  }, [data, isLoading, isError]);
    console.log(user)
  return (
      <div>
        <Title type='h2' style={{color:'white'}}>Статистика</Title>
          {
              user.role[1] ?
                  <ResponsiveContainer width="100%" height={300}>
                      <BarChart  data={dataOrder}>
                          <CartesianGrid strokeDasharray="3 6" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="white" />
                      </BarChart>
                  </ResponsiveContainer>
                  :
                  <ResponsiveContainer width="100%" height={300}>
                      <BarChart  data={dataOrder}>
                          <CartesianGrid strokeDasharray="3 6" />
                          <XAxis dataKey="dateTime" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#3D4F51" />
                      </BarChart>
                  </ResponsiveContainer>
          }


      </div>
  )
}

export default DealersChart