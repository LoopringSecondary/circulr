import React from 'react';
import {Pagination} from 'antd';

function ListPagination({list, className,props}) {
  let {page = {}, items = []} = list;
  console.log('page',page);
  let handlePageChange = (current, size) => {
    list.pageChange({
      page: {
        current,
        size,
      }
    })
  }
  let paginationProps = {
    className: className,
    total: page.total,
    current: page.current,
    onChange: handlePageChange,
    onShowSizeChange: handlePageChange,
    hideOnSinglePage: true,
    pageSize: Number(page.size) || 10,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '30', '40', '50'], // must be string not number
    // showTotal:true,
    // simple:true,
    ...props
  }

  return (
    <Pagination {...paginationProps}/>
  )

}

export default ListPagination;
