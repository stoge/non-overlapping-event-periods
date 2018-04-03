import { observable, action, computed, toJS } from 'mobx'
import moment from 'moment'

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

  @observable events = []

  @action.bound
  handleSubmit = (e) => {
     e.preventDefault();
     debugger;
   }
}

export default new EventStore()
