import { observable, action, computed, toJS } from 'mobx'

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
  get disabledItem () {
    return !(this.finalStartDateTime && this.finalEndDateTime && this.eventTitle)
  }

  @action.bound
    handleSubmit = (e) => {
    e.preventDefault();
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
  onChange = (e) => {
    this.eventTitle = e.target.value
  }

}

const inst = new EventStore()
export default inst