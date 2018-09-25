import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';
import {jobType} from '../../Enum';
import {DragSource} from 'react-dnd';
import {conventEnumValueToString} from '../../utils';

const rowSource = {
    beginDrag(props) {
        return {
            userId: props.data.userId
        };
    }
};

const collect = connect => ({
    connectDragSource: connect.dragSource()
});
class TableRow extends PureComponent {
    render() {
        const {connectDragSource, ...restProps} = this.props;
        const style = {cursor: 'move'};
        return connectDragSource(<tr {...restProps} style={style} />);
    }
}
TableRow.propTypes = {
    connectDragSource: PropTypes.func,
    data: PropTypes.object
};
const BodyRow = DragSource('employee', rowSource, collect)(TableRow);

const compare = (a, b, key, defaultValue) => {
    const v1 = a[key] || defaultValue;
    const v2 = b[key] || defaultValue;
    if(v1 > v2)
        return 1;
    if(v2 > v1)
        return -1;
    return 0;
};

class DraggableTable extends PureComponent {
  components = {
      body: {
          row: BodyRow
      }
  };
  render() {
      const {getString} = this.props;
      const columns = [
          {
              title: getString('JOB'),
              dataIndex: 'job',
              render: text => conventEnumValueToString(jobType, text),
              sorter: (a, b) => compare(a, b, 'job', 0)
          },
          {
              title: getString('USERNAME'),
              dataIndex: 'username',
              sorter: (a, b) => compare(a, b, 'username', '')
          },
          {
              title: getString('NAME'),
              dataIndex: 'name',
              sorter: (a, b) => compare(a, b, 'name', '')
          },
          {
              title: getString('DEALER_NAME'),
              dataIndex: 'dealerName',
              sorter: (a, b) => compare(a, b, 'dealerName', '')
          }
      ];
      const {employees, relations} = this.props;
      const data = employees.filter(e => !relations.some(r => r.userId === e.userId));
      return (
          <Table
              rowKey="userId"
              columns={columns}
              size="small"
              bordered
              onRow={record => ({
                  data: record
              })}
              dataSource={data}
              components={this.components}/>
      );
  }
}

DraggableTable.propTypes = {
    getString: PropTypes.func.isRequired,
    employees: PropTypes.array,
    relations: PropTypes.array
};

import {connect} from 'react-redux';
import {selectorFactory} from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from '../localize';

const getEmployeeInfo = selectorFactory(['page', 'domainData', 'employeeAndRelation', 'data', 'employees']);
const getRelationInfo = selectorFactory(['page', 'appState', 'relations']);
const mapStateToProps = state => ({
    employees: getEmployeeInfo(state),
    relations: getRelationInfo(state)
});
export default connect(mapStateToProps, null)(localize(DraggableTable));
