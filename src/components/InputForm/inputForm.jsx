import React from 'react';
import { Form, Input, DatePicker, Row, Col, Button } from 'antd';
import store from '../../stores/eventStore'
import moment from 'moment';


const FormItem = Form.Item

class InputForm extends React.Component {

    render(){

      const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

      return (
        <Col>
          <Form
            onSubmit={store.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label='Start Date-Time'
            >
            <Row>
              <Col>
              <DatePicker
                value={store.finalStartDateTime}
                disabledDate={currentDate => {
                  if (currentDate) {
                    // return pm.disabledEnd(
                    //   currentDate,
                    //   campaign.starts !== 0 ? moment(campaign.starts) : null
                    // )
                  }
                }}
                disabledTime={selectedDate => {
                  // if (selectedDate) {
                  //   return pm.addDisabledTimeEnd(selectedDate)
                  // }
                  // return false
                }}
                showTime={{ format: 'HH:mm' }}
                placeholder="Start date"
                format="YYYY-MM-DD HH:mm"
                onChange={(date, dayString) => {
                  debugger
                  store.startDay = moment(dayString)
                  store.startDateTime = moment(date)
                  // if (date === null) {
                  //   pm.clearEnd()
                  // }
                }}
                onOk={() => {
                  store.finalStartDateTime = store.startDateTime
                }}
              />
              </Col>
            </Row>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='End Date-Time'
            >
            <Row>
              <Col>
                <DatePicker/>
              </Col>
            </Row>
            </FormItem>
            <FormItem
             wrapperCol={{
               xs: { span: 24, offset: 0 },
               sm: { span: 16, offset: 8 },
             }}
           >
             <Button type="primary" htmlType="submit">Submit</Button>
           </FormItem>
          </Form>
        </Col>
      )
    }
}
export default InputForm
