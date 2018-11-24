import Vue from 'vue'
import Router from 'vue-router'
import RankingBoard from '../components/rankingboard.vue'
import StatusList from '../components/statuslist.vue'
import Home from '../components/home.vue'


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/ranking_board',
            name: 'RankingBoard',
            component: RankingBoard
        },
        {
            path: '/status_list',
            name: 'StatusList',
            component: StatusList
        },
        { path: '*', redirect: "/"}
    ]
})