import React from 'react'
import { observer } from 'mobx-react'
import { Modal, Button, Form, Input, DatePicker } from 'antd';
import store from '../../stores/eventStore'

@observer(['events'])
class EditModal extends React.Component {

  render () {

    const { form } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Modal
        title="Edit event"
        visible={store.isEventEdited}
        // onOk={}
        // onCancel={}
        footer={[
          <Button key="back" onClick={store.editEvent}>Cancel</Button>,
          <Button key="submit" type="primary">
            Submit
          </Button>,
        ]}
      >
        <Form.Item
          label='Event Title: '
        >
          <Input
            value={store.eventTitle}
            style={{width: 175}}
            onChange={store.onChange}
          />
        </Form.Item>
        <Form.Item
          label='Start Day-Time: '
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
        <Form.Item
          label='End Date-Time: '
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
      </Modal>
    )
  }
}


export default Form.create()(EditModal)
