import  { memo, useEffect, useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import type { GetRef, TableColumnsType, TableColumnType } from 'antd'
import { Button, Flex, Input, Space, Table, Typography, message } from 'antd'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import { GoDotFill } from 'react-icons/go'
import useNotif from '../Utils/useNotif'
import ModalSettlement from './ModalSettlement'
type InputRef = GetRef<typeof Input>
const { Text , Paragraph} = Typography

function reversMonth (arrDate: string) {
  switch (arrDate) {
    case '01':
      return 'فروردین'
    case '02':
      return 'اردیبهشت'
    case '03':
      return 'خرداد'
    case '04':
      return 'تیر'
    case '05':
      return 'مرداد'
    case '06':
      return 'شهریور'
    case '07':
      return 'مهر'
    case '08':
      return 'ابان'
    case '09':
      return 'اذر'
    case '10':
      return 'دی'
    case '11':
      return 'بهمن'
    case '12':
      return 'اسفند'
    default:
      return 'unValid date'
  }
}
function dateConvertor (date: string) {
  let d: any = date.slice(0, 10)
  let time = date.slice(11, 16)
  let arrDate = d.split('/')
  arrDate.splice(1, 1, reversMonth(arrDate[1]))
  return `${arrDate.reverse().join(' ')}  ${time}`
}
interface DataType {
  amount: number
  trackId: number
  status: number
  paidAt: string
  cardNumber: string
  id: string
}
type DataIndex = keyof DataType

const TableData = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [data, setData] = useState<DataType[]>([])
  const [open, setOpen] = useState(false);
  const [flagFetch, setFlagFetch] = useState(false);
  const searchInput = useRef<InputRef>(null)
  const { openNotif, contextHolderNotification } = useNotif()
  
  function getData () {
    fetch('http://localhost:8585/data')
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response)
        }
        return Promise.reject(new Error(response.statusText))
      })
      .then(response => response.json()) // parses response to JSON
      .then(result => {
        setData(result)
      })
      .catch(error => {
        openNotif(
          'error',
          ' خطایی پیش امده است ',
          'را اجرا کرده باشید  "json-server" توجه داشته باشید   \n برای اطلاعات بیشتر به فایل "توضیحات گیت" مراجعه کنید '
        )
        return null
      })
  }
  useEffect(() => {
    getData()
  }, [flagFetch])


  
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
    }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{ color: filtered ? '#1677ff' : undefined, fontSize: 20 }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase())
  })

  const columns: TableColumnsType<DataType> = [
    {
      title: 'شماره کارت',
      dataIndex: 'cardNumber',
      key: 'id',
      align: 'center',
      ...getColumnSearchProps('cardNumber'),
      render: cardNumber => (
        <Flex gap={10} justify='center'>
          <img
            src={'bank.png'}
            alt='bank logo'
            style={{ width: 20, height: 22 }}
          />
          {cardNumber}
        </Flex>
      )
    },
    {
      title: 'مبلغ',
      dataIndex: 'amount',
      key: 'id',
      align: 'center',
      render: amount => (
        <Flex
          gap={10}
          justify='center'
          align='center'
          style={{
            fontFamily: 'vazir'
          }}
        >
          <img
            src='rial.png'
            alt='rial icon'
            style={{ width: 20, height: 20 }}
          />
          {String(amount).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
        </Flex>
      )
    },
    {
      title: 'تاریخ پرداخت',
      dataIndex: 'paidAt',
      key: 'id',
      align: 'center',
      render: date => (
        <Flex justify='center' style={{ fontFamily: 'vazir', direction: 'rtl' }}>
          {dateConvertor(date)}
        </Flex>
      )
    },
    {
      title: 'وضعیت پرداخت',
      dataIndex: 'status',
      key: 'id',
      align: 'center',
      render: text => (
        <>
          {text === 1 ? (
            <Text>
              پرداخت موفق
              <GoDotFill  color= '#47e31c'  />
            </Text>
          ) : (
            <Text>
              {' '}
              پرداخت ناموفق
              <GoDotFill color= 'red'  />
            </Text>
          )}{' '}
        </>
      )
    },
    {
      title: 'شماره تراکنش',
      dataIndex: 'trackId',
      key: 'trackId',
      align: 'center',
      ...getColumnSearchProps('trackId'),
      render: trackId => <Paragraph copyable dir='rtl'>{trackId}</Paragraph>
    }
  ]

  return (
    <>
      {contextHolderNotification}
      <ModalSettlement open={open} setOpen={setOpen} setFlagFetch={setFlagFetch}/>
      <Table
        scroll={{ y: 600}}
        columns={columns}
        dataSource={data}
        style={{ textAlign: 'center' }}
        rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bgTable')}
        pagination={false}
        footer={data => (
          <>
            <Text  style={{ fontFamily: 'vazir' }}>
              تعداد نتایج : {data.length}
            </Text>
            <Button size='small' type="primary" style={{fontSize:12}} onClick={()=>{setOpen(true)}}>درخواست تسویه</Button>
          </>
        )}
      />
    </>
  )
}

export default memo(TableData)
