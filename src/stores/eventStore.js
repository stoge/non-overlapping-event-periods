import { observable, action, computed, toJS } from 'mobx';
import moment from 'moment'
import sort from 'short-uuid';
import { map } from 'lodash';

class EventStore {
  @observable startDateTime = null
  @observable startDay = null
  @observable finalStartDateTime = null

  @observable endDateTime = null
  @observable endDay = null
  @observable finalEndDateTime = null

  @observable sameDayCampaign = null
  @observable sameDayCampaignFlag = false
  @observable sameDayCampaignType = ''

  @observable.ref disabledMinutes = []
  @observable.ref disabledHours = []

  @observable eventTitle = ''
  @observable events = []


  @computed
  get disabledISubmit () {
    return !(this.finalStartDateTime && this.finalEndDateTime && this.eventTitle)
  }

  @computed
  get disabledReset () {
    return !(this.finalStartDateTime || this.finalEndDateTime || this.eventTitle)
  }

  @action.bound
    handleSubmit= (e) => {
    e.preventDefault();
    this.createEvent();
    this.resetForm();
  }

  @action.bound
    clearStart = () => {
    this.startDateTime = null
    this.startDay = null
    this.finalStartDateTime = null

    if (this.sameDayCampaignType === 'starts') {
    this.sameDayCampaign = null
    this.sameDayCampaignFlag = false
    this.sameDayCampaignType = ''
    }
  }

  @action.bound
  clearEnd = () => {
    this.endDateTime = null
    this.endDay = null
    this.finalEndDateTime = null

    if (this.sameDayCampaignType === 'ends') {
    this.sameDayCampaign = null
    this.sameDayCampaignFlag = false
    this.sameDayCampaignType = ''
    }
  }

  @action.bound
  checkPastDay = (currentDay) => {
    return moment(currentDay.format('YYYY-MM-DD')).isBefore(moment().format('YYYY-MM-DD'))
  }

  @action.bound
  checkIfAfterDay = (currentDay) => {
    if (this.endDay) {
      return moment(currentDay.format('YYYY-MM-DD')).isAfter(moment(this.endDay, 'YYYY-MM-DD'))
    }
  }

  @action.bound
  existingCampaignDay = (currentDay) => {
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

  @action.bound
  checkExistingEndSelected = (currentDay) => {
    const existingEvents = this.events
    let curDay = currentDay.format('YYYY-MM-DD')

    for (var i = 0; i < existingEvents.length; i++) {
      let existingCampaignStartDay = moment(existingEvents[i].start).format(
        'YYYY-MM-DD'
      )
      let existingCampaignEndDay = moment(existingEvents[i].end).format(
        'YYYY-MM-DD'
      )
      if (
        moment(existingCampaignStartDay).isAfter(
          moment(curDay).format('YYYY-MM-DD')
        ) &&
        moment(this.endDay, 'YYYY-MM-DD').isAfter(
          moment(existingCampaignEndDay)
        )
      ) {
        return true
      }
    }
  }

  disabledStart (currentDate, endDay) {
    if (endDay) {
      this.endDay = endDay
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
    if (this.endDay) {
      if (this.checkExistingEndSelected(currentDate)) {
        return true
      }
    }
    return false
  }

  disabledEnd (currentDate, startDay, eventId) {
    if (startDay) {
      this.startDay = startDay
    }
    if (this.checkPastDay(currentDate)) {
      return true
    }
    if (this.checkIfAfterStartDay(currentDate)) {
      return true
    }
    if (this.checkExistingCampaignDay(currentDate, eventId)) {
      return true
    }
    if (this.startDay) {
      if (this.checkExistingStartSelected(currentDate)) {
        return true
      }
    }
    return false
  }

  checkIfAfterStartDay (currentDate) {
    if (!this.startDay) {
      return this.checkPastDay(currentDate)
    }

    return currentDate.isBefore(this.startDay.format('YYYY-MM-DD'))
  }

  checkExistingCampaignDay (currentDate, eventId) {
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
        ) &&
        eventId !== existingEvents[i].id
      ) {
        return true
      }
    }
  }

  checkExistingStartSelected (currentDate) {
    const existingEvents = this.events
    if (this.sameDayCampaignFlag) {
      if (this.sameDayCampaign) {
        if (
          !moment(currentDate.format('YYYY-MM-DD')).isSame(
            this.sameDayCampaign.format('YYYY-MM-DD')
          )
        ) {
          return true
        }
      }
    }
    for (var i = 0; i < existingEvents.length; i++) {
      let existingCampaignStartDay = moment(existingEvents[i].start).format(
        'YYYY-MM-DD'
      )
      if (
        moment(currentDate.format('YYYY-MM-DD')).isSame(
          existingCampaignStartDay
        )
      ) {
        this.sameDayCampaignFlag = true
        return false
      }
    }
  }

  checkPastTime (selectedDate) {
    if (
      selectedDate.date() === moment().date() &&
      selectedDate.month() === moment().month() &&
      selectedDate.year() === moment().year()
    ) {
      this.getDisabledAfterTime(moment().hour(), moment().minute())
    }
  }

  checkNotBeforeStartTime (selectedDate) {
    if (this.startDay) {
      if (
        selectedDate.format('YYYY-MM-DD') === this.startDay.format('YYYY-MM-DD')
      ) {
        if (this.sameDayCampaign) {
          switch (this.sameDayCampaignType) {
            case 'starts': {
              if (selectedDate.hour() === this.startDay.hour()) {
                this.getDisabledBetweenTime(
                  this.startDay.hour(),
                  this.startDay.minutes(),
                  this.sameDayCampaign.hour(),
                  null
                )
              } else if (selectedDate.hour() === this.sameDayCampaign.hour()) {
                this.getDisabledBetweenTime(
                  this.startDay.hour(),
                  null,
                  this.sameDayCampaign.hour(),
                  this.sameDayCampaign.minutes()
                )
              } else {
                this.getDisabledBetweenTime(
                  this.startDay.hour(),
                  null,
                  this.sameDayCampaign.hour(),
                  null
                )
              }
              break
            }
            case 'ends': {
              if (selectedDate.hour() === this.startDay.hour()) {
                this.getDisabledBetweenTime(
                  this.startDay.hour(),
                  this.startDay.minutes(),
                  null,
                  null
                )
              } else if (selectedDate.hour() === this.sameDayCampaign.hour()) {
                this.getDisabledBetweenTime(
                  this.sameDayCampaign.hour(),
                  this.sameDayCampaign.minutes(),
                  null,
                  null
                )
              } else {
                if (selectedDate.isBefore(this.sameDayCampaign)) {
                  this.getDisabledBetweenTime(
                    this.sameDayCampaign.hour(),
                    59,
                    null,
                    null
                  )
                } else {
                  this.getDisabledBetweenTime(
                    this.sameDayCampaign.hour(),
                    0,
                    null,
                    null
                  )
                }
              }
              break
            }
          }
        } else {
          if (selectedDate.hour() === this.startDay.hour()) {
            this.getDisabledBetweenTime(
              this.startDay.hour(),
              this.startDay.minutes(),
              null,
              null
            )
          } else {
            this.getDisabledBetweenTime(this.startDay.hour(), null, null, null)
          }
        }
      }
    }
  }

  checkExistingTime (selectedDate) {
    const existing = this.existingCampaigns
    for (var i = 0; i < existing.length; i++) {
      if (
        existing[i].status === 'ACTIVE' &&
        selectedDate.format('YYYY-MM-DD') ===
        moment(existing[i].starts).format('YYYY-MM-DD')
      ) {
        this.sameDayCampaign = moment(existing[i].starts)
        this.sameDayCampaignType = 'starts'
        if (selectedDate.hour() === moment(existing[i].starts).hour()) {
          this.getDisabledAfterTime(
            moment(existing[i].starts).hour(),
            moment(existing[i].starts).minute()
          )
        } else if (selectedDate.isAfter(moment(existing[i].starts))) {
          this.getDisabledAfterTime(moment(existing[i].starts).hour(), 0)
        } else {
          this.getDisabledAfterTime(moment(existing[i].starts).hour(), 59)
        }
      }
      if (
        existing[i].status === 'ACTIVE' &&
        selectedDate.format('YYYY-MM-DD') ===
        moment(existing[i].expires).format('YYYY-MM-DD')
      ) {
        this.sameDayCampaign = moment(existing[i].expires)
        this.sameDayCampaignType = 'ends'
        if (selectedDate.hour() === moment(existing[i].expires).hour()) {
          this.getDisabledBeforeTime(
            moment(existing[i].expires).hour(),
            moment(existing[i].expires).minute()
          )
        } else if (selectedDate.isBefore(moment(existing[i].expires))) {
          this.getDisabledBeforeTime(moment(existing[i].expires).hour(), 59)
        } else {
          this.getDisabledBeforeTime(moment(existing[i].expires).hour(), 0)
        }
      }
    }
  }

  addDisabledTimeEnd (selectedDate) {
    this.disabledHours = []
    this.disabledMinutes = []
    this.checkPastTime(selectedDate)
    this.checkNotBeforeStartTime(selectedDate)

    return {
      disabledHours: () => this.disabledHours,
      disabledMinutes: () => this.disabledMinutes
    }
  }

  addDisabledTimeStart (selectedDate) {
    this.disabledHours = []
    this.disabledMinutes = []
    this.checkPastTime(selectedDate)
    this.checkExistingTime(selectedDate)

    return {
      disabledHours: () => this.disabledHours,
      disabledMinutes: () => this.disabledMinutes
    }
  }

  getDisabledAfterTime (hour, minute) {
    let rangeHours = []
    let rangeMinutes = []

    if (!isNaN(parseInt(hour))) {
      for (var i = 0; i <= 23; i++) {
        if (i > hour) {
          rangeHours.push(i)
        }
      }
    }

    if (!isNaN(parseInt(minute))) {
      for (var j = 0; j <= 59; j++) {
        if (j >= minute) {
          rangeMinutes.push(j)
        }
      }
    }

    this.disabledHours = rangeHours
    this.disabledMinutes = rangeMinutes
  }

  getDisabledBeforeTime (hour, minute) {
    let rangeHours = []
    let rangeMinutes = []

    if (!isNaN(parseInt(hour))) {
      for (var i = 0; i <= 23; i++) {
        if (i < hour) {
          rangeHours.push(i)
        }
      }
    }

    if (!isNaN(parseInt(minute))) {
      for (var j = 0; j <= 59; j++) {
        if (j <= minute) {
          rangeMinutes.push(j)
        }
      }
    }

    this.disabledHours = rangeHours
    this.disabledMinutes = rangeMinutes
  }
  getDisabledBetweenTime (beforeHours, beforeMinutes, afterHours, afterMinutes) {
    let rangeHours = []
    let rangeMinutes = []

    if (!isNaN(parseInt(beforeHours))) {
      for (let i = 0; i <= 23; i++) {
        if (i < beforeHours) {
          rangeHours.push(i)
        }
      }
    }

    if (!isNaN(parseInt(beforeMinutes))) {
      for (let j = 0; j <= 59; j++) {
        if (j <= beforeMinutes) {
          rangeMinutes.push(j)
        }
      }
    }

    if (!isNaN(parseInt(afterHours))) {
      for (let i = 0; i <= 23; i++) {
        if (i > afterHours) {
          rangeHours.push(i)
        }
      }
    }

    if (!isNaN(parseInt(afterMinutes))) {
      for (let j = 0; j <= 59; j++) {
        if (j >= afterMinutes) {
          rangeMinutes.push(j)
        }
      }
    }

    this.disabledHours = rangeHours
    this.disabledMinutes = rangeMinutes
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
        start: this.finalStartDateTime,
        end: this.finalEndDateTime,
      }
     ]
  }

  @action.bound
  resetForm = () => {
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