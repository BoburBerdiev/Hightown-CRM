import {Tag, Table,message,Spin} from 'antd';
import apiService from "../../../@crema/services/apis/api";
import { useQuery} from "react-query";
import moment from 'moment'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    render: (text) => <Tag>{text}</Tag>,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'All Price',
    dataIndex: 'total_price',
    key: 'total_price',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => <p>{moment(text).format('DD.MM.YYYY')}</p>,
  },
];

const columnsOrders = [
  {
    title: 'Product Name',
    dataIndex: 'title',
    key: 'title',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Product Count',
    dataIndex: 'count',
    key: 'count',
    render: (text) => <Tag>{text}</Tag>,
  },
  {
    title: 'Product Price',
    dataIndex: 'price',
    key: 'price',
    render: (text) => <p>{text}</p>,
  },

];

const Orders = () => {
  const {data, isLoading} = useQuery(
      'order-get',
      () => apiService.getData('/order-list'),
      {
        // enabled:false,
        onError: (error) => {
          const err=[]

          for (const property in error?.response?.data?.errors){
            err.push(error?.response?.data?.errors[property])

          }


          message.error(err[0][0]);
          // Handle the error
        },
      },
  );


  return (
      <div>
        <Spin size='medium' spinning={isLoading}>
          <Table
              columns={columns}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                      <Table
                          columns={columnsOrders}
                          dataSource={record?.order}
                          rowKey={(order) => order.id}
                      />
                  );
                },
              }}
              dataSource={data}
              rowKey={(record) => record?.id}
          />
        </Spin>
      </div>
  );
};

export default Orders;