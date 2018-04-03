import React from 'react';
import {observer} from 'mobx-react'
import {Form, Input, DatePicker, Row, Col, Button} from 'antd';
import store from '../../stores/eventStore'
import moment from 'moment';

@observer(['events'])
class InputForm extends React.Component {

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };

    return (
      <Col>
        <Form
          onSubmit={store.handleSubmit}
        >
          <Form.Item
            {...formItemLayout}
            label='Start Date-Time'
          >
            <Row>
              <Col>
                <DatePicker
                  // disabledDate={currentDate => {
                  //   if (currentDate) {
                  //     // return pm.disabledEnd(
                  //     //   currentDate,
                  //     //   campaign.starts !== 0 ? moment(campaign.starts) : null
                  //     // )
                  //   }
                  // }}
                  // disabledTime={selectedDate => {
                  //   // if (selectedDate) {
                  //   //   return pm.addDisabledTimeEnd(selectedDate)
                  //   // }
                  //   // return false
                  // }}
                  showTime={{format: 'HH:mm'}}
                  placeholder="Start date"
                  format="YYYY-MM-DD HH:mm"
                  onChange={(date, dayString) => {
                    store.startDay = moment(dayString)
                    store.startDateTime = moment(date)
                    if (date === null) {
                      store.clearStart()
                      store.finalStartDateTime = null;
                    }
                  }}
                  value={store.finalStartDateTime}
                  onOk={() => {
                    store.finalStartDateTime = store.startDateTime
                  }}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label='End Date-Time'
          >
            <Row>
              <Col>
                <DatePicker
                  // disabledDate={currentDate => {
                  //   if (currentDate) {
                  //     // return pm.disabledEnd(
                  //     //   currentDate,
                  //     //   campaign.starts !== 0 ? moment(campaign.starts) : null
                  //     // )
                  //   }
                  // }}
                  // disabledTime={selectedDate => {
                  //   // if (selectedDate) {
                  //   //   return pm.addDisabledTimeEnd(selectedDate)
                  //   // }
                  //   // return false
                  // }}
                  showTime={{format: 'HH:mm'}}
                  placeholder="Start date"
                  format="YYYY-MM-DD HH:mm"
                  onChange={(date, dayString) => {
                    store.endDay = moment(dayString)
                    store.endDateTime = moment(date)
                    if (date === null) {
                      store.clearEnd()
                      store.finalEndDateTime = null;
                    }
                  }}
                  value={store.finalEndDateTime}
                  onOk={() => {
                    store.finalEndDateTime = store.endDateTime
                  }}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            label='Event Title'
            {...formItemLayout}
          >
            <Input
              value={store.eventTitle}
              style={{width: 175}}
              onChange={store.onChange}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: {span: 24, offset: 0},
              sm: {span: 16, offset: 8},
            }}
          >
            <Button type="primary" htmlType="submit" disabled={store.disabledItem}>Submit</Button>
          </Form.Item>
        </Form>
      </Col>
    )
  }
}

export default InputForm
