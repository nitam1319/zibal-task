import React, { memo } from 'react';
import {  Divider, Flex, Modal,Typography } from 'antd';
import Settlement from './Settlement';
const {Text  } = Typography;
const ModalSettlement = ({open , setOpen , setFlagFetch}:{open:boolean , setOpen:React.Dispatch<React.SetStateAction<boolean>> ,setFlagFetch:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    
      <Modal
        style={{direction:'rtl'}}
        title={<><Flex gap={10}><Text strong>تسویه کیف پول</Text><Text type="secondary">اصلی زیب</Text></Flex><Divider/></>}
        open={open}
        onCancel={handleCancel}
        footer={false}
      >
        <Settlement setOpen={setOpen} setFlagFetch={setFlagFetch} />
      </Modal>
    
  );
};

export default memo(ModalSettlement);