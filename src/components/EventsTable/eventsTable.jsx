import React from 'react'
import { observer } from 'mobx-react'
import { Table, Button, Popconfirm, Icon, Divider } from 'antd'
import moment from 'moment';
import store from '../../stores/eventStore'

@observer(['events'])
class EventsTable extends React.Component {

  columns = [
    {
      title:'Title',
      dataIndex: 'title',
      key: 'eventTitle'
    },
    {
      title: 'Event Start-time',
      dataIndex: 'start',
      key: 'eventStartTime',
      render: (text, record) => {
        return moment(record.start).format('YYYY-MM-DD HH:mm')
      }
    },
    {
      title: 'Event End-time',
      dataIndex: 'end',
      key: 'eventEndTime',
      render: (text, record) => {
        return moment(record.end).format('YYYY-MM-DD HH:mm')
      }
    },
    {
      title: 'Actions',
      key: 'eventActions',
      render: (text, record) => {
        return (
          <div>
            <Popconfirm
              placement="top"
              title="Are you sure you want to delete the event"
              onConfirm={() => store.deleteEvent(record.id)}
            >
              <Button
                type="danger"
                size="small"
              >
                <Icon type="delete" theme="outlined" />
              </Button>
            </Popconfirm>
            <Divider type="vertical" />
            <Button
              size="small"
              onClick={store.editEvent}
            >
              <Icon type="edit" theme="outlined" />
            </Button>
          </div>
        )
      }
    }
  ]

  render() {

    return (
      <div>
        <Table
        columns={this.columns}
        dataSource={store.events.slice()}
        rowKey={record => record.id}
        style={{ paddingRight: 20 }}
        />
      </div>
    )
  }
}

export default EventsTable;
