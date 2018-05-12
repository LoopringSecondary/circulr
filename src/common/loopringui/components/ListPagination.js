import React from 'react';
import { Pagination} from 'antd';

function ListPagination({list,className}){
  let {page={},items=[]} = list;
  let handlePageChange = (current,size) => {
    list.pageChange({
      page:{
        current,
        size,
      }
    })
  }
  let showTotal = (total, range) => {
    // range = [start,end];
    return `共 ${total} 条记录，当前第 ${range[0]}-${range[1]} 条`;
  }
  let paginationProps = {
     className:className,
     total:page.total,
     current:page.current,
     onChange:handlePageChange,
     onShowSizeChange:handlePageChange,
     pageSize:Number(page.size)||10,
     showSizeChanger:true,
     showQuickJumper:true,
     pageSizeOptions:['10','20','30','40','50'], // must be string not number
     // showTotal:true,
     // simple:true,
  }
  if((items.length>0 && page.total/page.size >= 1) || page.size > 10){
    return (
      <Pagination {...paginationProps}/>
    )
  }else{
    return null
  }
}

export default ListPagination;
