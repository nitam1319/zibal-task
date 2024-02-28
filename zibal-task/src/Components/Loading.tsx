import React, { memo } from 'react'
import { Spin, Typography } from 'antd';
const {Text} = Typography
export default memo( function Loading() {

  return (

      <Spin tip={<Text>{'Loading ...'}</Text>} size="large" fullscreen />

  )
})
