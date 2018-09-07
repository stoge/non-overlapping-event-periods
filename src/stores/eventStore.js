import { observable, action, computed } from 'mobx';
import Moment from 'moment'
import sort from 'short-uuid';
import { map, isEmpty, union, filter, sortBy } from 'lodash';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment)

class EventStore {
  @observable actualStartDate = null
  @observable initialStartDate = null
  @observable finalStartDate = null

  @observable actualEndDate = null
  @observable initialEndDate = null
  @observable finalEndDate = null

  @observable disabledMinutes = []
  @observable disabledHours = []

  @observable eventTitle = ''
  @observable events = [
    // {
    //   id: sort().new(),
    //   title: 'test1',
    //   start: moment().add(1, 'days'),
    //   end: moment().add(2,'days')
    // },
    // {
    //   id: sort().new(),
    //   title: 'test2',
    //   start: moment().subtract(10, 'd'),
    //   end: moment().subtract(10, 'd').add(2, 'hours'),
    // },
    {
      id: sort().new(),
      title: 'test3',
      start: moment().add(2, 'hours').add(1,'d'),
      end: moment().add(4, 'hours').add(1,'d'),
    },
    {
      id: sort().new(),
      title: 'test4',
      start: moment().add(5, 'hours').add(1,'d'),
      end: moment().add(7, 'hours').add(1,'d'),
    },
    // {
    //   id: sort().new(),
    //   title: 'test5',
    //   start: moment().add(10, 'minutes'),
    //   end: moment().add(20, 'minutes'),
    // },
    // {
    //   id: sort().new(),
    //   title: 'test6',
    //   start: moment().add(10, 'minutes'),
    //   end: moment().add(20, 'minutes'),
    // },
  ]


  @computed
  get disabledISubmit () {
    return !(this.finalStartDate && this.finalEndDate && this.eventTitle)
  }

  @computed
  get disabledReset () {
    return !(this.finalStartDate || this.finalEndDate || this.eventTitle)
  }

  @action.bound
    handleSubmit = (e,form) => {
    e.preventDefault();
    this.createEvent();
    this.resetForm(form)
  }

  @action.bound
    clearStart = () => {
    this.actualStartDate = null
    this.initialStartDate = null
    this.finalStartDate = null
  }

  @action.bound
  clearEnd = () => {
    this.actualEndDate = null
    this.initialEndDate = null
    this.finalEndDate = null
  }

  handleStartDateChange (date) {
    if (this.initialStartDate && this.initialStartDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')) {
      this.actualStartDate = date
    } else {
      this.initialStartDate = date
      this.actualStartDate = date
    }
  }

  handleEndDateChange (date) {
    if (this.initialEndDate && this.initialEndDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')) {
      this.actualEndDate = date
    } else {
      this.initialEndDate = date
      this.actualEndDate = date
    }
  }

  checkPastDay (currentDay) {
    return moment(currentDay.format('YYYY-MM-DD')).isBefore(
      moment().format('YYYY-MM-DD')
    )
  }

  checkIfBeforeEndDay (currentDay) {
    if (this.initialEndDate) {
      return moment(currentDay.format('YYYY-MM-DD')).isAfter(
        moment(this.initialEndDate, 'YYYY-MM-DD')
      )
    }
  }

  existingCampaignDay (currentDay) {
    const existingEvents = this.events
    let curDay = currentDay.format('YYYY-MM-DD')

    for (let i = 0; i < existingEvents.length; i++) {
      let existingCampaignStartDay = moment(existingEvents[i].start).format(
        'YYYY-MM-DD'
      )
      let existingCampaignEndDay = moment(existingEvents[i].end).format(
        'YYYY-MM-DD'
      )
      if (
        moment(curDay).isAfter(existingCampaignStartDay) &&
        moment(curDay).isBefore(existingCampaignEndDay)
      ) {
        return true
      }
    }
  }

  isEndSelected (currentDay) {
    if (this.finalEndDate) {
      const existingEvents = sortBy(this.events, event => {
        return event.end
      })
      let nearestEnd = null
      for (let i = 0; i < existingEvents.length; i++) {
        if (existingEvents[i].end.isBefore(this.finalEndDate)) {
          nearestEnd = existingEvents[i].end
        }
      }
      if (nearestEnd) {
        return moment(currentDay,'YYYY-MM-DD').isBefore(moment(nearestEnd,'YYYY-MM-DD')) &&
              moment(currentDay,'YYYY-MM-DD') !== moment(nearestEnd,'YYYY-MM-DD')
      }
    }
  }

  isStartSelected (currentDay) {
    if (this.finalStartDate) {
      const existingEvents = sortBy(this.events, event => {
        return event.end
      })
      let nearestStart = null
      for (let i = 0; i < existingEvents.length; i++) {
        if (existingEvents[i].start.isAfter(this.finalStartDate)) {
          nearestStart = existingEvents[i].start
        }
      }
      if (nearestStart) {
        return moment(currentDay,'YYYY-MM-DD').isAfter(moment(nearestStart,'YYYY-MM-DD')) &&
              moment(currentDay,'YYYY-MM-DD') !== moment(nearestStart,'YYYY-MM-DD')
      }
    }
  }

  disabledStart (currentDate, endDay) {
    if (endDay) {
      this.initialEndDate = endDay
    }
    // Check if currentDate is in past
    if (this.checkPastDay(currentDate)) {
      return true
    }
    // Given an EndDate, check if current date is before end date
    if (this.checkIfBeforeEndDay(currentDate)) {
      return true
    }
    // Checks if date is within a period of an existing campaign
    if (this.existingCampaignDay(currentDate)) {
      return true
    }
    // Check for overlapping campaigns
    if (this.isEndSelected(currentDate)) {
      return true
    }

    return false
  }

  disabledEnd (currentDate, startDay) {
    if (startDay) {
      this.initialStartDate = startDay
    }
    if (this.checkPastDay(currentDate)) {
      return true
    }
    if (this.checkIfAfterStartDay(currentDate)) {
      return true
    }
    if (this.checkExistingCampaignDay(currentDate)) {
      return true
    }
    if (this.isStartSelected(currentDate)) {
      return true
    }
    return false
  }

  checkIfAfterStartDay (currentDate) {
    if (!this.initialStartDate) {
      return this.checkPastDay(currentDate)
    }

    return currentDate.isBefore(this.initialStartDate.format('YYYY-MM-DD'))
  }

  checkExistingCampaignDay (currentDate) {
    const existingEvents = this.events
    for (var i = 0; i < existingEvents.length; i++) {
      let existingCampaignStartDay = moment(existingEvents[i].start).format(
        'YYYY-MM-DD'
      )
      let existingCampaignEndDay = moment(existingEvents[i].end).format(
        'YYYY-MM-DD'
      )
      if (
        moment(existingCampaignStartDay).isBefore(
          currentDate.format('YYYY-MM-DD')
        ) &&
        moment(existingCampaignEndDay).isAfter(
          currentDate.format('YYYY-MM-DD')
        )
      ) {
        return true
      }
    }
  }

  disablePastTime (selectedDate) {
    if (
      selectedDate.date() === moment().date() &&
      selectedDate.month() === moment().month() &&
      selectedDate.year() === moment().year()
    ) {
      this.getDisabledHoursBefore(moment().hour()-1)
      if (selectedDate.hour() === moment().hour()) {
        this.getDisabledMinutesBefore(moment().minutes())
      }
    }
  }

  handleHourPreview (selectedDate) {
    const existingEvents = this.events
    if (!isEmpty(existingEvents)){
      for (var i = 0; i < existingEvents.length; i++) {
        if (
          selectedDate.format('YYYY-MM-DD') ===
          existingEvents[i].start.format('YYYY-MM-DD') &&
          selectedDate.format('YYYY-MM-DD') ===
          existingEvents[i].end.format('YYYY-MM-DD')
        ) {
          this.getDisabledHoursFromTo(
            existingEvents[i].start.hour(),
            existingEvents[i].end.hour()
          )
        } else if (
          selectedDate.format('YYYY-MM-DD') ===
          existingEvents[i].start.format('YYYY-MM-DD')
        ) {
          this.getDisabledHoursAfter(existingEvents[i].start.hour()+1)
        } else if (
          selectedDate.format('YYYY-MM-DD') ===
          existingEvents[i].end.format('YYYY-MM-DD')
        ) {
          this.getDisabledHoursBefore(existingEvents[i].end.hour()-1)
        }
      }
    }
  }

  handleMinutesPreview(selectedDate) {
    const selectedDayEvents = filter(this.events, event => {
      return selectedDate.format('YYYY-MM-DD') === event.start.format('YYYY-MM-DD') ||
        selectedDate.format('YYYY-MM-DD') === event.end.format('YYYY-MM-DD')
    })
    if (!isEmpty(selectedDayEvents)) {
      for (var i = 0; i < selectedDayEvents.length; i++) {
        if (selectedDate.format('YYYY-MM-DD') === selectedDayEvents[i].start.format('YYYY-MM-DD') &&
            selectedDate.format('YYYY-MM-DD') === selectedDayEvents[i].end.format('YYYY-MM-DD')) {
          // event starts and ends at same day
          if (selectedDate.hour() === selectedDayEvents[i].start.hour() &&
            selectedDate.hour() === selectedDayEvents[i].end.hour()
          ) {
            this.getDisabledMinutesFromTo(selectedDayEvents[i].start.minutes(), selectedDayEvents[i].end.minutes())
          } else if (selectedDate.hour() === selectedDayEvents[i].start.hour()) {
            this.getDisabledMinutesAfter(selectedDayEvents[i].start.minutes())
          } else if(selectedDate.hour() === selectedDayEvents[i].end.hour()){
            this.getDisabledMinutesBefore(selectedDayEvents[i].end.minutes())
          }
        } else if (selectedDate.format('YYYY-MM-DD') === selectedDayEvents[i].start.format('YYYY-MM-DD')) {
          this.getDisabledMinutesAfter(selectedDayEvents[i].start.minutes())
        } else if (selectedDate.format('YYYY-MM-DD') === selectedDayEvents[i].end.format('YYYY-MM-DD')){
          this.getDisabledMinutesBefore(selectedDayEvents[i].end.minutes())
        }
      }
    }
  }


  disabledTimeForEnd (selectedDate) {
    this.disabledHours = []
    this.disabledMinutes = []
    this.disablePastTime(selectedDate)
    this.handleHourPreview(selectedDate)
    this.handleMinutesPreview(selectedDate)
    this.handleSelectedStartDate(selectedDate)

    return {
      disabledHours: () => this.disabledHours,
      disabledMinutes: () => this.disabledMinutes
    }
  }

  disabledTimeForStart (selectedDate) {
    this.disabledHours = []
    this.disabledMinutes = []
    this.disablePastTime(selectedDate)
    this.handleHourPreview(selectedDate)
    this.handleMinutesPreview(selectedDate)
    this.handleSelectedEndDate(selectedDate)
    return {
      disabledHours: () => this.disabledHours,
      disabledMinutes: () => this.disabledMinutes
    }
  }

  getDisabledHoursFromTo(fromHour, toHour) {
    let rangeHours = []

    if (!isNaN(parseInt(fromHour) && !isNaN(parseInt(toHour)))) {
      for (let i = 0; i < toHour; i++) {
        if (i > fromHour) {
          rangeHours.push(i)
        }
      }
    }
    this.disabledHours = union(this.disabledHours, rangeHours)
  }

  getDisabledMinutesFromTo(fromMinutes, toMinutes) {
    let rangeMinutes = []

    if (!isNaN(parseInt(fromMinutes) && !isNaN(parseInt(toMinutes)))) {
      for (let i = 0; i < toMinutes; i++) {
        if (i > fromMinutes) {
          rangeMinutes.push(i)
        }
      }
    }
    this.disabledMinutes = union(this.disabledMinutes,rangeMinutes)
  }

  getDisabledHoursAfter(afterHour) {
    let rangeHours = []

    if(!isNaN(parseInt(afterHour))) {
      for (let i = 0; i <= 23; i++) {
        if (i >= afterHour) {
          rangeHours.push(i)
        }
      }
    }
    this.disabledHours = union(rangeHours, this.disabledHours)
  }

  getDisabledHoursBefore(beforeHour) {
    let rangeHours = []

    if (!isNaN(parseInt(beforeHour))) {
      for (let j = 0; j <= 23; j++) {
        if (j <= beforeHour) {
          rangeHours.push(j)
        }
      }
    }

    this.disabledHours = union(rangeHours, this.disabledHours)
  }

  getDisabledMinutesAfter(minutesAfter) {
    let rangeMinutes = []

    if(!isNaN(parseInt(minutesAfter))) {
      for (let i = 0; i <= 59; i++) {
        if (i >= minutesAfter) {
          rangeMinutes.push(i)
        }
      }
    }
    this.disabledMinutes = union(rangeMinutes, this.disabledMinutes)
  }

  getDisabledMinutesBefore(minutesBefore) {
    let rangeMinutes = []

    if (!isNaN(parseInt(minutesBefore))) {
      for (let j = 0; j <= 59; j++) {
        if (j <= minutesBefore) {
          rangeMinutes.push(j)
        }
      }
    }
    this.disabledMinutes = union(rangeMinutes,this.disabledMinutes)
  }

  handleSelectedEndDate (selectedDate) {
    if (this.finalEndDate) {
      const selectedDayEvents = filter(this.events, event => {
        return selectedDate.format('YYYY-MM-DD') === event.start.format('YYYY-MM-DD') ||
          selectedDate.format('YYYY-MM-DD') === event.end.format('YYYY-MM-DD')
      })
      if (!isEmpty(selectedDayEvents)) {
        for (var i = 0; i < selectedDayEvents.length; i++) {
          if (selectedDate.format('YYYY-MM-DD') === selectedDayEvents[i].end.format('YYYY-MM-DD')) {
            this.getDisabledHoursBefore(selectedDayEvents[i].end.hour()-1)
            if( selectedDate.hour() === selectedDayEvents[i].end.hour()) {
              this.getDisabledMinutesBefore(selectedDayEvents[i].end.minute())
            }
          }
        }
      }
      if (selectedDate.format('YYYY-MM-DD') === this.finalEndDate.format('YYYY-MM-DD')) {
        this.getDisabledHoursAfter(this.finalEndDate.hour()+1)
        if (selectedDate.hour() === this.finalEndDate.hour()) {
          this.getDisabledMinutesAfter(this.finalEndDate.minute())
        }
      }
    }
  }

  handleSelectedStartDate(selectedDate) {
    if (this.finalStartDate) {
      const selectedDayEvents = filter(this.events, event => {
        return selectedDate.format('YYYY-MM-DD') === event.start.format('YYYY-MM-DD') ||
          selectedDate.format('YYYY-MM-DD') === event.end.format('YYYY-MM-DD')
      })
      if (!isEmpty(selectedDayEvents)) {
        for (var i = 0; i < selectedDayEvents.length; i++) {
          if (selectedDate.format('YYYY-MM-DD') === selectedDayEvents[i].start.format('YYYY-MM-DD')) {
            this.getDisabledHoursAfter(selectedDayEvents[i].start.hour()+1)
            if( selectedDate.hour() === selectedDayEvents[i].start.hour()) {
              this.getDisabledMinutesAfter(selectedDayEvents[i].start.minute())
            }
          }
        }
      }
      if (selectedDate.format('YYYY-MM-DD') === this.finalStartDate.format('YYYY-MM-DD')) {
        this.getDisabledHoursBefore(this.finalStartDate.hour()-1)
        if (selectedDate.hour() === this.finalStartDate.hour()) {
          this.getDisabledMinutesBefore(this.finalStartDate.minute())
        }
      }
    }
  }


  @action.bound
  onChange = (e) => {
    this.eventTitle = e.target.value
  }

  @action.bound
  createEvent = () => {
   this.events =
     [
       ...this.events,
      {
        id: sort().new(),
        title: this.eventTitle,
        start: this.finalStartDate,
        end: this.finalEndDate,
      }
     ]
  }

  @action.bound
  deleteEvent = (eventId) => {
    this.events = filter(this.events, event => {
      return event.id !== eventId
    })
  }

  @action.bound
  resetForm = (form) => {
    form.resetFields();
    this.clearEnd();
    this.clearStart();
    this.eventTitle = '';
  }

  @computed
  get calendarEvents () {
    return map(this.events, event => {
      return {
        ...event,
        start: event.start.toDate(),
        end: event.end.toDate()
      }
    })
  }


}

const inst = new EventStore()
export default inst