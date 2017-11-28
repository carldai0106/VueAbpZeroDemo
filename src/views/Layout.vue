<style rel="styleesheet" lang="scss">
.router-fade-enter-active,
.router-fade-leave-active {
    transition: all 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
    // transform: translate3d(2rem, 0, 0);
    // transform: scale(0.7);
    // transform: translateX(1rem);
    opacity: 0;
}
</style>
<template>
    <aside class="wrapper">

        <!-- Main Header -->
        <header class="main-header">
            <HeaderPart></HeaderPart>
        </header>
        <!-- Left side column. contains the logo and sidebar -->
        <aside class="main-sidebar">

            <!-- sidebar: style can be found in sidebar.less -->
            <section class="sidebar">
                <!-- /.sidebar-menu -->
                <ul class="sidebar-menu" data-widget="tree">
                    <SideBarMenu v-for="(item, index) in menu" :key="index" :colorIndex="index" :menu="item"></SideBarMenu>
                </ul>
            </section>
            <!-- /.sidebar -->
        </aside>

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <!-- <transition enter-active-class="animated fadeInLeftBig" leave-active-class="animated fadeOutLeftBig" mode="out-in"> -->
            <transition name="router-fade" mode="out-in">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>

        <!-- /.page-wrapper -->

        <!-- Main Footer -->
        <footer class="main-footer">
            <!-- To the right -->
            <div class="pull-right hidden-xs">
               v 1.0
            </div>
            <!-- Default to the left -->
            <strong>© Copyright, DYH Company Inc. {{Year}}, </strong> All rights reserved.
        </footer>

        <!-- Control Sidebar -->
        <ChatSidebar v-if="application.features['SignalR']"></ChatSidebar>

    </aside>
</template>
<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import AbpScriptHelper from '../common/js/AbpScriptHelper';
import ChatSignalrService from '../services/admin/ChatSignalrService';
import HeaderPart from './layout/HeaderPart';
import ChatSidebar from './layout/chat/ChatSidebar';
import MenuUtils from '../components/sidebar/models/MenuUtils';
import SideBarMenu from '../components/sidebar/SideBarMenu';

export default {
    data() {
        return {
            Year: new Date().getFullYear(),
            menu: []
        };
    },
    computed: {
        ...mapState({
            application: state => state.session.application
        })
    },

    created() {
        this.menu = MenuUtils.getMenu.items;
    },
    mounted() {
        if (this.application.features['SignalR']) {
            AbpScriptHelper.initSignalR(() => {
                ChatSignalrService.init();
            });
        }

        this.setLayout();
    },
    methods: {
        setLayout() {
            this.tagIsReady('.sidebar-menu', () => {
                $('.sidebar-menu').tree();
                $('html, body, .wrapper').layout();
                // $('.page-wrapper').height($('.content-wrapper').height());
                // $(window).resize(() => {
                //     $('.page-wrapper').height($('.content-wrapper').height());
                // });
            });
        }
    },
    components: {
        HeaderPart,
        SideBarMenu,
        ChatSidebar
    }
};
</script>
