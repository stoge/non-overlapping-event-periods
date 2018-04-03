import React from 'react'
import { observer } from 'mobx-react'
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import store from '../../stores/eventStore'

@observer(['events'])
class MyCalendar extends React.Component {

  render() {
    BigCalendar.momentLocalizer(moment);

    return (
      <div style={{height: 'calc(100vh - 170px)'}}>
        <BigCalendar
          events={store.events.slice()}
        />
      </div>
    )
  }
}

export default MyCalendar;
