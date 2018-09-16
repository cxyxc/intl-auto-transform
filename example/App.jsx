import React from 'react';
import { Form, Row, Col, Card } from 'antd';
const FormItem = Form.Item;
export class Add extends React.PureComponent {
  render() {
    const columns = [{
      title: '用户名',
      dataIndex: 'username'
    }];
    return <Form>
            <Card>
                <Row>
                    <Col>
                        <FormItem label="整车销售">
                        </FormItem>
                    </Col>
                </Row>
            </Card>
        </Form>;
  }

}
export default Add;