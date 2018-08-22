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
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <Form
        onSubmit={store.handleSubmit}
      >
        <Row
          style={{display: 'flex', justifyContent: 'space-around'}}
        >
          <Col>
            <Form.Item
              label='Start Day-Time: '
              {...formItemLayout}
            >
              <DatePicker
                disabledDate={currentDate => {
                  if (currentDate) {
                    return store.disabledEnd(
                      currentDate,
                      !!store.startDateTime ? store.startDateTime : null
                    )
                  }
                }}
                disabledTime={selectedDate => {
                  if (selectedDate) {
                    return store.addDisabledTimeEnd(selectedDate)
                  }
                  return false
                }}
                showTime={{format: 'HH:mm'}}
                placeholder="Start date"
                format="YYYY-MM-DD HH:mm"
                onChange={(date, dayString) => {
                  store.startDay = moment(dayString)
                  store.startDateTime = moment(date)
                  store.finalStartDateTime = store.startDateTime
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
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='End Date-Time: '
              {...formItemLayout}
            >
              <DatePicker
                disabledDate={currentDate => {
                  if (currentDate) {
                    return store.disabledEnd(
                      currentDate,
                      !!store.endDateTime ? store.endDateTime : null
                    )
                  }
                }}
                disabledTime={selectedDate => {
                  if (selectedDate) {
                    return store.addDisabledTimeEnd(selectedDate)
                  }
                  return false
                }}
                showTime={{format: 'HH:mm'}}
                placeholder="Start date"
                format="YYYY-MM-DD HH:mm"
                onChange={(date, dayString) => {
                  store.endDay = moment(dayString)
                  store.endDateTime = moment(date)
                  store.finalEndDateTime = store.endDateTime
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
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='Event Title: '
              {...formItemLayout}
            >
              <Input
                value={store.eventTitle}
                style={{width: 175}}
                onChange={store.onChange}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button
                onClick={store.resetForm}
                type="danger"
                disabled={store.disabledReset}
              >
                Reset
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={store.disabledISubmit}
                style={{marginLeft: 8}}
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default InputForm
