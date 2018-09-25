import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Tree, Icon} from 'antd';
import {DropTarget} from 'react-dnd';
import styles from './style.css';
const emptyGuid = '00000000-0000-0000-0000-000000000000';
const TreeNode = Tree.TreeNode;
const treeNodeTarget = {
    drop(props, monitor) {
        const userId = monitor.getItem().userId;
        props.onAdd(userId, props.data.userId);
    }
};

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
});

class CustomerTreeNode extends PureComponent {
    state = {};
    onClickDeleteIcon = () => {
        this.props.onDelete(this.props.data.userId);
    };
    onMouseEnter = () => {
        if(!this.props.isOver)
            this.setState({
                hover: true
            });
    };
    onMouseLeave = () => {
        if(!this.props.isOver)
            this.setState({
                hover: false
            });
    };

    render() {
        const {isOver, connectDropTarget, data, ...rest} = this.props;
        let className = '';
        if(isOver) className = styles.hover;
        return connectDropTarget(
            <div className={className} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                {data.name}
                {data.username && '-'}
                {data.username}
                {this.state.hover && <Icon type="delete" className={styles.delete_icon} onClick={this.onClickDeleteIcon} />}
            </div>
        );
    }
}

CustomerTreeNode.propTypes = {
    connectDropTarget: PropTypes.func,
    data: PropTypes.object,
    isOver: PropTypes.bool,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func
};
const DropTargetNode = DropTarget('employee', treeNodeTarget, collect)(CustomerTreeNode);

class DraggableTree extends PureComponent {
    listToTree = arr => {
        const tree = [];
        const mappedArr = {}; // First map the nodes of the array to an object -> create a hash table.

        for(let i = 0, len = arr.length; i < len; i++) {
            const arrElem = arr[i];
            mappedArr[arrElem.userId] = arrElem;
            mappedArr[arrElem.userId].children = [];
        }

        for(const id in mappedArr)
            if(mappedArr.hasOwnProperty(id)) {
                const mappedElem = mappedArr[id];
                /* eslint-disable eqeqeq */

                if(mappedElem.parentId)
                    // If the element is not at the root level, add it to its parent array of children.
                    mappedArr[mappedElem.parentId].children.push(mappedElem);
                // If the element is at the root level, add it to first level elements array.
                else tree.push(mappedElem);
            }

        return tree;
    };
    getTreeData = () => {
        const {employees, relations, getString} = this.props;
        const options = [];
        relations.forEach(r => {
            const employee = employees.filter(e => e.userId === r.userId)[0];
            if(employee)
                options.push({
                    ...employee,
                    parentId: r.parentId
                });
        });
        options.push({
            userId: emptyGuid,
            parentId: null,
            name: getString('PERSONNEL_RELATION')
        });
        return this.listToTree(options);
    };
    renderTreeNodes = treeData =>
        treeData.map(item => {
            const {children, ...data} = item;
            const title = <DropTargetNode data={data} onDelete={this.props.deleteRelation} onAdd={this.props.addRelation} />;
            if(item.children && item.children.length > 0)
                return (
                    <TreeNode title={title} key={item.userId} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            return <TreeNode title={title} key={item.userId} dataRef={item} />;
        });
    onExpand = expandedKeys => {
        this.props.onModifyState({
            expandedKeys,
            autoExpandParent: false
        });
    };
    onSelect = selectedKeys => {
        this.props.onModifyState({
            selectedKeys
        });
    };

    render() {
        const treeData = this.getTreeData();
        const uiState = this.props.uiState;
        return (
            <Tree
                autoExpandParent={uiState.autoExpandParent}
                onExpand={this.onExpand}
                expandedKeys={uiState.expandedKeys}
                onSelect={this.onSelect}
                selectedKeys={uiState.selectedKeys}>
                {this.renderTreeNodes(treeData)}
            </Tree>
        );
    }
}

DraggableTree.propTypes = {
    getString: PropTypes.func.isRequired,
    addRelation: PropTypes.func,
    deleteRelation: PropTypes.func,
    employees: PropTypes.array,
    relations: PropTypes.array,
    uiState: PropTypes.object,
    onModifyState: PropTypes.func
};
import {connect} from 'react-redux';
import * as actions from '../actions.js';
import {selectorFactory} from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from '../localize';
const getEmployeeInfo = selectorFactory(['page', 'domainData', 'employeeAndRelation', 'data', 'employees']);
const getRelationInfo = selectorFactory(['page', 'appState', 'relations']);
const getUIState = selectorFactory(['page', 'uiState', 'droggableTree']);

const mapStateToProps = state => ({
    employees: getEmployeeInfo(state),
    relations: getRelationInfo(state),
    uiState: getUIState(state)
});

const mapDispatchToProps = dispatch => ({
    addRelation: (userId, parentId) => dispatch(actions.addRelation(userId, parentId)),
    deleteRelation: userId => dispatch(actions.deleteRelation(userId)),
    onModifyState: data => dispatch(actions.modifyDragTreeState(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(localize(DraggableTree));
