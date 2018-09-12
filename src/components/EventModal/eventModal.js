import React from 'react'
import { observer } from 'mobx-react'
import { Modal, Button, Form, Input, DatePicker } from 'antd';
import store from '../../stores/eventStore'

@observer(['events'])
class EventModal extends React.Component {

  render () {

    const { form } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Modal
        title={store.eventModalMode === 'new' ? 'Create event' : 'Edit event'}
        visible={!!store.eventModalMode}
        footer={[
          <Button
            key="back"
            onClick={() => {store.openModal(null, null, form)}}
          >Cancel
          </Button>,
          <Button
            onClick={() => store.resetForm(form)}
            type="danger"
            disabled={store.disabledReset}
            key="reset"
          >
            Reset
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={store.disabledISubmit}
            onClick={(e)=>store.handleSubmit(e, form)}
          >
            Submit
          </Button>,
        ]}
      >
        <Form>
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
            label='Event starts: '
          >
            {getFieldDecorator(
              'startTime',
              { initialValue: store.finalStartDate }
            )(
              <DatePicker
                //value={store.finalStartDate} // <-Not needed due to FieldDecorator
                placeholder="Select start datetime"
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
            label='Event ends: '
          >
            {getFieldDecorator(
              'endTime',
              { initialValue: store.finalEndDate }
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
                placeholder="Select end datetime"
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
        </Form>
      </Modal>
    )
  }
}


export default Form.create()(EventModal)
