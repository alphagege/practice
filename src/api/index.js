import {generate} from '../utils/apiGenerator';
import menu from './menu'
import roles from './roles'
import user from './user'
import roleAuths from './roleAuths'
import dictCtr from './dictCtr'
import dictType from './dictType'
import org from './org'
import login from './login'
import employeeManager from './employeeManager'
import orgManager from './orgManager'
import positionManager from './positionManager'
import app from './app'

const api = {
  menu,
  roles,
  user,
  roleAuths,
  dictCtr,
  dictType,
  org,
  employeeManager,
  orgManager,
  positionManager,
  login,
  app

}

export default generate(api);
