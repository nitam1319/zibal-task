import React, { memo, useState } from 'react'
import {
  Button,
  Divider,
  Form,
  Input,
  Flex,
  Select,
  Space,
  Typography,
  Radio,
  notification,
  InputNumber
} from 'antd'
import useNotif from '../Utils/useNotif'
const { Text, Title } = Typography

const optionCardName = [
  {
    value: '585983******8891',
    label: 'Ali'
  },
  {
    value: '685983******8893',
    label: 'Hoseen'
  },
  {
    value: '785983******8893',
    label: 'Mohamad'
  },
  {
    value: '885983******8894',
    label: 'Sara'
  }
]
const optionCardNum = [
  {
    value: '585983******8891',
    label: '5598 3111 1118 8911'
  },
  {
    value: '685983******8893',
    label: '6859 8322 2222 8892'
  },
  {
    value: '785983******8893',
    label: '7859 8333 3333 8893'
  },
  {
    value: '885983******8894',
    label: '8859 8344 4444 8894'
  }
]
const Settlement = ({
  setOpen,
  setFlagFetch
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setFlagFetch:React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [loading, setLoading] = useState(false)
  const [isCardName, setIsCardName] = useState(false)
  const { openNotif, contextHolderNotification } = useNotif()
  const [form] = Form.useForm();
  const onKeyPress = (e: React.KeyboardEvent) => {
    const specialCharRegex = new RegExp('^[0-9]*$')
    if (!specialCharRegex.test(e.key)) {
      if (e.key === 'Backspace') {
        return undefined
      } else {
        e.preventDefault()
        return false
      }
    }
  }

  const onFinish = async (values: any) => {
    if (+values.amount <= 150000 && +values.amount>0 ) {
      setLoading(true)
      await fetch('http://localhost:8585/data', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: +values.amount,
          trackId: Math.round(Math.random() * 1e9),
          status: 1,
          paidAt: '1399/09/22-10:53:50',
          cardNumber: values.cardNumber
        })
      })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
          }

          return Promise.reject(new Error(response.statusText))
        })
        .then(result => {
          setLoading(false)
          setOpen(false)
          setFlagFetch(flag=>!flag)
          openNotif(
            'success',
            'تراکنش موفق',
            'درخواست پرداخت با موفقیت انجام شد'
          )
        })
        .catch(error => {
          setLoading(false)
          setOpen(false)
          openNotif(
            'error',
            'تراکنش ناموفق',
            'درخواست پرداخت با خطا رو به رو شده است'
          )
          return null
        })
    } else {
        if(+values.amount>0 ){

            openNotif(
              'warning',
              'تراکنش ناموفق',
              'درخواست پرداخت به علت کافی نبودن موجودی قابل انجام نمیباشد'
            )
        }else{
            openNotif(
                'warning',
                'تراکنش ناموفق',
                'درخواست پرداخت به علت معتبر نبودن مبلغ قابل انجام نمیباشد'
              )
        }
    }
  }

  const [api, contextHolder] = notification.useNotification()

  const openNotification = (value: any) => {
    const btn = (
      <Space>
        <Button type='link' size='small' onClick={() => api.destroy()}>
          خبر
        </Button>
        <Button
          type='primary'
          size='small'
          onClick={() => {
            api.destroy()
            onFinish(value)
          }}
        >
          بله
        </Button>
      </Space>
    )
    api.open({
      message: 'تایید تراکنش',
      description: ' ایا ثبت درخواست تسویه را تایید میکنید ',
      btn
    })
  }
  return (
    <>
      {contextHolderNotification}
      {contextHolder}
      <Space direction='vertical' style={{ width: '100%' }}>
        <Space direction='vertical'>
          <Text type='secondary'> موجودی فعلی:</Text>
          <Title level={3} style={{ fontFamily: 'vazir', color: 'blue' }}>
            {' '}
            150,000 <Text style={{ fontSize: 10, color: 'blue' }}>ریال</Text>
          </Title>
        </Space>
        <Divider />
        <Form
        form={form}
          layout='vertical'
          name='nest-messages'
          onFinish={value => {
            openNotification(value)
          }}
          style={{ maxWidth: 600 }}
        >
          <Radio.Group
            defaultValue={isCardName}
            onChange={e => {
              setIsCardName(e.target.value)
            }}
            buttonStyle='solid'
          >
            <Radio.Button value={false}>به حساب</Radio.Button>
            <Radio.Button value={true}>به کیف پول</Radio.Button>
          </Radio.Group>
          <Form.Item
            name={['cardNumber']}
            label='مقصد تسویه'
            rules={[{ required: true, message: 'پر کردن این فیلد اجباری است' }]}
          >
            <Select
              showSearch
              placeholder={
                isCardName ? ' انتخاب نام مالک کیف پول ' : 'انتخاب شماره کارت'
              }
              optionFilterProp='children'
              filterOption={(input, option) =>
                (option?.label ?? '').includes(input)
              }
              filterSort={(optionA, optionB) => {
                if (isCardName) {
                  return (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare(optionB?.label ?? '')
                } else {
                  return +(optionA?.label ?? '') - +(optionB?.label ?? '')
                }
              }}
              options={isCardName ? optionCardName : optionCardNum}
            />
          </Form.Item>
          <Form.Item
            name={['amount']}
            label='مبلغ تسویه'
            rules={[{ required: true, message: 'پر کردن این فیلد اجباری است' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              controls={false}
              formatter={value =>
                ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              onKeyDown={onKeyPress}
              suffix={<Text disabled>ریال</Text>}
            />
          </Form.Item>
          <Form.Item name={['age']} label='توضیحات (بابت)'>
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
          <Divider />
          <Flex gap={10} dir='ltr'>
            <Button type='primary' htmlType='submit' loading={loading}>
              ثبت درخواست تسویه
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setOpen(false)
              }}
            >
              انصراف
            </Button>
          </Flex>
        </Form>
      </Space>
    </>
  )
}

export default memo(Settlement)
