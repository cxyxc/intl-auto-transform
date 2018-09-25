import React from 'react';
import {Form, Row, Col, Button} from 'antd';
import PropTypes from 'prop-types';
import TextInput from 'Shared/components/TextInput';
const FormItem = Form.Item;
import styles from './style.css';
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
};
export class ReturnVehiclePanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            returnReason: ''
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    handleFilterChange(value, id) {
        this.setState({returnReason: value});
    }

    handleOk() {
        this.props.onOK(this.state.returnReason);
    }

    render() {
        return (
            <Form className="form-standard">
                <Row>
                    <Col>
                        <FormItem label={this.props.getString('RETURN_REASON')} {...formItemLayout} colon={false} required>
                            <div>
                                <TextInput id="returnReason" type="textarea" value={this.state.returnReason}
                                    onBlur={this.handleFilterChange} />
                            </div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col className={this.props.rtl ? `${styles.rtlTextLeft} ${styles.floatNone}` : 'col-align-right'}>
                        <Button onClick={this.props.onCancel}>{this.props.getString('ON_CANCEL')}</Button>
                        <Button type="primary" onClick={this.handleOk}>{this.props.getString('ON_OK')}</Button>
                    </Col>
                </Row>
            </Form>
          
        );
    }
}

ReturnVehiclePanel.propTypes = {
    getString: PropTypes.func.isRequired,
    rtl: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOK: PropTypes.func.isRequired,
};

import {localize} from './localize';

export default localize(ReturnVehiclePanel);
