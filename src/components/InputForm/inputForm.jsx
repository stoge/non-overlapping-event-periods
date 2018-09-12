import React from 'react';
import {observer} from 'mobx-react'
import {Form, Input, DatePicker, Row, Col, Button} from 'antd';
import store from '../../stores/eventStore'

@observer(['events'])
class InputForm extends React.Component {


  render() {
    const { form } = this.props
    const { getFieldDecorator } = this.props.form
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
        onSubmit={(e)=>store.handleSubmit(e, form, store.eventModalMode)}
      >
        <Row
          style={{display: 'flex', justifyContent: 'space-around'}}
        >
          <Col>
            <Form.Item
              label='Start Day-Time: '
              {...formItemLayout}
            >
              {getFieldDecorator(
                'startTime'
              )(
                <DatePicker
                  //value={store.finalStartDate} // <-Not needed due to FieldDecorator
                  disabledDate={currentDate => {
                    if (currentDate) {
                      return store.disabledStart(
                        currentDate,
                        !!store.initialEndDate ? store.initialEndDate : null
                      )
                    }
                    return false
                  }}
                  disabledTime={selectedDate => {
                    if (selectedDate) {
                      return store.disabledTimeForStart(selectedDate)
                    }
                    return false
                  }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  onChange={(date, dayString) => {
                    if (date === null) {
                      store.clearStart()
                    } else {
                      store.handleStartDateChange(date)
                    }
                  }}
                  onOpenChange={(status) => {
                    if(!status && !store.finalStartDate){
                      form.setFieldsValue({
                        'startTime': null
                      })
                      store.clearStart()
                    }
                  }}
                  onOk={() => {
                    store.finalStartDate = store.actualStartDate
                    store.initialStartDate = store.actualStartDate
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='End Date-Time: '
              {...formItemLayout}
            >
              {getFieldDecorator(
                'endTime'
                )(
                <DatePicker
                // value={store.finalEndDate} // <-Not needed due to FieldDecorator
                disabledDate={currentDate => {
                  if (currentDate) {
                    return store.disabledEnd(
                      currentDate,
                      !!store.initialStartDate ? store.initialStartDate : null
                    )
                  }
                }}
                disabledTime={selectedDate => {
                  if (selectedDate) {
                    return store.disabledTimeForEnd(selectedDate)
                  }
                  return false
                }}
                showTime={{ format: 'HH:mm' }}
                placeholder="End date"
                format="YYYY-MM-DD HH:mm"
                onChange={(date, dayString) => {
                  if (date === null) {
                    store.clearEnd()
                  } else {
                    store.handleEndDateChange(date)
                  }
                }}
                onOk={() => {
                  store.finalEndDate = store.actualEndDate
                  store.initialEndDate = store.actualEndDate
                }}
                onOpenChange={(status) => {
                  if(!status && !store.finalEndDate){
                    form.setFieldsValue({
                      'endTime': null
                    })
                    store.clearEnd()
                  }
                }}
              />
              )}
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
                onClick={() => store.resetForm(form)}
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

export default Form.create()(InputForm)
