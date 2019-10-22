import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import axios from "axios";
import router from './router'
import { Message } from 'element-ui'
import './icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
//vant
import {
   Icon,
  PullRefresh,
  List,
  Dialog,
  Col,
  Row,
  Card,
  Progress,
  Panel,
  //button,
  Collapse,
  CollapseItem,
  ActionSheet,
  Field,
  Toast,
} from "vant";

Vue.use(store);
Vue.use(Message);
Vue.use(Icon);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(Dialog);
Vue.use(Col);
Vue.use(Row);
Vue.use(Card);
Vue.use(Progress);
Vue.use(Panel);
//Vue.use(button);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(ActionSheet);
Vue.use(Field);
Vue.use(Toast);
import util from './assets/js/util.js'
Vue.prototype.util = util
Vue.prototype.axios = axios;
Vue.prototype.toast = Toast;
Vue.prototype.message = Message;
Vue.prototype.store = store;
//vant

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
