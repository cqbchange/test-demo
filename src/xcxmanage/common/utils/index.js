import CommUtils from '@comm/script/utils'
import store from '../../store'

const utils = {
  ...CommUtils,
  checkAccess(access){
      return true;
      if(!store.state.base.user.group_id){
          return true;
      }
      return store.state.base.user.permissions.indexOf(access)!==-1
  }
}
export default utils
